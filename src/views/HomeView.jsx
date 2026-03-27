import { Play, Timer, MousePointer2 } from 'lucide-react';

const HomeView = ({ onStartSetup }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                        WIKI RACE 繁中版
                    </h1>
                    <p className="text-xl text-slate-400">
                        從起點維基百科頁面，透過點擊連結，以最快速度或最少次數到達目標頁面。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => onStartSetup('SPEED')}
                        className="group relative overflow-hidden bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-emerald-500 transition-all text-left"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-400">
                                <Timer className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">競速模式</h2>
                        </div>
                        <p className="text-slate-400">挑戰以最短時間完成路徑。適合想要挑戰手速的玩家。</p>
                        <div className="mt-6 flex items-center gap-2 text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            開始設定 <Play className="w-4 h-4 fill-current" />
                        </div>
                    </button>

                    <button
                        onClick={() => onStartSetup('CLICK')}
                        className="group relative overflow-hidden bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all text-left"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-400">
                                <MousePointer2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">精準模式</h2>
                        </div>
                        <p className="text-slate-400">挑戰以最少點擊次數完成路徑。適合喜歡思考的策略家。</p>
                        <div className="mt-6 flex items-center gap-2 text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            開始設定 <Play className="w-4 h-4 fill-current" />
                        </div>
                    </button>
                </div>

                <div className="pt-12 text-slate-500 text-sm">
                    使用 zh.wikipedia.org (中文維基百科) 資料
                </div>
            </div>
        </div>
    );
};

export default HomeView;
