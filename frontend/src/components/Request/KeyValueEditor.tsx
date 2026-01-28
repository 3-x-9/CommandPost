import { Trash2, Plus } from "lucide-react";
import { KeyValueItem } from "../../types";

interface KeyValueEditorProps {
    items: KeyValueItem[];
    onChange: (items: KeyValueItem[]) => void;
    title?: string;
    allowFileUpload?: boolean;
}

export function KeyValueEditor({ items, onChange, title, allowFileUpload }: KeyValueEditorProps) {
    const handleUpdate = (id: string, field: keyof KeyValueItem, value: string | boolean) => {
        const newItems = items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        onChange(newItems);

        const lastItem = newItems[newItems.length - 1];
        if (lastItem && (lastItem.key || lastItem.value)) {
            addItem();
        }
    };

    const handleFileSelect = (id: string, file: File | null) => {
        if (file) {
            handleUpdate(id, 'value', file.name);
        }
    };

    const addItem = () => {
        onChange([
            ...items,
            {
                id: crypto.randomUUID(),
                key: "",
                value: "",
                description: "",
                enabled: true,
                isFile: false
            }
        ]);
    };

    const removeItem = (id: string) => {
        onChange(items.filter(item => item.id !== id));
    };

    return (
        <div className="key-value-editor">
            {title && <h4 className="editor-title">{title}</h4>}
            <div className="kv-table">
                <div className={`kv-header ${allowFileUpload ? 'with-file-upload' : ''}`}>
                    <div className="kv-col-check"></div>
                    <div className="kv-col">Key</div>
                    {allowFileUpload && <div className="kv-col-type">Type</div>}
                    <div className="kv-col">Value</div>
                    <div className="kv-col">Description</div>
                    <div className="kv-col-action"></div>
                </div>
                {items.map((item) => (
                    <div key={item.id} className={`kv-row ${!item.enabled ? 'disabled' : ''} ${allowFileUpload ? 'with-file-upload' : ''}`}>
                        <div className="kv-col-check">
                            <input
                                type="checkbox"
                                checked={item.enabled}
                                onChange={(e) => handleUpdate(item.id, 'enabled', e.target.checked)}
                            />
                        </div>
                        <div className="kv-col">
                            <input
                                placeholder="Key"
                                value={item.key}
                                onChange={(e) => handleUpdate(item.id, 'key', e.target.value)}
                            />
                        </div>
                        {allowFileUpload && (
                            <div className="kv-col-type">
                                <select
                                    className={"file-text-picker"}
                                    value={item.isFile ? "file" : "text"}
                                    onChange={(e) => handleUpdate(item.id, 'isFile', e.target.value === "file" ? true : false)}
                                >
                                    <option value="text">Text</option>
                                    <option value="file">File</option>
                                </select>
                            </div>
                        )}
                        <div className="kv-col">
                            {allowFileUpload && item.isFile ? (
                                <input
                                    type="file"
                                    onChange={(e) => handleFileSelect(item.id, e.target.files?.[0] || null)}
                                />
                            ) : (
                                <input
                                    placeholder="Value"
                                    value={item.value}
                                    onChange={(e) => handleUpdate(item.id, 'value', e.target.value)}
                                />
                            )}
                        </div>
                        <div className="kv-col">
                            <input
                                placeholder="Description"
                                value={item.description || ""}
                                onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                            />
                        </div>
                        <div className="kv-col-action">
                            <button className="btn-icon danger" onClick={() => removeItem(item.id)}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-text" onClick={addItem}>
                <Plus size={14} /> Add new
            </button>
        </div>
    );
}
