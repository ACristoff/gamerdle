import React from 'react';

import Footer from './components/Footer/Footer';
import GameContainer from './components/Game/GameContainer';
import Header from './components/Header/Header';

import './App.css';

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
