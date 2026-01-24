import { useState } from "react";
import { X, FolderOpen, Terminal, CheckCircle2 } from "lucide-react";

interface GenerateCLIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (moduleName: string, outputDir: string) => Promise<void>;
    onSelectDir: () => Promise<string | null>;
    specPath: string;
}

export function GenerateCLIModal({ isOpen, onClose, onGenerate, onSelectDir, specPath }: GenerateCLIModalProps) {
    const [moduleName, setModuleName] = useState("my-cli");
    const [outputDir, setOutputDir] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleBrowse = async () => {
        const dir = await onSelectDir();
        if (dir) {
            setOutputDir(dir);
        }
    };

    const handleGenerate = async () => {
        if (!moduleName || !outputDir) {
            setError("Module name and output directory are required");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await onGenerate(moduleName, outputDir);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 3000);
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="title-group">
                        <Terminal size={20} className="icon" />
                        <h3>Generate Go CLI</h3>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="modal-body success-state">
                        <CheckCircle2 size={48} className="success-icon" />
                        <h4>CLI Generated Successfully!</h4>
                        <p>Your CLI source code is ready at:</p>
                        <code className="path-display">{outputDir}</code>
                    </div>
                ) : (
                    <div className="modal-body">
                        <p className="description">
                            Generate a full-featured Go CLI from the current OpenAPI specification.
                            The generated code will include commands for all endpoints, authentication support, and error handling.
                        </p>

                        <div className="form-group">
                            <label>Module Name</label>
                            <input
                                type="text"
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                                placeholder="e.g. my-api-cli"
                            />
                            <span className="input-hint">Used for go.mod initialization</span>
                        </div>

                        <div className="form-group">
                            <label>Output Directory</label>
                            <div className="input-with-action">
                                <input
                                    type="text"
                                    value={outputDir}
                                    onChange={(e) => setOutputDir(e.target.value)}
                                    placeholder="Select directory..."
                                />
                                <button className="btn-secondary" onClick={handleBrowse}>
                                    <FolderOpen size={16} />
                                    Browse
                                </button>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={onClose} disabled={loading}>
                                Cancel
                            </button>
                            <button
                                className="btn"
                                onClick={handleGenerate}
                                disabled={loading || !moduleName || !outputDir}
                            >
                                {loading ? "Generating..." : "Generate CLI"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
