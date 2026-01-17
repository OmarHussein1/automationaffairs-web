import { useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import {
    ArrowLeft, Calendar, Clock, SpinnerGap,
    CaretRight, CaretUp, FileText, Copy, Check, SignOut
} from '@phosphor-icons/react'
import GridBackground from '../../components/layout/GridBackground'
import './KnowledgeArticlePage.css'
import KnowledgeChat from '../../components/knowledge/KnowledgeChat'

interface Article {
    id: string
    title: string
    slug?: string
    content?: string
    excerpt?: string
    cover_image?: string
    tags?: string[]
    created_at: string
    author?: string
}

interface RelatedArticle {
    id: string
    title: string
    slug?: string
    cover_image?: string
    tags?: string[]
}

interface NavArticle {
    id: string
    title: string
    slug?: string
}

// Tag colors - updated for AA theme
const TAG_COLORS: Record<string, { bg: string; color: string }> = {
    'technical': { bg: 'rgba(59, 91, 219, 0.12)', color: '#3b5bdb' },
    'deep dive': { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    'insights': { bg: 'rgba(147, 51, 234, 0.12)', color: '#8b5cf6' },
    'case study': { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
    'tutorial': { bg: 'rgba(59, 91, 219, 0.12)', color: '#3b5bdb' },
    'default': { bg: 'rgba(107, 114, 128, 0.1)', color: '#6b7280' }
}

// Reading time estimate
const getReadingTime = (content?: string) => {
    if (!content) return '1 min'
    const words = content.split(/\s+/).length
    return `${Math.ceil(words / 200)} min`
}

// Get tag color
const getTagColor = (tag: string) => {
    const lowerTag = tag?.toLowerCase()
    return TAG_COLORS[lowerTag] || TAG_COLORS.default
}

export default function KnowledgeArticlePage() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { user, profile, signOut } = useAuth()

    const [article, setArticle] = useState<Article | null>(null)
    const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [nextArticle, setNextArticle] = useState<NavArticle | null>(null)
    const [prevArticle, setPrevArticle] = useState<NavArticle | null>(null)
    const [copied, setCopied] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false)
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false)
    const [activeHeadingIndex, setActiveHeadingIndex] = useState(0)

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return

            try {
                setLoading(true)
                setError(null)

                // Fetch main article - try by id first, then by slug
                let articleData: Article | null = null

                // Try to find by id
                const { data: byId, error: idError } = await supabase
                    .from('knowledge_entries')
                    .select('*')
                    .eq('id', slug)
                    .single()

                if (!idError && byId) {
                    articleData = byId as Article
                } else {
                    // Try to find by slug
                    const { data: bySlug, error: slugError } = await supabase
                        .from('knowledge_entries')
                        .select('*')
                        .eq('slug', slug)
                        .single()

                    if (!slugError && bySlug) {
                        articleData = bySlug as Article
                    }
                }

                if (!articleData) {
                    setError('Artikel nicht gefunden')
                    return
                }

                setArticle(articleData)

                // Try to fetch related articles
                try {
                    const { data: related } = await supabase
                        .from('knowledge_entries')
                        .select('id, title, slug, cover_image, tags')
                        .neq('id', articleData.id)
                        .eq('is_public_to_client', true)
                        .limit(3)

                    setRelatedArticles((related as RelatedArticle[]) || [])
                } catch {
                    setRelatedArticles([])
                }

                // Fetch Next (Newer) Article
                const { data: next } = await supabase
                    .from('knowledge_entries')
                    .select('id, title, slug')
                    .gt('created_at', articleData.created_at)
                    .eq('is_public_to_client', true)
                    .order('created_at', { ascending: true })
                    .limit(1)
                    .maybeSingle()
                setNextArticle(next as NavArticle | null)

                // Fetch Previous (Older) Article
                const { data: prev } = await supabase
                    .from('knowledge_entries')
                    .select('id, title, slug')
                    .lt('created_at', articleData.created_at)
                    .eq('is_public_to_client', true)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()
                setPrevArticle(prev as NavArticle | null)

            } catch (err) {
                console.error('Error fetching article:', err)
                setError((err as Error).message || 'Artikel konnte nicht geladen werden')
            } finally {
                setLoading(false)
            }
        }

        fetchArticle()
    }, [slug])

    // Extract headings for TOC
    const extractHeadings = (content?: string) => {
        if (!content) return []
        const headingRegex = /^#{1,3}\s+(.+)$/gm
        const headings: { text: string; level: number; id: string }[] = []
        let match
        while ((match = headingRegex.exec(content)) !== null) {
            const level = (match[0].match(/^#+/) || [''])[0].length
            headings.push({
                text: match[1],
                level,
                id: match[1].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
            })
        }
        return headings
    }

    // Scroll tracking for active heading (mobile)
    useEffect(() => {
        if (!article?.content) return

        const headingElements = document.querySelectorAll('.article-content h2, .article-content h3')
        if (headingElements.length === 0) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Array.from(headingElements).indexOf(entry.target as Element)
                        if (index !== -1) setActiveHeadingIndex(index)
                    }
                })
            },
            { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
        )

        headingElements.forEach((el) => observer.observe(el))
        return () => observer.disconnect()
    }, [article?.content])

    const handleCopy = async () => {
        if (!article?.content) return
        try {
            await navigator.clipboard.writeText(article.content)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Copy failed:', err)
        }
    }

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
            <div className="article-page">
                <div className="article-loading">
                    <SpinnerGap size={32} className="loading-spinner" />
                    <p>Artikel wird geladen...</p>
                </div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="article-page">
                <div className="article-error">
                    <p>{error || 'Artikel nicht gefunden'}</p>
                    <button onClick={() => navigate('/knowledge')} className="btn-secondary">
                        <ArrowLeft size={16} />
                        Zurück zur Übersicht
                    </button>
                </div>
            </div>
        )
    }

    const headings = extractHeadings(article.content)

    return (
        <div className="article-page">
            <GridBackground />
            {/* Header */}
            <header className="article-header">
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
                        <SignOut size={20} />
                    </button>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="breadcrumb-bar">
                <Link to="/dashboard">HOME</Link>
                <CaretRight size={14} />
                <Link to="/knowledge">KNOWLEDGE BASE</Link>
                <CaretRight size={14} />
                <span className="breadcrumb-current">ARTICLE</span>
                <button className="back-link" onClick={() => navigate('/knowledge')}>
                    ← Back to Articles
                </button>
            </div>

            {/* Main Layout */}
            <div className="article-layout">
                {/* Article Content */}
                <main className="article-main">
                    {/* Cover Image */}
                    {article.cover_image && (
                        <div className="article-cover">
                            <img src={article.cover_image} alt={article.title} />
                        </div>
                    )}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="article-tags">
                            {article.tags.map(tag => (
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
                    )}

                    {/* Meta */}
                    <div className="article-meta">
                        <span className="meta-item">
                            <Calendar size={14} />
                            {new Date(article.created_at).toLocaleDateString('de-DE', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="meta-divider">•</span>
                        <span className="meta-item">
                            <Clock size={14} />
                            {getReadingTime(article.content)} read
                        </span>
                        <span className="meta-divider">•</span>
                        <button
                            className="meta-item meta-button"
                            onClick={handleCopy}
                            title="Copy Markdown"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>

                    {/* Title */}
                    <h1 className="article-title">{article.title}</h1>

                    {/* Content */}
                    <div className="article-content prose">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                                // Custom code block styling
                                code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    const language = match ? match[1] : ''

                                    if (!inline) {
                                        return (
                                            <div className="code-block">
                                                {language && (
                                                    <div className="code-header">
                                                        <span className="code-dots">
                                                            <span className="dot red"></span>
                                                            <span className="dot yellow"></span>
                                                            <span className="dot green"></span>
                                                        </span>
                                                        <span className="code-language">{language}</span>
                                                    </div>
                                                )}
                                                <pre className={className}>
                                                    <code {...props}>{children}</code>
                                                </pre>
                                            </div>
                                        )
                                    }
                                    return <code className="inline-code" {...props}>{children}</code>
                                },
                                // Custom blockquote
                                blockquote({ children }) {
                                    return <blockquote className="article-quote">{children}</blockquote>
                                },
                                // Custom headings with IDs for TOC
                                h2({ children }) {
                                    const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                                    return <h2 id={id}>{children}</h2>
                                },
                                h3({ children }) {
                                    const id = children?.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                                    return <h3 id={id}>{children}</h3>
                                },
                            }}
                        >
                            {article.content || ''}
                        </ReactMarkdown>
                    </div>

                    {/* Navigation */}
                    {(nextArticle || prevArticle) && (
                        <div className="article-navigation">
                            {prevArticle ? (
                                <div className="nav-prev" onClick={() => navigate(`/knowledge/${prevArticle.slug || prevArticle.id}`)} style={{ cursor: 'pointer' }}>
                                    <span className="nav-label">PREVIOUS ARTICLE</span>
                                    <span className="nav-title">{prevArticle.title}</span>
                                </div>
                            ) : <div></div>}

                            {nextArticle ? (
                                <div className="nav-next" onClick={() => navigate(`/knowledge/${nextArticle.slug || nextArticle.id}`)} style={{ cursor: 'pointer' }}>
                                    <span className="nav-label">NEXT ARTICLE</span>
                                    <span className="nav-title">{nextArticle.title}</span>
                                </div>
                            ) : <div></div>}
                        </div>
                    )}
                </main>

                {/* Sidebar */}
                <aside className={`article-sidebar ${isChatOpen ? 'chat-open' : ''}`}>
                    <div className="sidebar-scroll-area">
                        {/* TOC */}
                        {headings.length > 0 && (
                            <div className="sidebar-section">
                                <h3>ON THIS PAGE</h3>
                                <nav className="toc">
                                    {headings.map((heading, index) => (
                                        <a
                                            key={index}
                                            href={`#${heading.id}`}
                                            className={`toc-item level-${heading.level}`}
                                        >
                                            {heading.text}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}

                        {/* Related Articles */}
                        {relatedArticles.length > 0 && (
                            <div className="sidebar-section">
                                <h3>RELATED RESOURCES</h3>
                                <div className="related-list">
                                    {relatedArticles.map(related => (
                                        <Link
                                            key={related.id}
                                            to={`/knowledge/${related.slug || related.id}`}
                                            className="related-item"
                                        >
                                            {related.cover_image ? (
                                                <img src={related.cover_image} alt="" className="related-image" />
                                            ) : (
                                                <div className="related-placeholder">
                                                    <FileText size={20} />
                                                </div>
                                            )}
                                            <span className="related-title">{related.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Chat Integration */}
                    <div className="sidebar-chat-wrapper">
                        <KnowledgeChat
                            isOpen={isChatOpen}
                            onToggle={() => setIsChatOpen(!isChatOpen)}
                            articleContent={article.content}
                            articleId={article.id}
                        />
                    </div>
                </aside>
            </div>

            {/* Footer */}
            <footer className="article-footer">
                <div className="footer-brand">
                    <img src="/logo.svg" alt="AA" className="footer-logo" />
                    <span>© 2026 AUTOMATION AFFAIRS</span>
                </div>
                <div className="footer-links">
                    <a href="https://automationaffairs.com" target="_blank" rel="noopener noreferrer">HOME</a>
                    <a href="/privacy">PRIVACY</a>
                    <a href="/impressum">TERMS</a>
                </div>
            </footer>

            {/* Mobile Navigation - Bottom Bar */}
            {headings.length > 0 && (
                <div className="mobile-nav-bar">
                    <button
                        className="mobile-toc-trigger"
                        onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                    >
                        <span className="mobile-current-chapter">
                            {headings[activeHeadingIndex]?.text || 'Navigation'}
                        </span>
                        <CaretUp
                            size={18}
                            className={`mobile-toc-arrow ${isMobileTocOpen ? 'open' : ''}`}
                        />
                    </button>
                    <button
                        className={`mobile-ai-btn ${isMobileChatOpen ? 'active' : ''}`}
                        onClick={() => {
                            setIsMobileChatOpen(!isMobileChatOpen)
                            setIsMobileTocOpen(false)
                        }}
                    >
                        AI
                    </button>
                </div>
            )}

            {/* Mobile TOC Drawer */}
            {isMobileTocOpen && (
                <>
                    <div
                        className="mobile-overlay"
                        onClick={() => setIsMobileTocOpen(false)}
                    />
                    <div className="mobile-toc-drawer">
                        <div className="mobile-toc-header">
                            <span>INHALTSVERZEICHNIS</span>
                            <button onClick={() => setIsMobileTocOpen(false)}>×</button>
                        </div>
                        <nav className="mobile-toc-list">
                            {headings.map((heading, index) => (
                                <a
                                    key={index}
                                    href={`#${heading.id}`}
                                    className={`mobile-toc-item level-${heading.level} ${index === activeHeadingIndex ? 'active' : ''}`}
                                    onClick={() => setIsMobileTocOpen(false)}
                                >
                                    {heading.text}
                                </a>
                            ))}
                        </nav>
                    </div>
                </>
            )}

            {/* Mobile Chat Overlay */}
            {isMobileChatOpen && (
                <>
                    <div
                        className="mobile-overlay"
                        onClick={() => setIsMobileChatOpen(false)}
                    />
                    <div className="mobile-chat-drawer">
                        <KnowledgeChat
                            isOpen={true}
                            onToggle={() => setIsMobileChatOpen(false)}
                            articleContent={article.content}
                            articleId={article.id}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
