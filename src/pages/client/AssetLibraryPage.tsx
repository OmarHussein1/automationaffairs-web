import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import {
    ArrowLeft, FolderOpen, Download, Search,
    Loader2, FileText, Image, FileSpreadsheet, File, Eye, X
} from 'lucide-react'
import './AssetLibraryPage.css'

// Storage bucket name
const STORAGE_BUCKET = 'project-files'

interface Project {
    id: string
    title?: string
}

interface Asset {
    id: string
    project_id: string
    file_name: string
    file_type?: string
    file_size?: number
    storage_path?: string
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
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

export default function AssetLibraryPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [assets, setAssets] = useState<Asset[]>([])
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProject, setSelectedProject] = useState<string | null>(null)
    const [previewAsset, setPreviewAsset] = useState<(Asset & { url: string }) | null>(null)

    useEffect(() => {
        const fetchAssets = async () => {
            if (!user?.id) return

            try {
                setLoading(true)
                setError(null)

                // 1. Fetch projects for 'aa' brand (Automation Affairs)
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('id, title')
                    .eq('brand', 'aa')

                console.log('[AssetLibrary] Projects fetched:', projectsData, 'Error:', projectsError)

                if (projectsError) throw projectsError

                const projectIds = projectsData?.map(p => p.id) || []
                setProjects((projectsData as Project[]) || [])

                console.log('[AssetLibrary] Project IDs:', projectIds)

                if (projectIds.length === 0) {
                    console.log('[AssetLibrary] No projects found - setting empty assets')
                    setAssets([])
                    return
                }

                // 2. Fetch all assets for these projects
                const { data: assetsData, error: assetsError } = await supabase
                    .from('media_assets')
                    .select('*')
                    .in('project_id', projectIds)
                    .order('created_at', { ascending: false })

                console.log('[AssetLibrary] Assets fetched:', assetsData, 'Error:', assetsError)

                if (assetsError) throw assetsError

                setAssets((assetsData as Asset[]) || [])

            } catch (err) {
                console.error('[AssetLibrary] Error fetching assets:', err)
                setAssets([])
            } finally {
                setLoading(false)
            }
        }

        fetchAssets()
    }, [user?.id])

    // Filter assets
    const filteredAssets = assets.filter(asset => {
        const matchesSearch = !searchQuery ||
            asset.file_name?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesProject = !selectedProject ||
            asset.project_id === selectedProject

        return matchesSearch && matchesProject
    })

    // Get asset URL from Supabase Storage
    const getAssetUrl = async (asset: Asset) => {
        const storagePath = asset.storage_path || `${asset.project_id}/${asset.file_name}`

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

    // Get project name by id
    const getProjectName = (projectId: string) => {
        const project = projects.find(p => p.id === projectId)
        return project?.title || 'Unknown Project'
    }

    return (
        <div className="asset-library-page">
            {/* Header */}
            <header className="asset-library-header">
                <div
                    className="header-brand"
                    onClick={() => navigate('/dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    <img
                        src="/logo.svg"
                        alt="Automation Affairs"
                        className="header-logo"
                    />
                    <div className="header-brand-text">
                        <span className="header-brand-name">AUTOMATION<span className="brand-accent">AFFAIRS</span></span>
                        <span className="header-brand-tagline">ASSET LIBRARY</span>
                    </div>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={16} />
                    Dashboard
                </button>
            </header>

            {/* Main Content */}
            <main className="asset-library-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-header-content">
                        <h1>YOUR FILES</h1>
                        <p>Access and download all project files in one place</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="filter-bar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="project-filters">
                        <button
                            className={`project-filter ${!selectedProject ? 'active' : ''}`}
                            onClick={() => setSelectedProject(null)}
                        >
                            All Projects
                        </button>
                        {projects.map(project => (
                            <button
                                key={project.id}
                                className={`project-filter ${selectedProject === project.id ? 'active' : ''}`}
                                onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                            >
                                {project.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="asset-library-loading">
                        <Loader2 size={32} className="loading-spinner" />
                        <p>Dateien werden geladen...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="asset-library-error">
                        <p>Fehler beim Laden: {error}</p>
                        <button onClick={() => window.location.reload()} className="btn-secondary">
                            Erneut versuchen
                        </button>
                    </div>
                )}

                {/* Assets Grid */}
                {!loading && !error && (
                    <div className="assets-grid">
                        {filteredAssets.length > 0 ? (
                            filteredAssets.map((asset) => {
                                const FileIcon = getFileIcon(asset.file_name)
                                const canPreview = isPreviewable(asset.file_name)
                                return (
                                    <div key={asset.id} className="asset-card">
                                        <div className="asset-card-icon">
                                            <FileIcon size={28} />
                                        </div>
                                        <div className="asset-card-info">
                                            <span className="asset-card-name">{asset.file_name}</span>
                                            <div className="asset-card-meta">
                                                <span className="asset-card-type">
                                                    {asset.file_type?.toUpperCase() || 'FILE'}
                                                </span>
                                                <span className="asset-card-divider">•</span>
                                                <span className="asset-card-date">
                                                    {formatDate(asset.created_at)}
                                                </span>
                                            </div>
                                            <span className="asset-card-project">
                                                {getProjectName(asset.project_id)}
                                            </span>
                                        </div>
                                        <div className="asset-card-actions">
                                            {canPreview && (
                                                <button
                                                    className="asset-btn"
                                                    onClick={() => handlePreview(asset)}
                                                    title="Vorschau"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                            <button
                                                className="asset-btn"
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
                                <FolderOpen size={48} className="empty-icon" />
                                <h3>Keine Dateien gefunden</h3>
                                <p>
                                    {searchQuery || selectedProject
                                        ? 'Versuchen Sie andere Suchbegriffe oder Filter.'
                                        : 'Es sind noch keine Dateien für Sie verfügbar.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="asset-library-footer">
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
