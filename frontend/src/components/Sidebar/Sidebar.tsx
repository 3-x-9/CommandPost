import { EndpointDef, Collection } from "../../types";
import { Folder, FileText, ChevronRight, ChevronDown, History, Clock, Trash2, Database, Globe } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    endpoints: EndpointDef[];
    collections?: Collection[];
    historyItems?: any[];
    onSelect: (endpoint: EndpointDef) => void;
    activeEndpoint: EndpointDef | null;
    onLoadSpec: (path: string) => void;
    onDeleteCollection?: (name: string) => void;
    width?: number;
}

export function Sidebar({
    endpoints,
    onSelect,
    activeEndpoint,
    onLoadSpec,
    onDeleteCollection,
    width,
    collections = [],
    historyItems = []
}: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'collections' | 'history'>('collections');
    const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onLoadSpec((e.target as HTMLInputElement).value);
        }
    };

    const toggleTag = (tag: string) => {
        setExpandedTags(prev => ({ ...prev, [tag]: !prev[tag] }));
    };

    // Group endpoints by their first tag
    const grouped = endpoints.reduce((acc, ep) => {
        const tag = ep.tags[0] || "Default";
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(ep);
        return acc;
    }, {} as Record<string, EndpointDef[]>);

    return (
        <div className="sidebar" style={{ width: width ? `${width}px` : undefined }}>
            <div className="sidebar-input-area" style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                <input
                    type="text"
                    placeholder="Path to OpenAPI Spec (Enter)"
                    onKeyDown={handleKeyDown}
                    style={{ width: '100%' }}
                />
            </div>
            <div className="sidebar-tabs">
                <div
                    className={`sidebar-tab ${activeTab === 'collections' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collections')}
                >
                    <Folder size={16} /> Collections
                </div>
                <div
                    className={`sidebar-tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    <History size={16} /> History
                </div>
            </div>

            <div className="sidebar-content">
                {activeTab === 'collections' ? (
                    <>
                        {Object.keys(grouped).length === 0 && collections.length === 0 && (
                            <div className="empty-sidebar">
                                <span>No entries found</span>
                            </div>
                        )}

                        {/* Render Saved Collections Section */}
                        {collections.length > 0 && (
                            <div className="sidebar-section">
                                <div className="sidebar-section-header">
                                    <Database size={14} />
                                    <span>Saved Collections</span>
                                </div>
                                {collections.map(col => (
                                    <div key={col.name} className="tag-group">
                                        <div className="tag-header">
                                            <div className="tag-header-left" onClick={() => toggleTag(col.name)}>
                                                {expandedTags[col.name] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                <Folder size={14} className="icon" style={{ color: 'var(--accent)' }} />
                                                <span>{col.name}</span>
                                                <span className="count-badge">{col.requests.length}</span>
                                            </div>
                                            {onDeleteCollection && (
                                                <button
                                                    className="delete-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm(`Delete collection "${col.name}"?`)) {
                                                            onDeleteCollection(col.name);
                                                        }
                                                    }}
                                                    title="Delete Collection"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                        {expandedTags[col.name] && (
                                            <div className="tag-items">
                                                {col.requests.map((req, i) => (
                                                    <div key={i} className="sidebar-item" onClick={() => {
                                                        onSelect({
                                                            method: req.method,
                                                            path: req.url,
                                                            summary: `Saved Request ${i + 1}`,
                                                            description: '',
                                                            tags: [col.name]
                                                        });
                                                    }}>
                                                        <span className={`method-badge ${req.method.toLowerCase()}`}>{req.method}</span>
                                                        <span className="summary">{req.url}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Render Spec Collections Section */}
                        {Object.keys(grouped).length > 0 && (
                            <div className="sidebar-section">
                                <div className="sidebar-section-header">
                                    <Globe size={14} />
                                    <span>API Endpoints</span>
                                </div>
                                {Object.entries(grouped).map(([tag, eps]) => (
                                    <div key={tag} className="tag-group">
                                        <div
                                            className="tag-header"
                                            onClick={() => toggleTag(tag)}
                                        >
                                            {expandedTags[tag] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            <Folder size={14} className="icon" />
                                            <span>{tag}</span>
                                            <span className="count-badge">{eps.length}</span>
                                        </div>
                                        {expandedTags[tag] && (
                                            <div className="tag-items">
                                                {eps.map((ep) => (
                                                    <div
                                                        key={ep.method + ep.path}
                                                        className={`sidebar-item ${activeEndpoint === ep ? 'active' : ''}`}
                                                        onClick={() => onSelect(ep)}
                                                    >
                                                        <span className={`method-badge ${ep.method.toLowerCase()}`}>{ep.method}</span>
                                                        <span className="summary">{ep.summary || ep.path}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="history-list">
                        {historyItems.length === 0 && (
                            <div className="empty-sidebar">
                                <span>No history yet</span>
                            </div>
                        )}
                        {historyItems.map((item, i) => (
                            <div key={i} className="history-item" onClick={() => {
                                onSelect({
                                    method: item.method,
                                    path: item.url,
                                    summary: 'History Item',
                                    description: '',
                                    tags: ['History']
                                });
                            }}>
                                <div className="history-main">
                                    <span className={`method-badge ${item.method.toLowerCase()}`}>{item.method}</span>
                                    <span className="url-text">{item.url}</span>
                                </div>
                                <div className="history-meta">
                                    <span className={`status-code ${item.status < 300 ? 'success' : 'error'}`}>{item.status}</span>
                                    <span className="time-text">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
