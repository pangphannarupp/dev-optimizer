import { Node, Edge, Position } from 'reactflow';
import dagre from 'dagre';

const nodeWidth = 200; // Increased to accommodate wider labels and button
const nodeHeight = 50;

// Helper to layout only the visible nodes
export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Left-to-Right layout
    dagreGraph.setGraph({ rankdir: 'LR', ranksep: 100, nodesep: 20 });

    nodes.forEach((node) => {
        // We use slightly larger dimensions for the layout calculation to ensure spacing
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // Dagre node position is centered, ReactFlow is top-left
        return {
            ...node,
            targetPosition: Position.Left,
            sourcePosition: Position.Right,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

// Helper to find ALL paths that match the search term
export const findAllPaths = (data: any, searchTerm: string): string[] => {
    if (!searchTerm) return [];
    const lowerTerm = searchTerm.toLowerCase();
    const matches: string[] = [];

    const search = (current: any, path: string = 'root', keyName: string = 'Root') => {
        let isMatch = false;
        // Check key match
        if (keyName.toLowerCase().includes(lowerTerm)) {
            matches.push(path);
            isMatch = true;
        }

        const isObject = typeof current === 'object' && current !== null;

        // Check value match (leaf nodes)
        if (!isObject && String(current).toLowerCase().includes(lowerTerm)) {
            if (!isMatch) matches.push(path);
        }

        if (isObject) {
            for (const key of Object.keys(current)) {
                const childPath = `${path}.${key}`;
                search(current[key], childPath, key);
            }
        }
    };

    search(data);
    return matches;
};

// Generates the graph ONLY for nodes that are visible based on expandedIds
export const generateVisibleGraph = (
    json: any,
    expandedIds: Set<string>,
    onExpand: (id: string) => void,
    focusedMatchPath: string | null = null
) => {
    let nodes: Node[] = [];
    let edges: Edge[] = [];

    const traverse = (data: any, path: string = 'root', parentId: string | null = null, keyName: string = 'Root') => {
        const isObject = typeof data === 'object' && data !== null;
        let label = keyName;

        if (!isObject) {
            const valStr = String(data);
            const truncated = valStr.length > 30 ? valStr.substring(0, 30) + '...' : valStr;
            label = `${keyName}: ${truncated}`;
        }

        const isExpandable = isObject && Object.keys(data).length > 0;
        const isExpanded = expandedIds.has(path);
        const isMatched = focusedMatchPath === path;

        const newNode: Node = {
            id: path,
            type: 'mindmap', // We will use our custom node type
            data: {
                label,
                isExpandable,
                isExpanded,
                isMatched,
                onExpand, // Callback to toggle expansion
                originalValue: isObject ? undefined : String(data) // Store full value if needed for tooltip
            },
            position: { x: 0, y: 0 }, // Will be set by dagre
        };

        nodes.push(newNode);

        if (parentId) {
            edges.push({
                id: `e-${parentId}-${path}`,
                source: parentId,
                target: path,
                type: 'smoothstep', // nice curved edges
                animated: false,
                style: { stroke: '#475569', strokeWidth: 1.5 } // slate-600
            });
        }

        // Only traverse children if this node is expanded AND is an object
        if (isObject && isExpanded) {
            Object.keys(data).forEach((key) => {
                // Construct unique path for child: root.key1, root.key1.0, etc.
                const childPath = `${path}.${key}`;
                traverse(data[key], childPath, path, key);
            });
        }
    };

    if (json) {
        traverse(json);
    }

    // Apply layout logic provided by dagre
    return getLayoutedElements(nodes, edges);
};
