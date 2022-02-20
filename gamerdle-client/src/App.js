import './App.css';
import Footer from './components/Footer/Footer';
import GameContainer from './components/Game/GameContainer';
import Header from './components/Header/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <GameContainer />
      <Footer />
    </div>
  );
}

export default App;
