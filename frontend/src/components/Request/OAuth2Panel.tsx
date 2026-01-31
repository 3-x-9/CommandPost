import { AuthConfig } from "../../types";

interface OAuth2PanelProps {
    config: NonNullable<AuthConfig['oauth2Config']>;
    onChange: (config: NonNullable<AuthConfig['oauth2Config']>) => void;
    onGetToken?: () => void;
}

export function OAuth2Panel({ config, onChange, onGetToken }: OAuth2PanelProps) {
    const updateConfig = (updates: Partial<NonNullable<AuthConfig['oauth2Config']>>) => {
        onChange({ ...config, ...updates });
    };

    return (
        <div className="oauth2-panel">
            <div className="auth-section">
                <h3 className="auth-section-title">Current Token</h3>

                <div className="form-group">
                    <label>Token</label>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="No token available"
                            value={config.accessToken || ''}
                            onChange={(e) => updateConfig({ accessToken: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Header Prefix</label>
                    <input
                        type="text"
                        placeholder="Bearer"
                        value={config.headerPrefix || 'Bearer'}
                        onChange={(e) => updateConfig({ headerPrefix: e.target.value })}
                    />
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={config.autoRefreshToken}
                            onChange={(e) => updateConfig({ autoRefreshToken: e.target.checked })}
                        />
                        <div className="checkbox-text">
                            <span className="label-text">Auto-refresh Token</span>
                            <span className="help-text">Your expired token will be auto-refreshed before sending a request.</span>
                        </div>
                    </label>
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={config.shareToken}
                            onChange={(e) => updateConfig({ shareToken: e.target.checked })}
                        />
                        <div className="checkbox-text">
                            <span className="label-text">Share Token</span>
                            <span className="help-text">This will allow anyone with access to this request to view and use it.</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="auth-section mt-6">
                <h3 className="auth-section-title">Configure New Token</h3>

                <div className="form-group">
                    <label>Token Name</label>
                    <input
                        type="text"
                        placeholder="Enter a token name..."
                        value={config.tokenName || ''}
                        onChange={(e) => updateConfig({ tokenName: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Grant type</label>
                    <select
                        value={config.grantType}
                        onChange={(e) => updateConfig({ grantType: e.target.value })}
                        className="input-select"
                    >
                        <option value="authorization_code">Authorization Code</option>
                        <option value="implicit">Implicit</option>
                        <option value="password">Password Credentials</option>
                        <option value="client_credentials">Client Credentials</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Callback URL</label>
                    <input
                        type="text"
                        placeholder="http://your-application.com/registered/callback"
                        value={config.callbackUrl || ''}
                        onChange={(e) => updateConfig({ callbackUrl: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Auth URL</label>
                    <input
                        type="text"
                        placeholder="https://example.com/login/oauth/authorize"
                        value={config.authUrl || ''}
                        onChange={(e) => updateConfig({ authUrl: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Access Token URL</label>
                    <input
                        type="text"
                        placeholder="https://example.com/login/oauth/access_token"
                        value={config.accessTokenUrl || ''}
                        onChange={(e) => updateConfig({ accessTokenUrl: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Client ID</label>
                    <input
                        type="text"
                        placeholder="Client ID"
                        value={config.clientId || ''}
                        onChange={(e) => updateConfig({ clientId: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Client Secret</label>
                    <input
                        type="password"
                        placeholder="Client Secret"
                        value={config.clientSecret || ''}
                        onChange={(e) => updateConfig({ clientSecret: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Scope</label>
                    <input
                        type="text"
                        placeholder="e.g. read:org"
                        value={config.scope || ''}
                        onChange={(e) => updateConfig({ scope: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>State</label>
                    <input
                        type="text"
                        placeholder="State"
                        value={config.state || ''}
                        onChange={(e) => updateConfig({ state: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Client Authentication</label>
                    <select
                        value={config.clientAuth}
                        onChange={(e) => updateConfig({ clientAuth: e.target.value as any })}
                        className="input-select"
                    >
                        <option value="basic">Send as Basic Auth header</option>
                        <option value="body">Send client credentials in body</option>
                    </select>
                </div>

                <button className="btn btn-primary mt-4 w-full" onClick={onGetToken}>
                    Get New Access Token
                </button>
            </div>
        </div>
    );
}
