'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';

interface Suggestion {
    word: string;
    offset: number;
    length: number;
    message: string;
    suggestions: string[];
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

export default function SpellingChecker({ value, onChange, placeholder, className = '', rows = 4 }: Props) {
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [loading, setLoading] = useState(false);
    const [lastSuggestions, setLastSuggestions] = useState<Suggestion[]>([]);
    const [showAllPanel, setShowAllPanel] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mirrorRef = useRef<HTMLDivElement | null>(null);

    // parse responses from backend/model into Suggestion[]
    const parseSuggestions = (data: any): Suggestion[] => {
        if (!data) return [];
        if (Array.isArray(data)) return data as Suggestion[];
        if (Array.isArray(data.suggestions)) return data.suggestions as Suggestion[];
        if (Array.isArray(data.suggestion)) return data.suggestion as Suggestion[];
        return [];
    };

    // find suggestion that contains cursor, or null
    const findSuggestionAtCursor = (suggestions: Suggestion[], cursorPos: number): Suggestion | null => {
        for (const s of suggestions) {
            const start0 = Number(s.offset);
            const len = Number(s.length);
            if (Number.isNaN(start0) || Number.isNaN(len)) continue;
            const startCandidates = [start0, Math.max(0, start0 - 1)];
            for (const start of startCandidates) {
                if (cursorPos >= start && cursorPos < start + len) return s;
            }
        }
        return null;
    };

    // find nearest suggestion to cursorPos
    const findNearestSuggestion = (suggestions: Suggestion[], cursorPos: number): Suggestion | null => {
        let nearest: Suggestion | null = null;
        let bestDist = Infinity;
        for (const s of suggestions) {
            const start = Number(s.offset) || 0;
            const len = Number(s.length) || 0;
            const dist = Math.max(0, Math.min(Math.abs(cursorPos - start), Math.abs(cursorPos - (start + len))));
            if (dist < bestDist) {
                bestDist = dist;
                nearest = s;
            }
        }
        return nearest;
    };

    // compute caret coordinates using a mirror div for accurate placement
    const computeCaretCoordinates = (text: string, pos: number) => {
        const ta = textareaRef.current;
        if (!ta) return { top: 0, left: 0 };

        // create mirror if needed
        let mirror = mirrorRef.current;
        if (!mirror) {
            mirror = document.createElement('div');
            mirror.style.position = 'absolute';
            mirror.style.visibility = 'hidden';
            mirror.style.whiteSpace = 'pre-wrap';
            mirror.style.wordWrap = 'break-word';
            mirror.style.boxSizing = 'border-box';
            document.body.appendChild(mirror);
            mirrorRef.current = mirror;
        }

        const style = getComputedStyle(ta);
        mirror.style.width = `${ta.clientWidth}px`;
        mirror.style.font = style.font;
        mirror.style.padding = style.padding;
        mirror.style.border = style.border;
        mirror.style.lineHeight = style.lineHeight;
        mirror.style.letterSpacing = style.letterSpacing;

        const beforeText = text.slice(0, pos);
        const span = document.createElement('span');
        mirror.textContent = '';
        // set text content with a placeholder span at the caret
    const safe = beforeText.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    mirror.innerHTML = safe.replaceAll('\n', '<br/>');
        mirror.appendChild(span);

        const mirrorRect = mirror.getBoundingClientRect();
        const spanRect = span.getBoundingClientRect();
        const taRect = ta.getBoundingClientRect();

        const top = spanRect.top - mirrorRect.top + taRect.top - ta.scrollTop;
        const left = spanRect.left - mirrorRect.left + taRect.left - ta.scrollLeft;
        return { top, left };
    };

    const checkSpelling = async (text: string, cursorPos: number) => {
        if (!text || text.length < 3) {
            setSuggestion(null);
            setLastSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/spellcheck', { text });
            console.debug('spellcheck response:', res.data);
            const suggestions = parseSuggestions(res.data);
            setLastSuggestions(suggestions);

            const atCursor = findSuggestionAtCursor(suggestions, cursorPos);
            if (atCursor) {
                const coords = computeCaretCoordinates(text, cursorPos);
                setPosition({ top: coords.top, left: coords.left });
                setSuggestion(atCursor);
                setLoading(false);
                return;
            }

            const nearest = findNearestSuggestion(suggestions, cursorPos);
            if (nearest) {
                const coords = computeCaretCoordinates(text, Number(nearest.offset) || 0);
                setPosition({ top: coords.top, left: coords.left });
                setSuggestion(nearest);
                setLoading(false);
                return;
            }

            setSuggestion(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        onChange(newText);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            checkSpelling(newText, e.target.selectionStart);
        }, 1000) as unknown as NodeJS.Timeout;
    };

    const handleCursorActivity = () => {
        const el = textareaRef.current;
        if (!el) return;
        // selectionStart may not be updated until event completes; read it on next tick
        setTimeout(() => {
            const pos = textareaRef.current?.selectionStart ?? 0;
            checkSpelling(value, pos);
        }, 0);
    };

    const applySuggestion = (correction: string) => {
        if (!suggestion) return;

        const newText =
            value.slice(0, suggestion.offset) +
            correction +
            value.slice(suggestion.offset + suggestion.length);

        onChange(newText);
        setSuggestion(null);
        setShowAllPanel(false);
        // re-run check near the replaced word
        setTimeout(() => checkSpelling(newText, (suggestion.offset || 0) + correction.length), 200);
    };

    const applySuggestionFor = (sug: Suggestion, correction: string) => {
        const start = Number(sug.offset) || 0;
        const length = Number(sug.length) || 0;
        const newText = value.slice(0, start) + correction + value.slice(start + length);
        onChange(newText);
        // close panels and refresh suggestions
        setShowAllPanel(false);
        setSuggestion(null);
        setTimeout(() => checkSpelling(newText, start + correction.length), 200);
    };

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onClick={handleCursorActivity}
                onKeyUp={handleCursorActivity}
                onSelect={handleCursorActivity}
                onFocus={handleCursorActivity}
                placeholder={placeholder}
                className={`w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
                rows={rows}
            />

            {loading && (
                <div className="absolute top-2 right-2 text-xs text-gray-500">
                    Checking...
                </div>
            )}

            {suggestion && !showAllPanel && (
                <div
                    className="absolute bg-gray-800 text-white rounded-lg shadow-2xl p-4 z-50 w-64"
                    style={{
                        top: `${position.top + 30}px`,
                        left: `${position.left + 10}px`
                    }}
                >
                    <div className="mb-3">
                        <p className="font-semibold text-sm">Spelling</p>
                        <p className="text-xs text-gray-300">{suggestion.message}</p>
                    </div>

                    <div className="space-y-1 mb-3">
                        {suggestion.suggestions.slice(0, 5).map((correction) => (
                            <button
                                key={`${suggestion.word}-${suggestion.offset}-${correction}`}
                                onClick={() => applySuggestion(correction)}
                                className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-sm"
                            >
                                {correction}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <button
                            onClick={() => setSuggestion(null)}
                            className="text-xs text-gray-400 hover:text-white"
                        >
                            Ignore all
                        </button>
                        <button
                            onClick={() => setShowAllPanel(true)}
                            className="text-xs text-gray-400 hover:text-white"
                        >
                            Show all
                        </button>
                    </div>
                </div>
            )}

            {/* All suggestions panel (debug / fallback). Hidden when a per-word popup is active unless user opens it */}
            {lastSuggestions.length > 0 && (showAllPanel || !suggestion) && (
                <div className="absolute left-2 bottom-2 bg-white border rounded p-2 shadow text-sm z-40">
                    <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold">Suggestions</div>
                        <button onClick={() => setShowAllPanel(false)} className="text-xs text-gray-500">Close</button>
                    </div>
                    <div className="max-h-36 overflow-auto">
                        {lastSuggestions.map((s) => (
                            <div key={`${s.word}-${s.offset}`} className="mb-1">
                                <div className="text-xs text-gray-500">{s.word}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {s.suggestions.slice(0, 4).map((corr) => (
                                        <button key={`${s.word}-${s.offset}-${corr}`} onClick={() => applySuggestionFor(s, corr)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">
                                            {corr}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}