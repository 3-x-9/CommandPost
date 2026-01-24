import { useState } from "react";
import { ResponseData } from "../../types";
import { Copy, Check } from "lucide-react";

interface ResponsePanelProps {
    response: ResponseData | null;
    loading: boolean;
}

export function ResponsePanel({ response, loading }: ResponsePanelProps) {
    const [activeTab, setActiveTab] = useState("body");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (response?.body) {
            navigator.clipboard.writeText(response.body);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="response-panel">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <span>Sending request...</span>
                </div>
            </div>
        );
    }

    if (!response) {
        return (
            <div className="response-panel">
                <div className="empty-response-state">
                    Enter the URL and click Send to get a response
                </div>
            </div>
        );
    }

    const isJson = response.headers["Content-Type"]?.includes("application/json") ||
        (response.body && response.body.trim().startsWith("{") && response.body.trim().endsWith("}"));

    let formattedBody = response.body;
    try {
        if (isJson) {
            formattedBody = JSON.stringify(JSON.parse(response.body), null, 2);
        }
    } catch (e) {
        console.warn("Failed to parse JSON body:", e);
        // Fallback to raw body
    }

    return (
        <div className="response-panel">
            <div className="response-header">
                <div className="status-group">
                    <span className={`status-badge ${response.statusCode >= 200 && response.statusCode < 300 ? 'success' : 'error'}`}>
                        {response.statusCode} OK
                    </span>
                    <span className="meta-text">{response.timeMs}ms</span>
                    <span className="meta-text">{response.size}B</span>
                </div>
                <div className="actions">
                    {/* Save Response Logic would go here */}
                </div>
            </div>

            <div className="tabs small">
                <div
                    className={`tab ${activeTab === 'body' ? 'active' : ''}`}
                    onClick={() => setActiveTab('body')}
                >
                    Body
                </div>
                <div
                    className={`tab ${activeTab === 'headers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('headers')}
                >
                    Headers
                </div>
            </div>

            <div className="response-content">
                {activeTab === 'body' && (
                    <div className="response-body-container">
                        <div className="toolbar">
                            <div className="format-selector">
                                <span className={isJson ? "active" : ""}>JSON</span>
                                <span className={!isJson ? "active" : ""}>Raw</span>
                            </div>
                            <button className="btn-icon" onClick={handleCopy} title="Copy to clipboard">
                                {copied ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                            </button>
                        </div>
                        <pre className="code-block">
                            {formattedBody}
                        </pre>
                    </div>
                )}

                {activeTab === 'headers' && (
                    <div className="headers-list">
                        {Object.entries(response.headers).map(([key, value]) => (
                            <div key={key} className="header-row">
                                <span className="header-key">{key}</span>
                                <span className="header-value">{value}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
