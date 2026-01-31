import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Key, Info, Globe } from 'lucide-react';
import { Environment } from '../../types';
import { PerformOAuthFlow } from '../../../wailsjs/go/main/App';
import { OAuth2Panel } from '../Request/OAuth2Panel';

interface EnvironmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    environments: Environment[];
    onSave: (env: Environment) => Promise<void>;
    onDelete: (name: string) => Promise<void>;
}

export function EnvironmentModal({ isOpen, onClose, environments, onSave, onDelete }: EnvironmentModalProps) {
    const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
    const [editEnv, setEditEnv] = useState<Environment | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'auth' | 'variables'>('general');

    useEffect(() => {
        if (isOpen && environments.length > 0 && !selectedEnv) {
            setSelectedEnv(environments[0]);
            setEditEnv(parseEnv(environments[0]));
        }
    }, [environments, isOpen, selectedEnv]);

    const parseEnv = (env: Environment): Environment => {
        if (env.oauth2_config) {
            try {
                return { ...env, oauth2Config: JSON.parse(env.oauth2_config) };
            } catch (e) {
                console.error("Failed to parse oauth2_config", e);
            }
        }
        return env;
    };

    const handleNew = () => {
        const newEnv: Environment = {
            name: "New Environment",
            base_url: "",
            access_token: "",
            refresh_token: "",
            expires_at: "",
            auth_url: "",
            token_url: "",
            client_id: "",
            client_secret: "",
            redirect_uri: "http://127.0.0.1:8090/callback",
            scope: "openid profile email",
            variables: {},
            created_at: new Date().toISOString(),
            last_used: new Date().toISOString(),
            oauth2_config: ""
        };
        setSelectedEnv(null);
        setEditEnv(newEnv);
    };

    const handleSelect = (env: Environment) => {
        setSelectedEnv(env);
        setEditEnv(parseEnv(env));
    };

    const handleSave = async () => {
        if (editEnv) {
            const envToSave = { ...editEnv };
            if (envToSave.oauth2Config) {
                envToSave.oauth2_config = JSON.stringify(envToSave.oauth2Config);
                // Also sync top-level fields for backward compatibility/backend logic
                envToSave.access_token = envToSave.oauth2Config.accessToken || '';
                envToSave.auth_url = envToSave.oauth2Config.authUrl || '';
                envToSave.token_url = envToSave.oauth2Config.accessTokenUrl || '';
                envToSave.client_id = envToSave.oauth2Config.clientId || '';
                envToSave.client_secret = envToSave.oauth2Config.clientSecret || '';
                envToSave.redirect_uri = envToSave.oauth2Config.callbackUrl || '';
                envToSave.scope = envToSave.oauth2Config.scope || '';
            }
            await onSave(envToSave);
            setSelectedEnv(envToSave);
        }
    };

    const handleDiscover = async () => {
        if (!editEnv?.base_url) {
            alert("Please provide a Base URL first.");
            return;
        }

        try {
            const baseUrl = editEnv.base_url.replace(/\/$/, "");
            const discoveryUrl = `${baseUrl}/.well-known/openid-configuration`;
            const response = await fetch(discoveryUrl);
            if (!response.ok) throw new Error("Discovery document not found");

            const config = await response.json();
            const oauth2Config = editEnv.oauth2Config || {
                headerPrefix: 'Bearer',
                autoRefreshToken: true,
                shareToken: false,
                grantType: 'authorization_code',
                callbackUrl: 'http://your-application.com/registered/callback',
                clientAuth: 'basic'
            };

            setEditEnv({
                ...editEnv,
                auth_url: config.authorization_endpoint || "",
                token_url: config.token_endpoint || "",
                oauth2Config: {
                    ...oauth2Config,
                    authUrl: config.authorization_endpoint || "",
                    accessTokenUrl: config.token_endpoint || ""
                }
            });
            alert("Discovery successful! Auth and Token URLs updated.");
        } catch (err) {
            console.error("Discovery error:", err);
            alert("Could not discover OAuth2 configuration automatically. Please fill fields manually.");
        }
    };

    const handleAuth = async () => {
        if (!editEnv) return;

        if (editEnv.access_token && !isExpired(editEnv.expires_at)) {
            if (!confirm("Token is still valid. Do you want to refresh it?")) return;
        }

        if (!editEnv.auth_url || !editEnv.token_url || !editEnv.client_id) {
            alert("Please provide Authorization URL, Token URL, and Client ID first.");
            setActiveTab("auth");
            return;
        }

        try {
            const result = await PerformOAuthFlow(editEnv);
            // Sync new token back to oauth2Config
            const parsedResult = parseEnv(result);
            if (parsedResult.oauth2Config) {
                parsedResult.oauth2Config.accessToken = result.access_token;
            } else {
                parsedResult.oauth2Config = {
                    accessToken: result.access_token,
                    headerPrefix: 'Bearer',
                    autoRefreshToken: true,
                    shareToken: false,
                    grantType: 'authorization_code',
                    callbackUrl: result.redirect_uri,
                    clientId: result.client_id,
                    clientSecret: result.client_secret,
                    authUrl: result.auth_url,
                    accessTokenUrl: result.token_url,
                    scope: result.scope,
                    clientAuth: 'basic'
                };
            }
            setEditEnv(parsedResult);
            alert("Authentication successful!");
        } catch (err) {
            console.error("Auth error:", err);
            alert("Authentication failed: " + err);
        }
    };

    const isExpired = (expiresAt: string) => {
        if (!expiresAt) return true;
        const expires = new Date(expiresAt);
        return expires < new Date();
    };
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content env-modal">
                <div className="modal-header">
                    <h2>Manage Environments</h2>
                    <button className="btn-icon" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body-split">
                    <div className="env-sidebar">
                        <button className="btn btn-secondary w-full mb-4" onClick={handleNew}>
                            <Plus size={14} /> New Environment
                        </button>
                        <div className="env-list-nav">
                            {environments.map(env => (
                                <button
                                    key={env.name}
                                    className={`env-nav-item ${selectedEnv?.name === env.name ? 'active' : ''}`}
                                    onClick={() => handleSelect(env)}
                                >
                                    <Globe size={14} />
                                    <span>{env.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="env-editor">
                        {editEnv ? (
                            <>
                                <div className="editor-tabs">
                                    <button
                                        className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('general')}
                                    >General</button>
                                    <button
                                        className={`tab ${activeTab === 'auth' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('auth')}
                                    >Auth</button>
                                    <button
                                        className={`tab ${activeTab === 'variables' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('variables')}
                                    >Variables</button>
                                </div>

                                <div className="editor-content">
                                    {activeTab === 'general' && (
                                        <div className="form-group-stack">
                                            <div className="form-item">
                                                <label>Environment Name</label>
                                                <input
                                                    type="text"
                                                    value={editEnv.name}
                                                    onChange={e => setEditEnv({ ...editEnv, name: e.target.value })}
                                                    placeholder="e.g. Production, Staging"
                                                />
                                            </div>
                                            <div className="form-item">
                                                <label>Base URL</label>
                                                <input
                                                    type="text"
                                                    value={editEnv.base_url}
                                                    onChange={e => setEditEnv({ ...editEnv, base_url: e.target.value })}
                                                    placeholder="https://api.example.com"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'auth' && (
                                        <div className="auth-section">
                                            <div className="info-box mb-4">
                                                <Info size={16} />
                                                <span>Configure OAuth2 authentication for this environment.</span>
                                            </div>

                                            <div className="auth-actions mb-4">
                                                <button className="btn btn-secondary" onClick={handleDiscover}>
                                                    <Globe size={14} /> Discover Config
                                                </button>
                                            </div>

                                            <OAuth2Panel
                                                config={editEnv.oauth2Config || {
                                                    headerPrefix: 'Bearer',
                                                    autoRefreshToken: true,
                                                    shareToken: false,
                                                    grantType: 'authorization_code',
                                                    callbackUrl: editEnv.redirect_uri || 'http://your-application.com/registered/callback',
                                                    authUrl: editEnv.auth_url || '',
                                                    accessTokenUrl: editEnv.token_url || '',
                                                    clientId: editEnv.client_id || '',
                                                    clientSecret: editEnv.client_secret || '',
                                                    scope: editEnv.scope || '',
                                                    clientAuth: 'basic'
                                                }}
                                                onChange={(config) => {
                                                    setEditEnv({
                                                        ...editEnv,
                                                        oauth2Config: config,
                                                        // Sync back to top-level for immediate use in handleAuth
                                                        auth_url: config.authUrl || '',
                                                        token_url: config.accessTokenUrl || '',
                                                        client_id: config.clientId || '',
                                                        client_secret: config.clientSecret || '',
                                                        redirect_uri: config.callbackUrl || '',
                                                        scope: config.scope || ''
                                                    });
                                                }}
                                                onGetToken={handleAuth}
                                            />
                                        </div>
                                    )}

                                    {activeTab === 'variables' && (
                                        <div className="variables-section">
                                            <p className="text-muted mb-2">Custom environment variables</p>
                                            <div className="form-group-stack">
                                                {Object.entries(editEnv.variables).map(([key, value]) => (
                                                    <div className="form-item" key={key}>
                                                        <label>{key}</label>
                                                        <input
                                                            type="text"
                                                            value={value}
                                                            onChange={e => {
                                                                const newVariables = { ...editEnv.variables };
                                                                newVariables[key] = e.target.value;
                                                                setEditEnv({ ...editEnv, variables: newVariables });
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    )}
                                </div>

                                <div className="editor-footer">
                                    <button className="btn btn-danger" onClick={() => onDelete(editEnv.name)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                    <button className="btn btn-primary" onClick={handleSave}>
                                        <Save size={14} /> Save Changes
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="empty-state">
                                <Globe size={48} className="mb-4 text-muted" />
                                <p>Select an environment or create a new one</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
