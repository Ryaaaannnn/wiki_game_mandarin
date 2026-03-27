import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { fetchArticle } from '../services/wikiApi';
import GameHeader from '../components/GameHeader';
import WikiViewer from '../components/WikiViewer';
import { Loader2, AlertCircle } from 'lucide-react';

const GameView = () => {
    const { currentArticle, recordClick, setError, error } = useGame();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [displayTitle, setDisplayTitle] = useState('');

    useEffect(() => {
        const loadArticle = async () => {
            if (!currentArticle) return;

            setLoading(true);
            try {
                const data = await fetchArticle(currentArticle.title);
                setContent(data.content);
                setDisplayTitle(data.displayTitle);
            } catch (err) {
                console.error("Failed to load article", err);
                setError(err.message);
            }
            setLoading(false);
        };

        loadArticle();
    }, [currentArticle, setError]);

    const handleNavigate = (nextTitle) => {
        recordClick(nextTitle);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-8 rounded-2xl border border-red-500/50 text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">出錯了</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-bold transition-colors"
                    >
                        重試
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <GameHeader />

            <main className="container mx-auto py-8 px-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        <p className="text-slate-600 font-medium">載入中...</p>
                    </div>
                ) : (
                    <>
                        <div className="max-w-4xl mx-auto mb-6">
                            <h1
                                className="text-3xl font-bold text-slate-900 border-b-2 border-slate-200 pb-2 mb-4"
                                dangerouslySetInnerHTML={{ __html: displayTitle || currentArticle?.title }}
                            />
                        </div>
                        <WikiViewer content={content} onNavigate={handleNavigate} />
                    </>
                )}
            </main>
        </div>
    );
};

export default GameView;
