import { useState, useEffect } from "react";
import { EndpointDef, RequestData, KeyValueItem, AuthConfig } from "../../types";
import { Send, Save } from "lucide-react";
import { KeyValueEditor } from "./KeyValueEditor";
import { AuthPanel } from "./AuthPanel";
import { CLIPreview } from "../CLI/CLIPreview";

interface RequestPanelProps {
    endpoint: EndpointDef;
    onSend: (data: RequestData) => void;
    onSave?: (data: RequestData, collectionName: string) => void;
    onShowGenerateModal?: () => void;
}

export function RequestPanel({ endpoint, onSend, onSave, onShowGenerateModal }: RequestPanelProps) {
    const [url, setUrl] = useState(endpoint.path);
    const [method, setMethod] = useState(endpoint.method);
    const [activeTab, setActiveTab] = useState("params");
    const [body, setBody] = useState("{}");

    // Detailed state
    const [params, setParams] = useState<KeyValueItem[]>([
        { id: '1', key: '', value: '', enabled: true }
    ]);
    const [headers, setHeaders] = useState<KeyValueItem[]>([
        { id: '1', key: 'Content-Type', value: 'application/json', enabled: true },
        { id: '2', key: '', value: '', enabled: true }
    ]);
    const [auth, setAuth] = useState<AuthConfig>({ type: 'none' });

    useEffect(() => {
        setUrl(endpoint.path);
        setMethod(endpoint.method);
        // Reset state
        setParams([{ id: crypto.randomUUID(), key: '', value: '', enabled: true }]);
        setHeaders([{ id: crypto.randomUUID(), key: 'Content-Type', value: 'application/json', enabled: true }, { id: crypto.randomUUID(), key: '', value: '', enabled: true }]);
        setAuth({ type: 'none' });
        setBody("{}");
    }, [endpoint]);

    // Sync Params to URL (Simple implementation)
    useEffect(() => {
        // This is a one-way sync for now: Params -> URL
        // In a full implementation, we would want 2-way sync

        // 1. Parse current URL to get base
        const currentUrl = url.split('?')[0];

        // 2. Build query string from enabled params
        const queryParts = params
            .filter(p => p.enabled && p.key)
            .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`);

        if (queryParts.length > 0) {
            const newUrl = `${currentUrl}?${queryParts.join('&')}`;
            if (newUrl !== url) {
                setUrl(newUrl);
            }
        } else if (url.includes('?')) {
            // If we have no params but URL has query, and we just deleted them... 
            // This logic is tricky if we don't have 2-way sync. 
            // Let's safe guard: Only update if we are strictly adding params?
            // Actually, checking if we *originated* this change prevents loops (React handles this mostly)
        }
    }, [params]);

    const handleSend = () => {
        onSend(buildRequestData());
    };

    const handleSave = () => {
        const collectionName = prompt("Enter collection name:", "My Requests");
        if (collectionName && onSave) {
            onSave(buildRequestData(), collectionName);
        }
    };

    const buildRequestData = (): RequestData => {
        // Convert array to record
        const headerRecord: Record<string, string> = {};
        headers.forEach(h => {
            if (h.enabled && h.key) headerRecord[h.key] = h.value;
        });

        // Auth headers
        if (auth.type === 'bearer' && auth.bearerToken) {
            headerRecord['Authorization'] = `Bearer ${auth.bearerToken}`;
        } else if (auth.type === 'basic' && auth.basicUsername) {
            const token = btoa(`${auth.basicUsername}:${auth.basicPassword || ''}`);
            headerRecord['Authorization'] = `Basic ${token}`;
        }

        return {
            method,
            url, // URL already contains params
            headers: headerRecord,
            body,
            timeout: 5000
        };
    };

    return (
        <div className="request-panel">
            <div className="request-bar">
                <select
                    className={`method-select ${method.toLowerCase()}`}
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                </select>
                <input
                    className="url-input"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="Enter URL"
                />
                <button className="btn btn-primary" onClick={handleSend}>
                    <Send size={16} /> Send
                </button>
                <button className="btn btn-secondary icon-only" onClick={handleSave} title="Save to collection">
                    <Save size={16} />
                </button>
            </div>

            <div className="tabs">
                <div className={`tab ${activeTab === 'params' ? 'active' : ''}`} onClick={() => setActiveTab('params')}>Params</div>
                <div className={`tab ${activeTab === 'auth' ? 'active' : ''}`} onClick={() => setActiveTab('auth')}>Authorization</div>
                <div className={`tab ${activeTab === 'headers' ? 'active' : ''}`} onClick={() => setActiveTab('headers')}>Headers</div>
                <div className={`tab ${activeTab === 'body' ? 'active' : ''}`} onClick={() => setActiveTab('body')}>Body</div>
            </div>

            <div className="tab-content">
                {activeTab === 'params' && (
                    <KeyValueEditor items={params} onChange={setParams} title="Query Params" />
                )}

                {activeTab === 'auth' && (
                    <AuthPanel auth={auth} onChange={setAuth} />
                )}

                {activeTab === 'headers' && (
                    <KeyValueEditor items={headers} onChange={setHeaders} title="Request Headers" />
                )}

                {activeTab === 'body' && (
                    <div className="body-editor">
                        <div className="radio-group">
                            <label><input type="radio" name="bodyType" defaultChecked /> raw</label>
                            <label><input type="radio" name="bodyType" disabled /> form-data</label>
                            <label><input type="radio" name="bodyType" disabled /> x-www-form-urlencoded</label>
                        </div>
                        <div className="editor-container">
                            <textarea
                                className="code-editor"
                                value={body}
                                onChange={e => setBody(e.target.value)}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="cli-section">
                <CLIPreview
                    method={method}
                    url={url}
                    path={endpoint.path}
                    headers={headers}
                    params={params}
                    auth={auth}
                    body={body}
                    onShowGenerateModal={onShowGenerateModal}
                />
            </div>
        </div>
    );
}
