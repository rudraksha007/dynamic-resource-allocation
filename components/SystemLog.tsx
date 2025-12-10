'use client';

import { LogEntry, LogLevel } from "@/lib/logger";
import { useEffect, useRef, useState } from "react";
import { Terminal, X, Trash2, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface SystemLogProps {
    logs: LogEntry[];
    onClear: () => void;
}

export function SystemLog({ logs, onClear }: SystemLogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [autoScroll, setAutoScroll] = useState(true);
    const [filterLevel, setFilterLevel] = useState<LogLevel | 'ALL'>('ALL');
    const logEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (autoScroll && logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, autoScroll]);

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
            setAutoScroll(isAtBottom);
        }
    };

    const filteredLogs = filterLevel === 'ALL' 
        ? logs 
        : logs.filter(log => log.level === filterLevel);

    const getLevelColor = (level: LogLevel): string => {
        switch (level) {
            case 'INFO': return 'text-blue-400';
            case 'SUCCESS': return 'text-green-400';
            case 'WARNING': return 'text-yellow-400';
            case 'ERROR': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getLevelBadgeColor = (level: LogLevel): string => {
        switch (level) {
            case 'INFO': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'SUCCESS': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'WARNING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'ERROR': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <>
            {/* Toggle Button (when collapsed) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 bg-gray-900 border-l border-t border-b border-gray-700 rounded-l-lg p-3 hover:bg-gray-800 transition-colors z-50 shadow-lg"
                    title="Open System Logs"
                >
                    <Terminal className="w-5 h-5 text-green-400" />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`fixed right-0 top-0 h-screen bg-gray-950 border-l border-gray-800 shadow-2xl transition-all duration-300 ease-in-out z-50 flex flex-col ${
                    isOpen ? 'w-[600px]' : 'w-0'
                }`}
            >
                {isOpen && (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-green-400" />
                                <h2 className="text-lg font-semibold text-gray-100">System Logs</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClear}
                                    className="h-8 px-2 hover:bg-gray-800"
                                    title="Clear logs"
                                >
                                    <Trash2 className="w-4 h-4" color="white" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 px-2 hover:bg-gray-800 text-white"
                                    title="Collapse"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="flex gap-2 p-3 border-b border-gray-800 bg-gray-900/50 flex-wrap">
                            {(['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'] as const).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setFilterLevel(level)}
                                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                                        filterLevel === level
                                            ? level === 'ALL'
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : getLevelBadgeColor(level)
                                            : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-750'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>

                        {/* Auto-scroll indicator */}
                        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-900/30 border-b border-gray-800">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoScroll}
                                    onChange={(e) => setAutoScroll(e.target.checked)}
                                    className="w-3 h-3"
                                />
                                Auto-scroll to bottom
                            </label>
                        </div>

                        {/* Logs Container */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
                        >
                            {filteredLogs.length === 0 ? (
                                <div className="text-center text-gray-500 mt-8">
                                    No logs to display
                                </div>
                            ) : (
                                filteredLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex gap-3 items-start hover:bg-gray-900/50 p-2 rounded transition-colors"
                                    >
                                        <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                                        <span className={`shrink-0 font-semibold ${getLevelColor(log.level)}`}>
                                            {log.level}:
                                        </span>
                                        <span className="text-gray-300 wrap-break-word">{log.message}</span>
                                    </div>
                                ))
                            )}
                            <div ref={logEndRef} />
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-gray-800 bg-gray-900 text-xs text-gray-500 text-center">
                            {filteredLogs.length} / {logs.length} logs
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
