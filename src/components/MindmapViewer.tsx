import { useState, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, Panel, ReactFlowProvider, useReactFlow } from 'reactflow';
import { generateVisibleGraph, findAllPaths } from '../utils/JsonToMindmapUtil';
import MindmapNode from './MindmapNode';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import 'reactflow/dist/style.css';

const nodeTypes = {
    mindmap: MindmapNode,
};

interface MindmapViewerProps {
    data: any;
}

const MindmapViewerContent = ({ data }: MindmapViewerProps) => {
    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['root'])); // Start with root expanded
    const [searchTerm, setSearchTerm] = useState('');

    // Search State
    const [matches, setMatches] = useState<string[]>([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
    const [zoomToNode, setZoomToNode] = useState<string | null>(null);
    const [lastSearchTerm, setLastSearchTerm] = useState('');

    const onExpand = useCallback((id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
                // Optionally: could recursively delete children from set, 
                // but keeping them in set remembers state when re-expanded which is nice
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

    // Helper to focus on a specific node path
    const focusNode = useCallback((path: string) => {
        // Auto expand all parents
        const parts = path.split('.');
        setExpandedIds(prev => {
            const next = new Set(prev);
            // Ensure root is expanded
            let currentPath = parts[0];
            next.add(currentPath);

            for (let i = 1; i < parts.length; i++) {
                // Expand all parents up to the node
                // For last part (the node itself, we don't strictly need to expand it unless we want to see ITS children
                // But we do need to expand its parent to see IT.

                // Let's just rebuild path incrementally
                currentPath += `.${parts[i]}`;
                if (i < parts.length) {
                    // Add this path if it's not the final node, OR if we want to ensure the final node is expanded too?
                    // The requirement is to SEE the node. So its PARENT must be expanded.
                    // The loop builds "root.a". "root.a" is parent of "root.a.b".
                    // So we need to add "root.a" to set.

                    // Actually, let's keep it simple: Add everything in the chain.
                    // If leaf is added, no harm, just expanded with no children rendered if it's a leaf value.
                    next.add(currentPath);
                }
            }
            // Fix: We actually need to add the immediate parent of the target node to the set.
            // The loop above adds currentPath. 
            // If path is "root.a", parts=["root", "a"].
            // i=1. currentPath="root.a". Added.
            // We need "root" to be added. It was added at start.

            // The only issue is if `path` is just "root". parts=["root"]. loop doesn't run. "root" added. Correct.
            return next;
        });

        // Trigger zoom effect once nodes are ready
        setZoomToNode(path);
    }, []);

    // Effect to handle zooming when target node becomes available in the graph
    useEffect(() => {
        if (zoomToNode && nodes.some(n => n.id === zoomToNode)) {
            // Wait a tick to ensure ReactFlow has measured the new nodes
            const timer = setTimeout(() => {
                fitView({
                    nodes: [{ id: zoomToNode }],
                    duration: 1500,
                    padding: 0.3,
                    maxZoom: 2,
                    minZoom: 0.5
                });
                setZoomToNode(null); // Clear target to prevent re-zooming
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [nodes, zoomToNode, fitView]);

    // Search Handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        // If search term hasn't changed and we have matches, cycle to next match
        if (searchTerm === lastSearchTerm && matches.length > 0) {
            nextMatch();
            return;
        }

        const foundPaths = findAllPaths(data, searchTerm);
        setMatches(foundPaths);
        setLastSearchTerm(searchTerm);

        if (foundPaths.length > 0) {
            setCurrentMatchIndex(0);
            focusNode(foundPaths[0]);
        } else {
            setCurrentMatchIndex(-1);
        }
    };

    const nextMatch = () => {
        if (matches.length === 0) return;
        const nextIndex = (currentMatchIndex + 1) % matches.length;
        setCurrentMatchIndex(nextIndex);
        focusNode(matches[nextIndex]);
    };

    const prevMatch = () => {
        if (matches.length === 0) return;
        const prevIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
        setCurrentMatchIndex(prevIndex);
        focusNode(matches[prevIndex]);
    };

    // Re-generate graph when expanded state or data changes
    useEffect(() => {
        // Wrap in timeout to prevent blocking UI during large calcs
        const timer = setTimeout(() => {
            const focusedPath = currentMatchIndex >= 0 ? matches[currentMatchIndex] : null;
            const { nodes: newNodes, edges: newEdges } = generateVisibleGraph(data, expandedIds, onExpand, focusedPath);
            setNodes(newNodes);
            setEdges(newEdges);
        }, 10);
        return () => clearTimeout(timer);
    }, [data, expandedIds, onExpand, setNodes, setEdges, matches, currentMatchIndex]);

    const [isFullScreen, setIsFullScreen] = useState(false);
    const toggleFullScreen = () => setIsFullScreen(!isFullScreen);

    return (
        <div className={`${isFullScreen ? 'fixed inset-0 z-50 bg-slate-900' : 'w-full h-full bg-slate-900'}`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
                minZoom={0.1}
            >
                <Controls className="bg-white/90 border-slate-200 text-slate-700" />
                <Background color="#334155" gap={20} size={1} />
                <Panel position="top-right" className="flex flex-col gap-2 items-end">
                    <div className="bg-slate-800/90 text-slate-200 p-2 rounded shadow-lg border border-slate-700 text-xs backdrop-blur-sm flex gap-2 items-center">
                        <form onSubmit={handleSearch} className="flex items-center gap-2 border-r border-slate-600 pr-2 mr-2">
                            <Search size={14} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search all..."
                                className="bg-transparent border-none outline-none text-white w-32 placeholder:text-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>

                        {searchTerm && matches.length === 0 && (
                            <span className="text-red-400 mr-2 border-r border-slate-600 pr-2">
                                No results
                            </span>
                        )}

                        {matches.length > 0 && (
                            <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
                                <span className="text-slate-400 mr-1">
                                    {currentMatchIndex + 1}/{matches.length}
                                </span>
                                <button onClick={prevMatch} className="p-1 hover:bg-slate-700 rounded transition-colors" title="Previous">
                                    <ChevronUp size={14} />
                                </button>
                                <button onClick={nextMatch} className="p-1 hover:bg-slate-700 rounded transition-colors" title="Next">
                                    <ChevronDown size={14} />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={toggleFullScreen}
                            className="hover:text-blue-400 transition-colors flex items-center gap-1 whitespace-nowrap"
                        >
                            {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                        </button>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export const MindmapViewer = (props: MindmapViewerProps) => {
    return (
        <ReactFlowProvider>
            <MindmapViewerContent {...props} />
        </ReactFlowProvider>
    );
};
