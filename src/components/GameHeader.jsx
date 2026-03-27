import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Timer, MousePointer2, Flag, AlertCircle } from 'lucide-react';

const GameHeader = () => {
    const { targetArticle, gameMode, clickCount, startTime, resetGame } = useGame();
    const [timeElapsed, setTimeElapsed] = useState(0);

    useEffect(() => {
        if (gameMode === 'SPEED' && startTime) {
            const interval = setInterval(() => {
                setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameMode, startTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <header className="sticky top-0 z-50 bg-slate-800 text-white shadow-md p-3">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">

                {/* Target Info */}
                <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-full">
                    <Flag className="w-5 h-5 text-red-400" />
                    <span className="text-sm font-semibold opacity-80">目標:</span>
                    <span
                        className="font-bold text-lg text-yellow-300 truncate max-w-[200px] md:max-w-xs"
                        title={(targetArticle?.displayTitle || targetArticle?.title || '').replace(/<[^>]*>/g, '')}
                        dangerouslySetInnerHTML={{ __html: targetArticle?.displayTitle || targetArticle?.title || 'None' }}
                    />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                    {/* Click Count */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded bg-slate-700 ${gameMode === 'CLICK' ? 'ring-2 ring-blue-500' : ''}`}>
                        <MousePointer2 className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-xl">{clickCount}</span>
                    </div>

                    {/* Timer (Show always or relevant?) */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded bg-slate-700 ${gameMode === 'SPEED' ? 'ring-2 ring-green-500' : ''}`}>
                        <Timer className="w-4 h-4 text-green-400" />
                        <span className="font-mono text-xl">{formatTime(timeElapsed)}</span>
                    </div>

                    <button
                        onClick={resetGame}
                        className="ml-2 hover:bg-slate-700 p-2 rounded text-red-400"
                        title="放棄 (Give Up)"
                    >
                        <AlertCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default GameHeader;
