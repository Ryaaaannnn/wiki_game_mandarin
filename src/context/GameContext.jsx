import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState('HOME'); // HOME, SETUP, GAME, OVER
    const [gameMode, setGameMode] = useState('SPEED'); // SPEED, CLICK
    const [startArticle, setStartArticle] = useState(null);
    const [targetArticle, setTargetArticle] = useState(null);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [clickCount, setClickCount] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resetGame = useCallback(() => {
        setGameState('HOME');
        setStartArticle(null);
        setTargetArticle(null);
        setCurrentArticle(null);
        setClickCount(0);
        setStartTime(null);
        setEndTime(null);
        setHistory([]);
        setError(null);
    }, []);

    const startGame = useCallback((start, target) => {
        setStartArticle(start);
        setTargetArticle(target);
        setCurrentArticle(start);
        setClickCount(0);
        setStartTime(Date.now());
        setEndTime(null);
        setHistory([start.title]);
        setGameState('GAME');
    }, []);

    const recordClick = useCallback((articleTitle) => {
        setClickCount(prev => prev + 1);
        setHistory(prev => [...prev, articleTitle]);
        setCurrentArticle(prev => ({ ...prev, title: articleTitle }));

        const normalizeTitle = (t) => t ? t.replace(/_/g, ' ').trim() : '';

        console.log(articleTitle, targetArticle?.title);

        if (normalizeTitle(articleTitle) === normalizeTitle(targetArticle?.title)) {
            setEndTime(Date.now());
            setGameState('OVER');
        }
    }, [targetArticle]);

    const value = {
        gameState,
        setGameState,
        gameMode,
        setGameMode,
        startArticle,
        setStartArticle,
        targetArticle,
        setTargetArticle,
        currentArticle,
        setCurrentArticle,
        clickCount,
        startTime,
        endTime,
        history,
        loading,
        setLoading,
        error,
        setError,
        resetGame,
        startGame,
        recordClick
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
