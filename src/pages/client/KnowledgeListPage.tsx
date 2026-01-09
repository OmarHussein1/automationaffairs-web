import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
    ArrowLeft, Book, Search,
    Loader2, ChevronRight
} from 'lucide-react'
import './KnowledgePage.css'

interface Article {
    id: string
    slug?: string
    title: string
    excerpt?: string
    content?: string
    cover_image?: string
    tags?: string[]
    created_at: string
}

// Tag colors mapping - updated for AA theme
const TAG_COLORS: Record<string, { bg: string; color: string }> = {
    'technical': { bg: 'rgba(59, 91, 219, 0.12)', color: '#3b5bdb' },
    'insights': { bg: 'rgba(147, 51, 234, 0.12)', color: '#8b5cf6' },
    'case study': { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
    'tutorial': { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    'news': { bg: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' },
    'default': { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }
}

// Estimate reading time
const getReadingTime = (content?: string) => {
    if (!content) return '1 min read'
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
}

export default function KnowledgeListPage() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [articles, setArticles] = useState<Article[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTag, setSelectedTag] = useState<string | null>(null)

    useEffect(() => {
        const fetchArticles = async () => {
            if (!user?.id) return

            try {
                setLoading(true)
                setError(null)

                // 1. Fetch public articles for clients
                const { data: publicArticles, error: publicError } = await supabase
                    .from('knowledge_entries')
                    .select('*')
                    .eq('is_public_to_client', true)

                if (publicError) throw publicError

                // 2. Fetch directly assigned articles
                const { data: accessEntries, error: accessError } = await supabase
                    .from('knowledge_access')
                    .select('entry_id')
                    .eq('user_id', user.id)

                let assignedArticles: Article[] = []
                if (!accessError && accessEntries && accessEntries.length > 0) {
                    const entryIds = accessEntries.map(a => a.entry_id)
                    const { data: assignedData, error: assignedError } = await supabase
                        .from('knowledge_entries')
                        .select('*')
                        .in('id', entryIds)

                    if (!assignedError && assignedData) {
                        assignedArticles = assignedData as Article[]
                    }
                }

                // 3. Merge and deduplicate
                const allArticles = [...((publicArticles as Article[]) || []), ...assignedArticles]
                const uniqueArticles = Array.from(new Map(allArticles.map(item => [item.id, item])).values())

                // Sort by date desc
                uniqueArticles.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

                setArticles(uniqueArticles)

            } catch (err) {
                console.error('Error fetching articles:', err)
                // Don't show error - just empty state
                setArticles([])
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [user?.id])

    // Get all unique tags
    const allTags = [...new Set(articles.flatMap(a => a.tags || []))]

    // Filter articles
    const filteredArticles = articles.filter(article => {
        const matchesSearch = !searchQuery ||
            article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesTag = !selectedTag ||
            article.tags?.includes(selectedTag)

        return matchesSearch && matchesTag
    })

    // Get tag color
    const getTagColor = (tag: string) => {
        const lowerTag = tag?.toLowerCase()
        return TAG_COLORS[lowerTag] || TAG_COLORS.default
    }

    return (
        <div className="knowledge-page">
            {/* Header */}
            <header className="knowledge-header">
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
                        <span className="header-brand-tagline">KNOWLEDGE BASE</span>
                    </div>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft size={16} />
                    Dashboard
                </button>
            </header>

            {/* Main Content */}
            <main className="knowledge-main">
                {/* Page Header */}
                <div className="page-header">
                    <div className="page-header-content">
                        <h1>ALL ARTICLES</h1>
                        <p>Insights, tutorials, and resources for your projects</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="filter-bar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="tag-filters">
                        <button
                            className={`tag-filter ${!selectedTag ? 'active' : ''}`}
                            onClick={() => setSelectedTag(null)}
                        >
                            All
                        </button>
                        {allTags.slice(0, 5).map(tag => (
                            <button
                                key={tag}
                                className={`tag-filter ${selectedTag === tag ? 'active' : ''}`}
                                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                style={selectedTag === tag ? {
                                    background: getTagColor(tag).bg,
                                    color: getTagColor(tag).color,
                                    borderColor: getTagColor(tag).color
                                } : {}}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="knowledge-loading">
                        <Loader2 size={32} className="loading-spinner" />
                        <p>Artikel werden geladen...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="knowledge-error">
                        <p>Fehler beim Laden: {error}</p>
                        <button onClick={() => window.location.reload()} className="btn-secondary">
                            Erneut versuchen
                        </button>
                    </div>
                )}

                {/* Articles Grid */}
                {!loading && !error && (
                    <div className="articles-grid">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((article) => (
                                <article
                                    key={article.id}
                                    className="article-card"
                                    onClick={() => navigate(`/knowledge/${article.slug || article.id}`)}
                                >
                                    {/* Cover Image */}
                                    {article.cover_image && (
                                        <div className="article-cover">
                                            <img src={article.cover_image} alt="" />
                                        </div>
                                    )}

                                    {/* Article Info */}
                                    <div className="article-content">
                                        <div className="article-meta">
                                            {/* Tags */}
                                            {article.tags && article.tags.length > 0 && (
                                                <>
                                                    <div className="article-tags-inline" style={{ display: 'flex', gap: '0.5rem' }}>
                                                        {article.tags.slice(0, 2).map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="article-tag"
                                                                style={{
                                                                    background: getTagColor(tag).bg,
                                                                    color: getTagColor(tag).color
                                                                }}
                                                            >
                                                                {tag.toUpperCase()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <span className="article-divider">•</span>
                                                </>
                                            )}
                                            <span className="article-date">
                                                {new Date(article.created_at).toLocaleDateString('de-DE', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="article-divider">•</span>
                                            <span className="article-reading-time">
                                                {getReadingTime(article.content)}
                                            </span>
                                        </div>
                                        <h2 className="article-title">{article.title}</h2>
                                        <div className="article-excerpt">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                allowedElements={['p', 'strong', 'em', 'code', 'span']}
                                                unwrapDisallowed={true}
                                                components={{
                                                    p: ({ ...props }) => <p {...props} style={{ margin: 0, display: 'inline' }} />
                                                }}
                                            >
                                                {article.excerpt || (article.content?.slice(0, 150) + '...')}
                                            </ReactMarkdown>
                                        </div>
                                        <div className="article-card-footer">
                                            <span className="read-more">
                                                READ ARTICLE <ChevronRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="articles-empty">
                                <Book size={48} className="empty-icon" />
                                <h3>Keine Artikel gefunden</h3>
                                <p>
                                    {searchQuery || selectedTag
                                        ? 'Versuchen Sie andere Suchbegriffe oder Filter.'
                                        : 'Es sind noch keine Artikel für Sie verfügbar.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="knowledge-footer">
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
        </div>
    )
}
