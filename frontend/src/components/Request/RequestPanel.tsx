import { useState, useEffect } from "react";
import { EndpointDef, RequestData, KeyValueItem, AuthConfig, FormDataPart } from "../../types";
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
    const [bodyType, setBodyType] = useState("raw");
    const [formDataItems, setFormDataItems] = useState<KeyValueItem[]>([
        { id: crypto.randomUUID(), key: '', value: '', enabled: true, isFile: false }
    ]);
    const [urlEncodedItems, setUrlEncodedItems] = useState<KeyValueItem[]>([
        { id: crypto.randomUUID(), key: '', value: '', enabled: true, isFile: false }
    ]);


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

    useEffect(() => {
        // This is a one-way sync for now: Params -> URL
        // In a full implementation, we would want 2-way sync

        const currentUrl = url.split('?')[0];

        const queryParts = params
            .filter(p => p.enabled && p.key)
            .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`);

        if (queryParts.length > 0) {
            const newUrl = `${currentUrl}?${queryParts.join('&')}`;
            if (newUrl !== url) {
                setUrl(newUrl);
            }
        } else if (url.includes('?')) {
            // If we have no params but URL has query, and just deleted them...
            // checking if we *originated* this change prevents loops (React handles this mostly)
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
        const headerRecord: Record<string, string> = {};
        headers.forEach(h => {
            if (h.enabled && h.key) headerRecord[h.key] = h.value;
        });

        let finalUrl = url;

        if (auth.type === 'bearer' && auth.bearerToken) {
            headerRecord['Authorization'] = `Bearer ${auth.bearerToken}`;
        } else if (auth.type === 'basic' && auth.basicUsername) {
            const token = btoa(`${auth.basicUsername}:${auth.basicPassword || ''}`);
            headerRecord['Authorization'] = `Basic ${token}`;
        } else if (auth.type === 'api_key' && auth.apiKey && auth.apiKeyKey) {
            if (auth.apiKeyIn === 'query') {
                const connector = finalUrl.includes('?') ? '&' : '?';
                finalUrl += `${connector}${encodeURIComponent(auth.apiKeyKey)}=${encodeURIComponent(auth.apiKey)}`;
            } else {
                headerRecord[auth.apiKeyKey] = auth.apiKey;
            }
        } else if (auth.type === 'oauth' && auth.oauthToken) {
            headerRecord['Authorization'] = `Bearer ${auth.oauthToken}`;
        } else if (auth.type === 'oauth2') {
            const prefix = auth.oauth2Config?.headerPrefix || 'Bearer';
            const token = auth.oauth2Config?.accessToken;
            if (token) {
                headerRecord['Authorization'] = `${prefix} ${token}`;
            }
        }

        let requestBody = "";
        let formData: Record<string, FormDataPart> = {};
        if (bodyType === "form-data") {
            const formDataRecord: Record<string, FormDataPart> = {};
            formDataItems.forEach(f => {
                if (f.enabled && f.key) formDataRecord[f.key] = { value: f.value, isFile: f.isFile || false };
            });

            headerRecord['Content-Type'] = 'multipart/form-data';
            return {
                method,
                url: finalUrl,
                headers: headerRecord,
                body: requestBody,
                formData: formDataRecord,
                timeout: 5000
            };
        } else if (bodyType === "x-www-form-urlencoded") {
            const bodyParts = urlEncodedItems
                .filter(f => f.enabled && f.key)
                .map(f => `${encodeURIComponent(f.key)}=${encodeURIComponent(f.value)}`);
            requestBody = bodyParts.join('&');
            headerRecord['Content-Type'] = 'application/x-www-form-urlencoded';

            return {
                method,
                url: finalUrl,
                headers: headerRecord,
                body: requestBody,
                formData,
                timeout: 5000
            };
        } else if (bodyType === "raw") {
            return {
                method,
                url: finalUrl,
                headers: headerRecord,
                body: body,
                formData,
                timeout: 5000
            };
        } else {
            return {
                method,
                url: finalUrl,
                headers: headerRecord,
                body: requestBody,
                formData,
                timeout: 5000
            };
        }
    };


    const handleBodyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBodyType(e.target.value);

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
                            <label><input type="radio" name="bodyType" defaultChecked onChange={handleBodyTypeChange} value="raw" /> raw</label>
                            <label><input type="radio" name="bodyType" onChange={handleBodyTypeChange} value="form-data" /> form-data</label>
                            <label><input type="radio" name="bodyType" onChange={handleBodyTypeChange} value="x-www-form-urlencoded" /> x-www-form-urlencoded</label>
                        </div>
                        <div className="editor-container">
                            {bodyType === "raw" ? (
                                <textarea
                                    className="code-editor"
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                />
                            ) : bodyType === "form-data" ? (
                                <KeyValueEditor
                                    items={formDataItems}
                                    onChange={setFormDataItems}
                                    title="Form Data"
                                    allowFileUpload={true}
                                />
                            ) : (
                                <KeyValueEditor
                                    items={urlEncodedItems}
                                    onChange={setUrlEncodedItems}
                                    title="x-www-form-urlencoded"
                                />
                            )}
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
