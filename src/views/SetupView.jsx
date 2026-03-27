import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { fetchRandomArticles, searchArticles } from '../services/wikiApi';
import { Search, Shuffle, ArrowRight, Flag, MapPin, Loader2, Play } from 'lucide-react';

const ArticleInput = ({ label, value, onSelect, icon: Icon, placeholder }) => {
    const [query, setQuery] = useState(value?.title || '');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        setQuery(value?.title || '');
    }, [value]);

    const handleSearch = async (val) => {
        setQuery(val);
        if (val.length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        const titles = await searchArticles(val);
        setResults(titles);
        setSearching(false);
    };

    return (
        <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Icon className="w-4 h-4" /> {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {searching && <Loader2 className="w-5 h-5 absolute right-3 top-3 animate-spin text-slate-500" />}
            </div>
            {results.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-xl shadow-2xl overflow-hidden">
                    {results.map((title) => (
                        <button
                            key={title}
                            onClick={() => {
                                onSelect({ title });
                                setQuery(title);
                                setResults([]);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-none"
                        >
                            {title}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const SetupView = () => {
    const { startArticle, setStartArticle, targetArticle, setTargetArticle, startGame, resetGame } = useGame();
    const [loading, setLoading] = useState(false);

    const handleRandomize = async () => {
        setLoading(true);
        try {
            const [start, target] = await fetchRandomArticles(2);
            setStartArticle(start);
            setTargetArticle(target);
        } catch (error) {
            console.error("Failed to randomize", error);
        }
        setLoading(false);
    };

    const isReady = startArticle && targetArticle;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
            <div className="max-w-xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-2">設定比賽</h2>
                    <p className="text-slate-400 text-sm">選擇起點與終點，或者隨機生成。</p>
                </div>

                <div className="space-y-6">
                    <ArticleInput
                        label="起點頁面"
                        value={startArticle}
                        onSelect={setStartArticle}
                        icon={MapPin}
                        placeholder="搜尋起點..."
                    />

                    <div className="flex justify-center">
                        <ArrowRight className="w-6 h-6 text-slate-600" />
                    </div>

                    <ArticleInput
                        label="終點頁面"
                        value={targetArticle}
                        onSelect={setTargetArticle}
                        icon={Flag}
                        placeholder="搜尋目標..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                        onClick={handleRandomize}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shuffle className="w-5 h-5" />}
                        隨機
                    </button>
                    <button
                        onClick={() => startGame(startArticle, targetArticle)}
                        disabled={!isReady || loading}
                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        開始挑戰 <Play className="w-5 h-5 fill-current" />
                    </button>
                </div>

                <button
                    onClick={resetGame}
                    className="w-full text-slate-500 hover:text-slate-400 text-sm font-medium"
                >
                    取消並返回
                </button>
            </div>
        </div>
    );
};

export default SetupView;
