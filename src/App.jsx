import { useGame, GameProvider } from './context/GameContext';
import HomeView from './views/HomeView';
import SetupView from './views/SetupView';
import GameView from './views/GameView';
import ResultView from './views/ResultView';

const GameContainer = () => {
  const { gameState, setGameState, setGameMode } = useGame();

  const handleStartSetup = (mode) => {
    setGameMode(mode);
    setGameState('SETUP');
  };

  switch (gameState) {
    case 'HOME':
      return <HomeView onStartSetup={handleStartSetup} />;
    case 'SETUP':
      return <SetupView />;
    case 'GAME':
      return <GameView />;
    case 'OVER':
      return <ResultView />;
    default:
      return <HomeView onStartSetup={handleStartSetup} />;
  }
};

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  );
}

export default App;
