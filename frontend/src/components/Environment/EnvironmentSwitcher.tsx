import { useState } from "react";
import { Globe, Settings, Check } from "lucide-react";
import { Environment } from "../../types";
import { EnvironmentModal } from "./EnvironmentModal";

interface EnvironmentSwitcherProps {
    environments: Environment[];
    activeEnv: Environment | null;
    onSelect: (env: Environment | null) => void;
    onSave: (env: Environment) => Promise<void>;
    onDelete: (name: string) => Promise<void>;
}

export function EnvironmentSwitcher({ environments, activeEnv, onSelect, onSave, onDelete }: EnvironmentSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                                <span className="url">{env.base_url}</span>
                                {activeEnv?.name === env.name && <Check size={14} className="check" />}
                            </div>
                        ))}
                    </div>

                    <div className="env-actions">
                        <button className="btn-text" onClick={() => { setIsModalOpen(true); setIsOpen(false); }}>
                            <Settings size={14} /> Manage Environments
                        </button>
                    </div>
                </div>
            )}

            <EnvironmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                environments={environments}
                onSave={onSave}
                onDelete={onDelete}
            />
        </div>
    );
}
