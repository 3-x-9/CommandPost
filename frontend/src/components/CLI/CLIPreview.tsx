import { Copy, Terminal } from "lucide-react";
import { AuthConfig, KeyValueItem } from "../../types";

interface CLIPreviewProps {
    method: string;
    path: string;
    url: string;
    headers: KeyValueItem[];
    params: KeyValueItem[];
    auth: AuthConfig;
    body: string;
    onShowGenerateModal?: () => void;
}

export function CLIPreview({ method, path, headers, params, auth, body, onShowGenerateModal }: CLIPreviewProps) {

    const generateCommand = () => {
        // Construct a hypothetical CLI command based on the structure
        // This simulates what the generated CLI might look like

        let cmd = `cli`;

        // Convert path to CLI args (simplified logic)
        // e.g., /users/123 -> users get --id 123? Or users 123?
        // Let's assume resource-based: /users -> users
        const parts = path.split('/').filter(p => p && !p.startsWith('{'));
        if (parts.length > 0) {
            cmd += ` ${parts.join(' ')}`;
        }

        // Map method to action
        switch (method.toUpperCase()) {
            case 'GET':
                // often implicit for list/get, but let's be explicit if it's typical
                // cmd += ` list`; // or get
                break;
            case 'POST':
                cmd += ` create`;
                break;
            case 'PUT':
                cmd += ` update`;
                break;
            case 'DELETE':
                cmd += ` delete`;
                break;
        }

        // Params
        params.filter(p => p.enabled && p.key).forEach(p => {
            cmd += ` --${p.key} "${p.value}"`;
        });

        // Auth
        if (auth.type === 'bearer' && auth.bearerToken) {
            cmd += ` --token "${auth.bearerToken}"`;
        } else if (auth.type === 'basic') {
            cmd += ` --user "${auth.basicUsername}:${auth.basicPassword}"`;
        }

        // Headers (CLI usually handles this via specific flags, but maybe generic --header?)
        headers.filter(h => h.enabled && h.key).forEach(h => {
            cmd += ` --header "${h.key}=${h.value}"`;
        });

        // Body
        if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && body && body !== '{}') {
            cmd += ` --body '${body.replace(/'/g, "'\\''")}'`;
        }

        return cmd;
    };

    const command = generateCommand();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(command);
    };

    return (
        <div className="cli-preview">
            <div className="cli-header">
                <div className="cli-title">
                    <Terminal size={14} />
                    <span>Generated CLI Preview</span>
                </div>
                <button className="btn-icon" onClick={copyToClipboard} title="Copy to clipboard">
                    <Copy size={14} />
                </button>
            </div>
            <div className="cli-code">
                <code>{command}</code>
            </div>
            <div className="cli-promo">
                <span>Want this CLI? </span>
                <button className="btn-link" onClick={onShowGenerateModal}>Generate Code</button>
            </div>
        </div>
    );
}
