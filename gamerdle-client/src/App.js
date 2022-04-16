import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Footer from './components/Footer/Footer';
import GameContainer from './components/Game/GameContainer';
import MovieContainer from './components/Movie/MovieContainer';
import AnimeContainer from './components/Anime/AnimeContainer';
import MangaContainer from './components/Manga/MangaContainer';
import BookContainer from './components/Book/BookContainer';
import Header from './components/Header/Header';

import './App.css';

const App = () => {

  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Header />
          <Routes>
            <Route path="/" exact element={<Navigate to="/games" />} />
            <Route path="/games" exact element={<GameContainer />} />
            <Route path="/movies" exact element={<MovieContainer />} />
            <Route path="/anime" exact element={<AnimeContainer />} />
            <Route path="/manga" exact element={<MangaContainer />} />
            <Route path="/books" exact element={<BookContainer />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;