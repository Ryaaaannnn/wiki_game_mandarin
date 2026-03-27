import { useGame } from '../context/GameContext';
import { Trophy, Timer, MousePointer2, RefreshCw } from 'lucide-react';

const ResultView = () => {
    const {
        startTime, endTime, clickCount, history, targetArticle, resetGame
    } = useGame();

    const timeTaken = endTime ? Math.floor((endTime - startTime) / 1000) : 0;
    const mins = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
            <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center animate-fade-in-up">

                <div className="inline-block p-4 bg-yellow-500/20 rounded-full mb-6">
                    <Trophy className="w-16 h-16 text-yellow-400" />
                </div>

                <h2 className="text-4xl font-bold mb-2">挑戰成功! (Success)</h2>
                <p className="text-slate-400 mb-8">你成功到達了 "{targetArticle?.displayTitle || targetArticle?.title}"</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-700 p-4 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                            <Timer className="w-4 h-4" />
                            時間
                        </div>
                        <div className="text-2xl font-mono font-bold">{timeString}</div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-xl">
                        <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                            <MousePointer2 className="w-4 h-4" />
                            點擊數
                        </div>
                        <div className="text-2xl font-mono font-bold">{clickCount}</div>
                    </div>
                </div>

                <div className="bg-slate-700/50 rounded-xl p-4 text-left max-h-60 overflow-y-auto mb-8">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2 sticky top-0 bg-slate-700/90 p-1">歷史路徑 ({history.length} 步)</h3>
                    <ul className="space-y-2">
                        {history.map((step, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-slate-500 font-mono w-6">{idx + 1}.</span>
                                <span>{step}</span>
                                {/* Note: step might be object or string depending on correction. Assuming string here. */}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={resetGame}
                    className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-colors"
                >
                    <RefreshCw className="w-5 h-5" />
                    再玩一次 (Play Again)
                </button>
            </div>
        </div>
    );
};

export default ResultView;
