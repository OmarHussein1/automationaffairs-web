import { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
    ArrowLeft, Calendar, Download, FileText,
    Image, FileSpreadsheet, File, BookOpen,
    CheckCircle2, Circle, Loader2,
    MessageCircle, Mail, Eye, X, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react'
import './ProjectDetailPage.css'

// Storage bucket name
const STORAGE_BUCKET = 'project-files'

// Status configuration
const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
    'planning': { label: 'PLANNING', class: 'planning' },
    'active': { label: 'ACTIVE', class: 'active' },
    'done': { label: 'DONE', class: 'done' },
    'archived': { label: 'ARCHIVED', class: 'archived' },
}

// Team members for contact carousel
const TEAM_MEMBERS = [
    {
        name: 'Maximilian Kern',
        title: 'CLIENT STRATEGY LEAD',
        email: 'max@automationaffairs.com',
        avatar: '/team/max.jpg',
        whatsapp: '+436605358688'
    },
    {
        name: 'Dario Suckfüll',
        title: 'AUTOMATION ENGINEERING LEAD',
        email: 'dario@automationaffairs.com',
        avatar: '/team/dario.jpg',
        whatsapp: '+491627673865'
    },
    {
        name: 'Omar Hussein',
        title: 'PRINCIPAL FULL-STACK ENGINEER',
        email: 'omar@automationaffairs.com',
        avatar: '/team/omar.jpg',
        whatsapp: '+31626775305'
    }
]

interface Project {
    id: string
    title?: string
    name?: string
    description?: string
    status: string
    progress?: number
    current_phase?: string
    deadline?: string
    end_date?: string
    cover_image?: string
    hours_logged?: number
}

interface Asset {
    id: string
    file_name: string
    file_type?: string
    storage_path?: string
    created_at: string
}

interface Task {
    id: string
    title: string
    description?: string
    status: string
    priority?: string
    due_date?: string
    project_id: string
}

interface LinkedArticle {
    id: string
    title: string
    slug?: string
    tags?: string[]
    created_at: string
}

// File icon based on type
const getFileIcon = (filename?: string) => {
    const ext = filename?.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return Image
    if (['pdf'].includes(ext || '')) return FileText
    if (['csv', 'xlsx', 'xls'].includes(ext || '')) return FileSpreadsheet
    return File
}

// Format date
const formatDate = (dateString?: string) => {
    if (!dateString) return 'TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export default function ProjectDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, profile, signOut } = useAuth()

    const [project, setProject] = useState<Project | null>(null)
    const [assets, setAssets] = useState<Asset[]>([])
    const [tasks, setTasks] = useState<Task[]>([])
    const [linkedArticles, setLinkedArticles] = useState<LinkedArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [previewAsset, setPreviewAsset] = useState<(Asset & { url: string }) | null>(null)
    const [activeTeamMember, setActiveTeamMember] = useState(0)
    const [isFading, setIsFading] = useState(false)

    // Helper function to change team member with fade
    const changeTeamMember = (newIndex: number) => {
        setIsFading(true)
        setTimeout(() => {
            setActiveTeamMember(newIndex)
            setIsFading(false)
        }, 300) // Match CSS transition duration
    }

    // Auto-swipe team carousel every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            changeTeamMember((activeTeamMember + 1) % TEAM_MEMBERS.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [activeTeamMember])

    useEffect(() => {
        const fetchProjectData = async () => {
            if (!id) return

            try {
                setLoading(true)
                setError(null)

                // Fetch project details - filter by 'aa' brand
                const { data: projectData, error: projectError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .eq('brand', 'aa')
                    .single()

                if (projectError) throw projectError
                if (!projectData) throw new Error('Projekt nicht gefunden')

                setProject(projectData as Project)

                // Fetch project assets
                try {
                    const { data: assetsData } = await supabase
                        .from('media_assets')
                        .select('*')
                        .eq('project_id', id)
                        .order('created_at', { ascending: false })

                    setAssets((assetsData as Asset[]) || [])
                } catch (assetErr) {
                    console.warn('Assets fetch skipped:', assetErr)
                    setAssets([])
                }

                // Fetch tasks
                try {
                    const { data: tasksData } = await supabase
                        .from('tasks')
                        .select('id, title, description, status, priority, due_date, project_id')
                        .eq('project_id', id)
                        .order('status', { ascending: true })
                        .order('due_date', { ascending: true })

                    setTasks((tasksData as Task[]) || [])
                } catch (taskErr) {
                    console.warn('Tasks fetch skipped:', taskErr)
                    setTasks([])
                }

                // Fetch linked knowledge articles
                try {
                    const { data: articlesData } = await supabase
                        .from('knowledge_entries')
                        .select('id, title, slug, tags, created_at')
                        .eq('project_id', id)
                        .eq('is_public_to_client', true)
                        .order('created_at', { ascending: false })

                    setLinkedArticles((articlesData as LinkedArticle[]) || [])
                } catch (articleErr) {
                    console.warn('Linked articles fetch skipped:', articleErr)
                    setLinkedArticles([])
                }

            } catch (err) {
                console.error('Error fetching project:', err)
                setError((err as Error).message || 'Projekt konnte nicht geladen werden')
            } finally {
                setLoading(false)
            }
        }

        fetchProjectData()
    }, [id])

    // Realtime subscription for tasks
    useEffect(() => {
        if (!id) return

        const subscription = supabase
            .channel(`project-tasks-rt-${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks'
                },
                async (payload) => {
                    const taskProjectId = (payload.new as Task)?.project_id || (payload.old as Task)?.project_id
                    if (taskProjectId !== id) return

                    try {
                        const { data: tasksData } = await supabase
                            .from('tasks')
                            .select('id, title, description, status, priority, due_date, project_id')
                            .eq('project_id', id)
                            .order('status', { ascending: true })
                            .order('due_date', { ascending: true })

                        setTasks((tasksData as Task[]) || [])
                    } catch (err) {
                        console.warn('[Realtime] Task update failed:', err)
                    }
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [id])

    // Realtime subscription for project
    useEffect(() => {
        if (!id) return

        const subscription = supabase
            .channel(`project-details-rt-${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'projects'
                },
                async (payload) => {
                    const projectId = (payload.new as Project)?.id || (payload.old as Project)?.id
                    if (projectId !== id) return

                    try {
                        const { data: projectData } = await supabase
                            .from('projects')
                            .select('*')
                            .eq('id', id)
                            .single()

                        if (projectData) {
                            setProject(projectData as Project)
                        }
                    } catch (err) {
                        console.warn('[Realtime] Project update failed:', err)
                    }
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [id])

    // Realtime subscription for assets
    useEffect(() => {
        if (!id) return

        const subscription = supabase
            .channel(`project-assets-rt-${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'media_assets'
                },
                async (payload) => {
                    const assetProjectId = (payload.new as Asset & { project_id: string })?.project_id ||
                        (payload.old as Asset & { project_id: string })?.project_id
                    if (assetProjectId !== id) return

                    try {
                        const { data: assetsData } = await supabase
                            .from('media_assets')
                            .select('*')
                            .eq('project_id', id)
                            .order('created_at', { ascending: false })

                        setAssets((assetsData as Asset[]) || [])
                    } catch (err) {
                        console.warn('[Realtime] Assets update failed:', err)
                    }
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [id])

    // Get asset URL from Supabase Storage
    const getAssetUrl = async (asset: Asset) => {
        const storagePath = asset.storage_path || `${id}/${asset.file_name}`

        const { data, error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(storagePath, 3600)

        if (error) {
            console.error('[Storage] Error creating signed URL:', error)
            return null
        }

        return data?.signedUrl || null
    }

    // Check if file is previewable
    const isPreviewable = (fileName?: string) => {
        const ext = fileName?.split('.').pop()?.toLowerCase()
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf'].includes(ext || '')
    }

    // Handle file preview
    const handlePreview = async (asset: Asset) => {
        const url = await getAssetUrl(asset)
        if (url) {
            setPreviewAsset({ ...asset, url })
        }
    }

    // Handle file download
    const handleDownload = async (asset: Asset) => {
        const url = await getAssetUrl(asset)
        if (url) {
            window.open(url, '_blank')
        }
    }

    // Handle logout
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

    // Get display name for header
    const getDisplayName = () => {
        if (profile?.full_name) return profile.full_name
        if (user?.email) return user.email.split('@')[0]
        return 'Client'
    }

    if (loading) {
        return (
            <div className="project-detail-page">
                <div className="project-loading">
                    <Loader2 size={32} className="loading-spinner" />
                    <p>Projekt wird geladen...</p>
                </div>
            </div>
        )
    }

    if (error || !project) {
        return (
            <div className="project-detail-page">
                <div className="project-error">
                    <p>{error || 'Projekt nicht gefunden'}</p>
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary">
                        <ArrowLeft size={16} />
                        Zurück zum Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const statusConfig = STATUS_CONFIG[project.status] || STATUS_CONFIG.planning

    // Calculate progress from tasks
    const calculatedProgress = tasks.length > 0
        ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100)
        : 0
    const displayProgress = project.progress === 100 ? 100 : calculatedProgress

    return (
        <div className="project-detail-page">
            {/* Header */}
            <header className="project-header">
                <div className="header-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
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
                        <span className="user-name">{getDisplayName()}</span>
                        <span className="user-role">CLIENT ACCESS</span>
                    </div>

                    <div className="user-avatar">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" />
                        ) : (
                            <span>{getDisplayName()[0].toUpperCase()}</span>
                        )}
                    </div>

                    <button className="header-logout" onClick={handleLogout} title="Abmelden">
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="project-main">
                {/* Back Navigation */}
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={18} />
                    Back to Projects
                </button>

                {/* Project Header Row: Info + Contact */}
                <div className="project-header-row">
                    {/* Project Title Section */}
                    <div className="project-title-section">
                        <div className="project-title-row">
                            <span className={`status-badge ${statusConfig.class}`}>● {statusConfig.label}</span>
                        </div>
                        <h1 className="project-title">
                            {project.title || project.name || 'Project Details'}
                        </h1>
                        <p className="project-description">
                            {project.description || 'System Integration & Workflow Logic'}
                        </p>

                        {/* Timeline Progress */}
                        <div className="timeline-section">
                            <div className="timeline-bar">
                                <div
                                    className="timeline-fill"
                                    style={{ width: `${displayProgress}%` }}
                                />
                            </div>
                        </div>

                        {/* Completion Info */}
                        <div className="completion-info">
                            <span className="completion-label">ESTIMATED COMPLETION</span>
                            <div className="completion-date">
                                <Calendar size={18} />
                                <span>{formatDate(project.deadline || project.end_date)}</span>
                            </div>
                            <div className="completion-progress">
                                <span className="progress-percent">{displayProgress}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Card - Team Carousel (moved here) */}
                    <div className="grid-card contact-card">
                        <button
                            className="carousel-nav carousel-prev"
                            onClick={() => changeTeamMember(activeTeamMember === 0 ? TEAM_MEMBERS.length - 1 : activeTeamMember - 1)}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className={`contact-content ${isFading ? 'fading' : ''}`}>
                            <div className="contact-avatar">
                                <img
                                    src={TEAM_MEMBERS[activeTeamMember].avatar}
                                    alt={TEAM_MEMBERS[activeTeamMember].name}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                                <span className="avatar-fallback">
                                    {TEAM_MEMBERS[activeTeamMember].name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <div className="contact-info">
                                <h3>{TEAM_MEMBERS[activeTeamMember].name}</h3>
                                <span className="contact-role">{TEAM_MEMBERS[activeTeamMember].title}</span>
                            </div>
                            <div className="carousel-dots">
                                {TEAM_MEMBERS.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`carousel-dot ${index === activeTeamMember ? 'active' : ''}`}
                                        onClick={() => changeTeamMember(index)}
                                    />
                                ))}
                            </div>
                            <div className="contact-actions">
                                <a
                                    href={`https://wa.me/${TEAM_MEMBERS[activeTeamMember].whatsapp.replace(/\s/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary contact-btn"
                                >
                                    <MessageCircle size={16} />
                                    WHATSAPP
                                </a>
                                <a
                                    href={`mailto:${TEAM_MEMBERS[activeTeamMember].email}`}
                                    className="btn-secondary contact-btn"
                                >
                                    <Mail size={16} />
                                    EMAIL
                                </a>
                            </div>
                        </div>

                        <button
                            className="carousel-nav carousel-next"
                            onClick={() => changeTeamMember((activeTeamMember + 1) % TEAM_MEMBERS.length)}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="project-grid">
                    {/* Project Assets */}
                    <div className="grid-card assets-card">
                        <div className="card-header">
                            <h2>
                                <File size={20} />
                                Project Assets
                            </h2>
                            <button className="btn-link" onClick={() => navigate('/assets')}>VIEW ALL</button>
                        </div>
                        <div className="assets-list">
                            {assets.length > 0 ? (
                                assets.slice(0, 4).map((asset) => {
                                    const FileIcon = getFileIcon(asset.file_name)
                                    const canPreview = isPreviewable(asset.file_name)
                                    return (
                                        <div key={asset.id} className="asset-item">
                                            <div className="asset-icon">
                                                <FileIcon size={20} />
                                            </div>
                                            <div className="asset-info">
                                                <span className="asset-name">{asset.file_name}</span>
                                                <span className="asset-meta">
                                                    {asset.file_type?.toUpperCase() || 'FILE'} • {formatDate(asset.created_at)}
                                                </span>
                                            </div>
                                            <div className="asset-actions">
                                                {canPreview && (
                                                    <button
                                                        className="asset-btn asset-preview"
                                                        onClick={() => handlePreview(asset)}
                                                        title="Vorschau"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    className="asset-btn asset-download"
                                                    onClick={() => handleDownload(asset)}
                                                    title="Download"
                                                >
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="assets-empty">
                                    <p>Noch keine Dateien vorhanden</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Linked Knowledge Articles */}
                    <div className="grid-card articles-card">
                        <div className="card-header">
                            <h2>
                                <BookOpen size={20} />
                                Linked Articles
                            </h2>
                            {linkedArticles.length > 0 && (
                                <span className="articles-counter">
                                    {linkedArticles.length} {linkedArticles.length === 1 ? 'ARTICLE' : 'ARTICLES'}
                                </span>
                            )}
                        </div>
                        <div className="articles-list">
                            {linkedArticles.length > 0 ? (
                                linkedArticles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="article-item"
                                        onClick={() => navigate(`/knowledge/${article.slug || article.id}`)}
                                    >
                                        <div className="article-icon">
                                            <BookOpen size={18} />
                                        </div>
                                        <div className="article-info">
                                            <span className="article-title">{article.title}</span>
                                            <span className="article-meta">
                                                {formatDate(article.created_at)}
                                                {article.tags && article.tags.length > 0 && (
                                                    <span className="article-tags">
                                                        {article.tags.slice(0, 2).map(tag => (
                                                            <span key={tag} className="article-tag">{tag}</span>
                                                        ))}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <ChevronRight size={16} className="article-arrow" />
                                    </div>
                                ))
                            ) : (
                                <div className="articles-empty">
                                    <p>Keine verknüpften Artikel</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Project Tasks */}
                    <div className="grid-card tasks-card">
                        <div className="card-header">
                            <h2>
                                <CheckCircle2 size={20} />
                                Project Tasks
                            </h2>
                            {tasks.length > 0 && (
                                <span className="tasks-counter">
                                    {tasks.filter(t => t.status === 'done').length}/{tasks.length} DONE
                                </span>
                            )}
                        </div>
                        <div className="tasks-list">
                            {tasks.length > 0 ? (
                                tasks.map((task) => {
                                    const statusLabels: Record<string, string> = {
                                        'todo': 'TODO',
                                        'in_progress': 'IN PROGRESS',
                                        'review': 'REVIEW',
                                        'done': 'DONE'
                                    }
                                    return (
                                        <div
                                            key={task.id}
                                            className={`task-item ${task.status}`}
                                        >
                                            <div className="task-main-row">
                                                <div className="task-status-icon">
                                                    {task.status === 'done' ? (
                                                        <CheckCircle2 size={18} className="status-done" />
                                                    ) : task.status === 'review' ? (
                                                        <CheckCircle2 size={18} className="status-review" />
                                                    ) : task.status === 'in_progress' ? (
                                                        <Circle size={18} className="status-in-progress" />
                                                    ) : (
                                                        <Circle size={18} className="status-todo" />
                                                    )}
                                                </div>
                                                <div className="task-info">
                                                    <span className={`task-title ${task.status === 'done' ? 'done' : ''}`}>
                                                        {task.title}
                                                    </span>
                                                    <span className={`task-priority priority-${task.priority}`}>
                                                        {task.priority?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className={`task-status-label status-${task.status}`}>
                                                    {statusLabels[task.status] || task.status?.toUpperCase()}
                                                </span>
                                            </div>
                                            {task.description && (
                                                <div className="task-description">
                                                    <p>{task.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="tasks-empty">
                                    <p>Noch keine Tasks vorhanden</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="project-footer">
                <div className="footer-brand">
                    <img src="/logo.svg" alt="AA" className="footer-logo" />
                    <span>AUTOMATION AFFAIRS © 2026</span>
                </div>
                <div className="footer-links">
                    <a href="https://automationaffairs.com" target="_blank" rel="noopener noreferrer">HOME</a>
                    <a href="/privacy">PRIVACY</a>
                    <a href="/impressum">TERMS</a>
                </div>
            </footer>

            {/* Preview Modal */}
            {previewAsset && (
                <div className="preview-modal" onClick={() => setPreviewAsset(null)}>
                    <div className="preview-content" onClick={(e) => e.stopPropagation()}>
                        <div className="preview-header">
                            <span className="preview-title">{previewAsset.file_name}</span>
                            <div className="preview-actions">
                                <button
                                    className="preview-btn"
                                    onClick={() => handleDownload(previewAsset)}
                                    title="Download"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    className="preview-btn preview-close"
                                    onClick={() => setPreviewAsset(null)}
                                    title="Schließen"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="preview-body">
                            {previewAsset.file_name?.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={previewAsset.url}
                                    title={previewAsset.file_name}
                                    className="preview-pdf"
                                />
                            ) : (
                                <img
                                    src={previewAsset.url}
                                    alt={previewAsset.file_name}
                                    className="preview-image"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
