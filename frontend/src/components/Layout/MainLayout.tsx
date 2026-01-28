import { useState, useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { EndpointDef, RequestData, ResponseData, SpecDetails } from "../../types";
import { Archive } from "lucide-react";
import { RequestPanel } from "../Request/RequestPanel";
import { ResponsePanel } from "../Response/ResponsePanel";
import { GenerateCLIModal } from "../CLI/GenerateCLIModal";
import { EnvironmentSwitcher } from "../Environment/EnvironmentSwitcher";
import {
    ParseSpecDetails, ExecuteRequest, LoadCollection, SaveHistory, SaveCollection, DeleteCollection, Generate,
    SelectDirectory, LoadHistory, GetEnvironments, SaveEnvironment, DeleteEnvironment, DeleteHistoryItem, DeleteHistory,
    ImportCollections, SelectFile
} from "../../../wailsjs/go/main/App"
import { Collection, Environment } from "../../types";

const defaultEndpoint = {
    method: "GET",
    path: "",
    summary: "",
    description: "",
    tags: [""],
}

export function MainLayout() {
    const [activeEndpoint, setActiveEndpoint] = useState<EndpointDef | null>(defaultEndpoint);
    const [response, setResponse] = useState<ResponseData | null>(null);
    const [loading, setLoading] = useState(false);
    const [endpoints, setEndpoints] = useState<EndpointDef[]>([]);
    const [baseUrl, setBaseUrl] = useState<string>("");
    const [history, setHistory] = useState<any[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [environments, setEnvironments] = useState<Environment[]>([]);
    const [activeEnv, setActiveEnv] = useState<Environment | null>(null);
    const [currentSpecPath, setCurrentSpecPath] = useState<string>("https://petstore3.swagger.io/api/v3/openapi.json");
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    useEffect(() => {
        ParseSpecDetails(currentSpecPath)
            .then((data: any) => {
                setEndpoints(data.endpoints);
                setBaseUrl(data.baseUrl);
            })
            .catch(console.error);

        // Load initial data from DB
        loadCollectionsFromDB();
        loadHistoryFromDB();
        loadEnvironmentsFromDB();
    }, []);

    const loadCollectionsFromDB = async () => {
        try {
            const data = await LoadCollection();
            setCollections(data || []);
        } catch (err) {
            console.error("Failed to load collections:", err);
        }
    };

    const loadEnvironmentsFromDB = async () => {
        try {
            const data = await GetEnvironments();
            setEnvironments(data || []);
        } catch (err) {
            console.error("Failed to load environments:", err);
        }
    };

    const handleSaveEnvironment = async (env: Environment) => {
        try {
            await SaveEnvironment(env);
            await loadEnvironmentsFromDB();
        } catch (err) {
            console.error("Failed to save environment:", err);
        }
    };

    const handleDeleteEnvironment = async (name: string) => {
        try {
            await DeleteEnvironment(name);
            await loadEnvironmentsFromDB();
            if (activeEnv?.name === name) setActiveEnv(null);
        } catch (err) {
            console.error("Failed to delete environment:", err);
        }
    };

    const loadHistoryFromDB = async () => {
        try {
            const data = await LoadHistory();
            if (data) {
                const formattedHistory = data.map((item: any) => {
                    let req: any = { method: "???", url: "???" };
                    let res: any = { statusCode: 0 };
                    try { req = JSON.parse(item.request || "{}"); } catch (e) { }
                    try { res = JSON.parse(item.response || "{}"); } catch (e) { }

                    return {
                        id: item.id,
                        method: req.method || "GET",
                        url: req.url || "",
                        status: res.statusCode || 0,
                        time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "Unknown"
                    };
                });
                setHistory(formattedHistory);
            } else {
                setHistory([]);
            }
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    };

    const handleSend = async (requestData: RequestData) => {
        setLoading(true);
        try {
            let req = { ...requestData };
            const currentBaseUrl = activeEnv?.variables?.baseUrl || baseUrl;

            if (currentBaseUrl && !req.url.startsWith('http')) {
                const cleanBase = currentBaseUrl.endsWith('/') ? currentBaseUrl.slice(0, -1) : currentBaseUrl;
                const cleanPath = req.url.startsWith('/') ? req.url : '/' + req.url;
                req.url = cleanBase + cleanPath;
            }
            const backendReq = { ...req }
            const res = await ExecuteRequest(backendReq as any);
            setResponse(res);

            await SaveHistory(backendReq as any, res);
            await loadHistoryFromDB();

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (requestData: RequestData, collectionName: string) => {
        try {
            const existing = collections.find(c => c.name === collectionName);
            const requests = existing ? [...existing.requests, requestData] : [requestData];

            const formattedRequests = requests.map(r => ({
                ...r,
                body: typeof r.body === 'string' ? r.body : "{}"
            }));

            await SaveCollection(collectionName, formattedRequests as any);
            await loadCollectionsFromDB();
        } catch (err) {
            console.error("Failed to save collection:", err);
        }
    };

    const handleDeleteCollection = async (name: string) => {
        try {
            await DeleteCollection(name);
            await loadCollectionsFromDB();
        } catch (err) {
            console.error("Failed to delete collection:", err);
        }
    };

    const handleDeleteHistory = async (id: number) => {
        try {
            await DeleteHistoryItem(id);
            await loadHistoryFromDB();
        } catch (err) {
            console.error("Failed to delete history item:", err);
        }
    };

    const handleDeleteAllHistory = async () => {
        if (!confirm("Are you sure you want to clear all history?")) return;
        try {
            await DeleteHistory();
            await loadHistoryFromDB();
        } catch (err) {
            console.error("Failed to delete all history:", err);
        }
    };

    const loadSpec = async (path: string) => {
        ParseSpecDetails(path)
            .then((data: any) => {
                setEndpoints(data.endpoints);
                setBaseUrl(data.baseUrl);
                setCurrentSpecPath(path);
            })
            .catch(console.error);
    };

    const handleGenerateCLI = async (moduleName: string, outputDir: string) => {
        return Generate(currentSpecPath, outputDir, moduleName);
    };

    const handleSelectDir = async () => {
        return SelectDirectory();
    };

    const [sidebarWidth, setSidebarWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizing) {
                setSidebarWidth(e.clientX);
            }
        };

        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleImportCollection = async () => {
        try {
            const path = await SelectFile();
            if (!path) return;

            await ImportCollections(path);
            await loadCollectionsFromDB();
        } catch (err) {
            console.error("Failed to import collection:", err);
        }
    };

    return (
        <div className="main-layout" style={{ cursor: isResizing ? 'col-resize' : 'default', userSelect: isResizing ? 'none' : 'auto' }}>
            <Sidebar
                endpoints={endpoints}
                onSelect={(ep) => {
                    setActiveEndpoint(ep);
                    setResponse(null); // null previous response
                }}
                activeEndpoint={activeEndpoint}
                onLoadSpec={loadSpec}
                onDeleteCollection={handleDeleteCollection}
                onImportCollection={handleImportCollection}
                onDeleteHistory={handleDeleteHistory}
                onDeleteAllHistory={handleDeleteAllHistory}
                width={sidebarWidth}
                historyItems={history}
                collections={collections}
            />
            <div
                className="resize-handle"
                onMouseDown={() => setIsResizing(true)}
            />
            <div className="content-area">
                {activeEndpoint ? (
                    <div className="workspace">
                        <div className="workspace-header">
                            <h2>{activeEndpoint.summary}</h2>
                            <EnvironmentSwitcher
                                environments={environments}
                                activeEnv={activeEnv}
                                onSelect={setActiveEnv}
                                onSave={handleSaveEnvironment}
                                onDelete={handleDeleteEnvironment}
                            />
                        </div>
                        <div className="api-path">
                            <span className={`method-pill ${activeEndpoint.method.toLowerCase()}`}>{activeEndpoint.method}</span>
                            <span className="path-text">{activeEndpoint.path}</span>
                        </div>

                        <RequestPanel
                            endpoint={activeEndpoint}
                            onSend={handleSend}
                            onSave={handleSave}
                            onShowGenerateModal={() => setIsGenerateModalOpen(true)}
                        />
                        <ResponsePanel response={response} loading={loading} />
                    </div>
                ) : (
                    <div className="empty-state">
                        <Archive size={48} />
                        <h3>Select an endpoint to start</h3>
                    </div>
                )}
            </div>

            <GenerateCLIModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                onGenerate={handleGenerateCLI}
                onSelectDir={handleSelectDir}
                specPath={currentSpecPath}
            />
        </div>
    );
}
