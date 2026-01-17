import { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
    SignOut, Briefcase, Clock, FolderOpen, ArrowRight,
    Envelope, ChatCircle, SpinnerGap, Info, Newspaper
} from '@phosphor-icons/react'
import GridBackground from '../../components/layout/GridBackground'
import OnboardingModal, { hasCompletedOnboarding } from '../../components/onboarding/OnboardingModal'
import './DashboardPage.css'

// Status mapping for display
const STATUS_CONFIG: Record<string, { label: string; class: string; color: string }> = {
    'planning': { label: 'PLANNING', class: 'planning', color: '#c084fc' },
    'active': { label: 'ACTIVE', class: 'active', color: '#60a5fa' },
    'done': { label: 'DONE', class: 'done', color: '#4ade80' },
    'archived': { label: 'ARCHIVED', class: 'archived', color: '#9ca3af' },
}

interface Project {
    id: string
    title?: string
    name?: string
    reference_id?: string
    status: string
    progress?: number
    current_phase?: string
    deadline?: string
    cover_image?: string
    hours_logged?: number
    updated_at?: string
}

interface Task {
    id: string
    project_id: string
    title: string
    description?: string
    status: string
    priority?: string
}



interface Article {
    id: string
    title: string
    slug?: string
    cover_image?: string
    created_at: string
    tags?: string[]
}

export default function DashboardPage() {
    const { user, profile, signOut } = useAuth()
    const navigate = useNavigate()
    const [projects, setProjects] = useState<Project[]>([])

    const [projectTasks, setProjectTasks] = useState<Record<string, Task[]>>({})
    const [stats, setStats] = useState({
        activeProjects: 0,
        totalProjects: 0,
        hoursUtilized: 0,
        totalAssets: 0
    })
    const [loading, setLoading] = useState(true)
    const [latestArticles, setLatestArticles] = useState<Article[]>([])
    const [error, setError] = useState<string | null>(null)
    const [showOnboarding, setShowOnboarding] = useState(false)

    // Check for onboarding on mount
    useEffect(() => {
        // Check URL params for onboarding trigger (from password reset)
        const urlParams = new URLSearchParams(window.location.search)
        const fromOnboarding = urlParams.get('welcome') === 'true'

        if (fromOnboarding || !hasCompletedOnboarding()) {
            setShowOnboarding(true)
            // Clean up URL
            if (fromOnboarding) {
                window.history.replaceState({}, '', window.location.pathname)
            }
        }
    }, [])

    // Fetch projects and client data
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return

            try {
                setLoading(true)
                setError(null)

                // Fetch projects for 'aa' brand only (Automation Affairs)
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('brand', 'aa')
                    .order('title', { ascending: true })

                if (projectsError) {
                    console.warn('Projects fetch error:', projectsError)
                    setProjects([])
                } else {
                    setProjects(projectsData || [])
                }

                // 2. Fetch Latest Articles (Public + Assigned)
                const { data: publicArticles } = await supabase
                    .from('knowledge_entries')
                    .select('*')
                    .eq('is_public_to_client', true)
                    .order('created_at', { ascending: false })
                    .limit(6)

                const { data: accessEntries } = await supabase
                    .from('knowledge_access')
                    .select('entry_id')
                    .eq('user_id', user.id)

                let assignedArticles: Article[] = []
                if (accessEntries?.length && accessEntries.length > 0) {
                    const entryIds = accessEntries.map(a => a.entry_id)
                    const { data: assignedData } = await supabase
                        .from('knowledge_entries')
                        .select('*')
                        .in('id', entryIds)
                        .order('created_at', { ascending: false })
                        .limit(6)
                    assignedArticles = (assignedData as Article[]) || []
                }

                // Merge, Dedup, Sort, Limit 6
                const allArticles = [...(publicArticles || []), ...assignedArticles] as Article[]
                const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.id, item])).values())
                uniqueArticles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                setLatestArticles(uniqueArticles.slice(0, 6))



                // Calculate stats
                const fetchedProjects = projectsData || []
                const activeCount = fetchedProjects.filter((p: Project) =>
                    ['planning', 'active'].includes(p.status)
                ).length

                const totalHours = fetchedProjects.reduce((sum: number, p: Project) =>
                    sum + (p.hours_logged || 0), 0
                )

                // Fetch tasks for all projects
                const projectIds = fetchedProjects.map((p: Project) => p.id)
                let totalAssetCount = 0

                if (projectIds.length > 0) {
                    try {
                        const { count: assetCount } = await supabase
                            .from('media_assets')
                            .select('*', { count: 'exact', head: true })
                            .in('project_id', projectIds)

                        totalAssetCount = assetCount || 0
                    } catch (assetErr) {
                        console.warn('Assets count fetch skipped:', assetErr)
                    }

                    try {
                        const { data: tasksData } = await supabase
                            .from('tasks')
                            .select('id, project_id, title, description, status, priority')
                            .in('project_id', projectIds)
                            .order('created_at', { ascending: false })

                        const grouped: Record<string, Task[]> = {}
                        tasksData?.forEach((task: Task) => {
                            if (!grouped[task.project_id]) grouped[task.project_id] = []
                            grouped[task.project_id].push(task)
                        })
                        setProjectTasks(grouped)
                    } catch (taskErr) {
                        console.warn('Tasks fetch skipped:', taskErr)
                    }
                }

                setStats({
                    activeProjects: activeCount,
                    totalProjects: fetchedProjects.length,
                    hoursUtilized: totalHours,
                    totalAssets: totalAssetCount
                })

            } catch (err) {
                console.error('Error fetching data:', err)
                setError((err as Error).message || 'Fehler beim Laden der Daten')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user?.id])

    // Realtime subscription for tasks
    useEffect(() => {
        if (projects.length === 0) return

        const projectIds = projects.map(p => p.id)

        const subscription = supabase
            .channel('dashboard-tasks-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks'
                },
                async (payload) => {
                    const taskProjectId = (payload.new as Task)?.project_id || (payload.old as Task)?.project_id
                    if (!projectIds.includes(taskProjectId)) return

                    try {
                        const { data: tasksData } = await supabase
                            .from('tasks')
                            .select('id, project_id, title, description, status, priority')
                            .in('project_id', projectIds)
                            .order('created_at', { ascending: false })

                        const grouped: Record<string, Task[]> = {}
                        tasksData?.forEach((task: Task) => {
                            if (!grouped[task.project_id]) grouped[task.project_id] = []
                            grouped[task.project_id].push(task)
                        })
                        setProjectTasks(grouped)
                    } catch (err) {
                        console.warn('[Realtime] Task update failed:', err)
                    }
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [projects])

    // Realtime subscription for projects
    useEffect(() => {
        if (!user?.id) return

        const subscription = supabase
            .channel('dashboard-projects-realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'projects'
                },
                async (payload) => {
                    const changedProject = (payload.new || payload.old) as Project & { brand?: string }
                    if (changedProject?.brand !== 'aa') return

                    try {
                        const { data: projectsData, error: projectsError } = await supabase
                            .from('projects')
                            .select('*')
                            .eq('brand', 'aa')
                            .order('updated_at', { ascending: false })

                        if (projectsError) throw projectsError
                        setProjects(projectsData || [])

                        const fetchedProjects = projectsData || []
                        const projectIds = fetchedProjects.map((p: Project) => p.id)
                        const activeCount = fetchedProjects.filter((p: Project) =>
                            ['planning', 'active'].includes(p.status)
                        ).length
                        const totalHours = fetchedProjects.reduce((sum: number, p: Project) =>
                            sum + (p.hours_logged || 0), 0
                        )

                        let totalAssetCount = 0
                        if (projectIds.length > 0) {
                            const { count: assetCount } = await supabase
                                .from('media_assets')
                                .select('*', { count: 'exact', head: true })
                                .in('project_id', projectIds)
                            totalAssetCount = assetCount || 0
                        }

                        setStats({
                            activeProjects: activeCount,
                            totalProjects: fetchedProjects.length,
                            hoursUtilized: totalHours,
                            totalAssets: totalAssetCount
                        })
                    } catch (err) {
                        console.warn('[Realtime] Project update failed:', err)
                    }
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [user?.id])

    const handleLogout = async (e?: MouseEvent) => {
        if (e) e.preventDefault()
        try {
            await signOut()
            navigate('/login')
        } catch (error) {
            console.error('Logout error:', error)
            navigate('/login')
        }
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'TBD'
        const date = new Date(dateString)
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const getGreetingName = () => {
        if (profile?.full_name) return profile.full_name
        if (user?.email) return user.email.split('@')[0]
        return 'Client'
    }

    const getStatusConfig = (status: string) => {
        return STATUS_CONFIG[status] || STATUS_CONFIG['planning']
    }

    const statsCards = [
        {
            icon: Briefcase,
            label: 'ACTIVE PROJECTS',
            value: stats.activeProjects.toString().padStart(2, '0'),
            suffix: `/${stats.totalProjects.toString().padStart(2, '0')}`
        },
        {
            icon: Clock,
            label: 'HOURS UTILIZED',
            value: stats.hoursUtilized > 0 ? stats.hoursUtilized.toFixed(1) : 'NO ACTIVE QUOTA',
            suffix: stats.hoursUtilized > 0 ? 'hrs' : '',
            isPlaceholder: stats.hoursUtilized === 0
        },
        {
            icon: FolderOpen,
            label: 'ASSET LIBRARY',
            value: stats.totalAssets.toString(),
            suffix: 'Files',
            link: '/assets'
        },
    ]

    return (
        <div className="client-dashboard">
            <GridBackground />
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-brand">
                    <img
                        src="/logo.svg"
                        alt="Automation Affairs"
                        className="header-logo"
                    />
                    <div className="header-brand-text">
                        <span className="header-brand-name">AUTOMATION<span className="brand-accent">AFFAIRS</span></span>
                        <span className="header-brand-tagline">CLIENT PORTAL</span>
                    </div>
                </div>

                <div className="header-right">
                    <div className="header-user">
                        <span className="user-name">{getGreetingName()}</span>
                        <span className="user-role">CLIENT ACCESS</span>
                    </div>

                    <div className="user-avatar">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" />
                        ) : (
                            <span>{getGreetingName()[0].toUpperCase()}</span>
                        )}
                    </div>

                    <button className="header-logout" onClick={handleLogout} title="Abmelden">
                        <SignOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-header-content">
                        <h1>YOUR PROJECTS</h1>
                        <p>Monitor progress, review milestones, and access project files in real-time.</p>
                    </div>
                    <div className="page-header-actions">
                        <button
                            className="btn-secondary"
                            onClick={() => setShowOnboarding(true)}
                            title="Info & Hilfe"
                        >
                            <Info size={16} />
                            INFO
                        </button>
                        <a href="mailto:hello@automationaffairs.com" className="btn-secondary">
                            <Envelope size={16} />
                            E-MAIL
                        </a>
                        <a href="https://wa.me/436605358688" target="_blank" rel="noopener noreferrer" className="btn-primary">
                            <ChatCircle size={16} />
                            WHATSAPP
                        </a>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="dashboard-loading">
                        <SpinnerGap size={32} className="loading-spinner" />
                        <p>Projekte werden geladen...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="dashboard-error">
                        <p>Fehler beim Laden: {error}</p>
                        <button onClick={() => window.location.reload()} className="btn-secondary">
                            Erneut versuchen
                        </button>
                    </div>
                )}

                {/* Projects Table */}
                {!loading && !error && (
                    <div className="projects-section">
                        <div className="projects-table">
                            <div className="table-header">
                                <span className="col-project">PROJECT IDENTIFIER</span>
                                <span className="col-status">CURRENT STATUS</span>
                                <span className="col-tasks">ACTIVE TASKS</span>
                                <span className="col-progress">PHASE PROGRESS</span>
                                <span className="col-milestone">DEADLINE</span>
                                <span className="col-details">DETAILS</span>
                            </div>

                            {projects.length > 0 ? (
                                projects.map((project) => {
                                    const statusConfig = getStatusConfig(project.status)
                                    const tasks = projectTasks[project.id] || []

                                    const calculatedProgress = tasks.length > 0
                                        ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
                                        : 0
                                    const progress = project.progress === 100 ? 100 : calculatedProgress

                                    return (
                                        <div key={project.id} className="table-row" onClick={() => navigate(`/projects/${project.id}`)} style={{ cursor: 'pointer' }}>
                                            <div className="col-project">
                                                <div className="project-icon">
                                                    {project.cover_image ? (
                                                        <img src={project.cover_image} alt="" />
                                                    ) : (
                                                        <Briefcase size={20} />
                                                    )}
                                                </div>
                                                <div className="project-info">
                                                    <span className="project-name">{project.title || project.name}</span>
                                                    <span className={`status-badge mobile-only ${statusConfig.class}`}>
                                                        ● {statusConfig.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-status">
                                                <span className={`status-badge ${statusConfig.class}`}>
                                                    ● {statusConfig.label}
                                                </span>
                                            </div>
                                            <div className="col-tasks">
                                                <div className="cell-content">
                                                    <span className="cell-value">
                                                        {tasks.length > 0
                                                            ? `${tasks.filter(t => t.status === 'done').length}/${tasks.length}`
                                                            : '—'
                                                        }
                                                    </span>
                                                    <span className="cell-label">TASKS</span>
                                                </div>
                                            </div>
                                            <div className="col-progress">
                                                <div className="cell-content">
                                                    <div className="progress-row">
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress-fill"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="cell-value">{progress}%</span>
                                                    </div>
                                                    <span className="cell-label">{project.current_phase || 'IN PROGRESS'}</span>
                                                </div>
                                            </div>
                                            <div className="col-milestone">
                                                <div className="cell-content">
                                                    <span className="cell-value">{formatDate(project.deadline)}</span>
                                                    <span className="cell-label">DEADLINE</span>
                                                </div>
                                            </div>
                                            <div className="col-details">
                                                <button className="btn-icon" title="Details anzeigen" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}>
                                                    <ArrowRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="table-empty">
                                    <div className="empty-state">
                                        <Briefcase size={48} className="empty-icon" />
                                        <h3>Keine aktiven Projekte</h3>
                                        <p>Sie haben derzeit keine aktiven Projekte.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="stats-grid">
                    {statsCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`stat-card ${stat.link ? 'clickable' : ''}`}
                            onClick={stat.link ? () => navigate(stat.link!) : undefined}
                            style={stat.link ? { cursor: 'pointer' } : undefined}
                        >
                            <div className="stat-icon">
                                <stat.icon size={24} />
                            </div>
                            <div className="stat-content">
                                <span className="stat-label">{stat.label}</span>
                                <div className="stat-value">
                                    {stat.isPlaceholder ? (
                                        <span className="value-placeholder">{stat.value}</span>
                                    ) : (
                                        <>
                                            <span className="value-main">{stat.value}</span>
                                            <span className="value-suffix">{stat.suffix}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Latest Articles Section */}
                <div className="articles-section">
                    <div className="section-header">
                        <h2>LATEST ARTICLES</h2>
                        <button className="btn-link" onClick={() => navigate('/knowledge')}>
                            VIEW ALL ARTICLES →
                        </button>
                    </div>

                    {latestArticles.length > 0 ? (
                        <div className="articles-grid">
                            {latestArticles.map((article) => (
                                <div
                                    key={article.id}
                                    className="article-tile-compact"
                                    onClick={() => navigate(`/knowledge/${article.slug || article.id}`)}
                                >
                                    <div className="article-tile-icon">
                                        {article.cover_image ? (
                                            <img src={article.cover_image} alt="" />
                                        ) : (
                                            <Newspaper size={20} />
                                        )}
                                    </div>
                                    <div className="article-tile-content">
                                        <div className="article-tile-meta">
                                            <span className="article-tile-date">
                                                {new Date(article.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                            </span>
                                            {article.tags?.[0] && (
                                                <span className="article-tile-tag">{article.tags[0].toUpperCase()}</span>
                                            )}
                                        </div>
                                        <h3 className="article-tile-title">{article.title}</h3>
                                    </div>
                                    <div className="article-tile-arrow">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="stat-card clickable" onClick={() => navigate('/knowledge')}>
                            <div className="stat-icon">
                                <FolderOpen size={24} />
                            </div>
                            <div className="stat-content" style={{ flex: 1 }}>
                                <span className="stat-label">Knowledge Base</span>
                                <span className="value-placeholder">Insights, tutorials and handpicked resources that might interest you.</span>
                            </div>
                            <button className="btn-icon" title="Öffnen">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="dashboard-footer">
                <div className="footer-brand">
                    <img src="/logo.svg" alt="AA" className="footer-logo" />
                    <span>AUTOMATION AFFAIRS © 2026</span>
                </div>
                <div className="footer-links">
                    <a href="https://automationaffairs.com" target="_blank" rel="noopener noreferrer">HOME</a>
                    <a href="/privacy">PRIVACY</a>
                    <a href="/imprint">TERMS</a>
                </div>
            </footer>

            {/* Onboarding Modal */}
            <OnboardingModal
                isOpen={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                userName={profile?.full_name}
            />
        </div>
    )
}
