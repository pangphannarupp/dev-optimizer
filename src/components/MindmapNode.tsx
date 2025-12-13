import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChevronRight, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const MindmapNode = ({ data, id }: NodeProps) => {
    return (
        <div className="group relative flex items-center">
            {/* Target Handle (Left) - for incoming connections */}
            <Handle
                type="target"
                position={Position.Left}
                className={clsx(
                    "!w-1 !h-1 !bg-gray-400 !border-none",
                    "!opacity-0 group-hover:!opacity-100 transition-opacity"
                )}
            />

            <div
                className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all min-w-[120px]",
                    "bg-slate-700 border-slate-600 text-slate-100 shadow-slate-900/10", // Dark theme by default
                    data.isExpanded ? "ring-2 ring-blue-500/50" : "hover:border-slate-500",
                    data.isMatched && "!bg-yellow-500/20 !border-yellow-500 !ring-2 !ring-yellow-500/50"
                )}
            >
                <div className="flex-1 truncate text-sm font-medium pr-2">
                    {data.label}
                </div>

                {/* Expand Button */}
                {data.isExpandable && (
                    <button
                        className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            data.onExpand?.(id);
                        }}
                    >
                        {data.isExpanded ? (
                            <ChevronDown size={14} />
                        ) : (
                            <ChevronRight size={14} />
                        )}
                    </button>
                )}
            </div>

            {/* Source Handle (Right) - for outgoing connections */}
            <Handle
                type="source"
                position={Position.Right}
                className={clsx(
                    "!w-1 !h-1 !bg-gray-400 !border-none",
                    "!opacity-0 group-hover:!opacity-100 transition-opacity"
                )}
            />
        </div>
    );
};

export default memo(MindmapNode);
