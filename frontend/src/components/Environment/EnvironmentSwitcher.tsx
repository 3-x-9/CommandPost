import { useState } from "react";
import { Globe, Plus, Trash2, Settings, Check, X } from "lucide-react";
import { Environment } from "../../types";

interface EnvironmentSwitcherProps {
    environments: Environment[];
    activeEnv: Environment | null;
    onSelect: (env: Environment | null) => void;
    onSave: (env: Environment) => Promise<void>;
    onDelete: (name: string) => Promise<void>;
}

export function EnvironmentSwitcher({ environments, activeEnv, onSelect, onSave, onDelete }: EnvironmentSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [newEnvName, setNewEnvName] = useState("");
    const [newEnvUrl, setNewEnvUrl] = useState("");

    const handleAdd = async () => {
        if (!newEnvName || !newEnvUrl) return;
        await onSave({
            name: newEnvName,
            variables: { baseUrl: newEnvUrl }
        });
        setNewEnvName("");
        setNewEnvUrl("");
    };

    return (
        <div className="env-switcher">
            <button className="env-toggle" onClick={() => setIsOpen(!isOpen)}>
                <Globe size={16} />
                <span>{activeEnv ? activeEnv.name : "No Environment"}</span>
            </button>

            {isOpen && (
                <div className="env-dropdown">
                    <div className="env-list">
                        <div
                            className={`env-item ${!activeEnv ? 'active' : ''}`}
                            onClick={() => { onSelect(null); setIsOpen(false); }}
                        >
                            <span className="name">None (Spec Default)</span>
                            {!activeEnv && <Check size={14} className="check" />}
                        </div>
                        {environments.map(env => (
                            <div
                                key={env.name}
                                className={`env-item ${activeEnv?.name === env.name ? 'active' : ''}`}
                                onClick={() => { onSelect(env); setIsOpen(false); }}
                            >
                                <span className="name">{env.name}</span>
                                <span className="url">{env.variables.baseUrl}</span>
                                {activeEnv?.name === env.name && <Check size={14} className="check" />}
                            </div>
                        ))}
                    </div>

                    <div className="env-actions">
                        <button className="btn-text" onClick={() => setIsManaging(!isManaging)}>
                            <Settings size={14} /> {isManaging ? "Back" : "Manage"}
                        </button>
                    </div>

                    {isManaging && (
                        <div className="env-manage-panel">
                            {environments.map(env => (
                                <div key={env.name} className="manage-item">
                                    <span>{env.name}</span>
                                    <button className="btn-icon danger" onClick={() => onDelete(env.name)}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <div className="add-env-form">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newEnvName}
                                    onChange={(e) => setNewEnvName(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Base URL"
                                    value={newEnvUrl}
                                    onChange={(e) => setNewEnvUrl(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleAdd}>
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
