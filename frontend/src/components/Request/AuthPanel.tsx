import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthConfig } from "../../types";

import { OAuth2Panel } from "./OAuth2Panel";

interface AuthPanelProps {
    auth: AuthConfig;
    onChange: (auth: AuthConfig) => void;
}

export function AuthPanel({ auth, onChange }: AuthPanelProps) {
    const [showPassword, setShowPassword] = useState(false);

    const updateAuth = (field: keyof AuthConfig, value: string) => {
        onChange({ ...auth, [field]: value });
    };

    return (
        <div className="auth-panel">
            <div className="form-group">
                <label>Type</label>
                <select
                    value={auth.type}
                    onChange={(e) => onChange({ ...auth, type: e.target.value as any })}
                    className="input-select"
                >
                    <option value="none">No Auth</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="api_key">API Key</option>
                    <option value="oauth2">OAuth 2.0</option>
                </select>
            </div>

            {auth.type === 'api_key' && (
                <div className="auth-grid">
                    <div className="form-group">
                        <label>Key</label>
                        <input
                            type="text"
                            placeholder="e.g. X-API-Key"
                            value={auth.apiKeyKey || ''}
                            onChange={(e) => updateAuth('apiKeyKey', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Value</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="API Key Value"
                                value={auth.apiKey || ''}
                                onChange={(e) => updateAuth('apiKey', e.target.value)}
                            />
                            <button
                                className="btn-icon-inside"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Add to</label>
                        <select
                            value={auth.apiKeyIn || 'header'}
                            onChange={(e) => updateAuth('apiKeyIn', e.target.value as any)}
                            className="input-select"
                        >
                            <option value="header">Header</option>
                            <option value="query">Query Params</option>
                        </select>
                    </div>
                </div>
            )}

            {auth.type === 'bearer' && (
                <div className="form-group">
                    <label>Token</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Bearer Token"
                            value={auth.bearerToken || ''}
                            onChange={(e) => updateAuth('bearerToken', e.target.value)}
                        />
                        <button
                            className="btn-icon-inside"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            )}

            {auth.type === 'basic' && (
                <div className="auth-grid">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={auth.basicUsername || ''}
                            onChange={(e) => updateAuth('basicUsername', e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={auth.basicPassword || ''}
                                onChange={(e) => updateAuth('basicPassword', e.target.value)}
                            />
                            <button
                                className="btn-icon-inside"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {auth.type === 'oauth2' && (
                <OAuth2Panel
                    config={auth.oauth2Config || {
                        headerPrefix: 'Bearer',
                        autoRefreshToken: true,
                        shareToken: false,
                        grantType: 'authorization_code',
                        callbackUrl: 'http://your-application.com/registered/callback',
                        clientAuth: 'basic'
                    }}
                    onChange={(config) => onChange({ ...auth, oauth2Config: config })}
                />
            )}

            {auth.type === 'none' && (
                <div className="info-text">
                    This request does not use any authentication.
                </div>
            )}
        </div>
    );
}
