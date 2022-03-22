import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import Footer from './components/Footer/Footer';
import GameContainer from './components/Game/GameContainer';
import Header from './components/Header/Header';

import { Container } from '@material-ui/core';
import './App.css';

const App = () => {

  return (
    <BrowserRouter>
      <Container className="App" maxWidth={false}>
        <Header />
        <Routes>
          <Route path="/" exact element={<Navigate to="/games" />} />
          <Route path="/games" exact element={<GameContainer />} />
          <Route path="/movies" exact element={<GameContainer />} />
          <Route path="/anime" exact element={<GameContainer />} />
          <Route path="/manga" exact element={<GameContainer />} />
          <Route path="/books" exact element={<GameContainer />} />
        </Routes>
        <Footer />
      </Container>
    </BrowserRouter>
  );
}

export default App;

{/* <BrowserRouter>
<Container maxWidth="xl">
  <Navbar />
    <Routes>
      <Route path="/" exact element={<Navigate to="/posts"/>} />
      <Route path="/posts" exact element={<Home />} />
      <Route path="/posts/search" exact element={<Home />} />
      <Route path="/posts/:id" element={<PostDetails />} />
      <Route path="/auth" exact element={!user ? <Auth /> : <Navigate to='/posts' /> }/>
    </Routes>
</Container>
</BrowserRouter>
) */}