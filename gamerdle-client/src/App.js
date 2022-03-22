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
        <GameContainer />
        <Footer />
      </Container>
    </BrowserRouter>
  );
}

export default App;

// import { Container } from '@material-ui/core'
// import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

// import Navbar from "./components/Navbar/Navbar";
// import Home from "./components/Home/Home";

// const App = () => {


//   return (
//     <BrowserRouter>
//       <Container maxWidth="xl">
//         <Navbar />
//           <Routes>
//             <Route path="/games" exact element={<GameContainer />} />
//           </Routes>
//       </Container>
//     </BrowserRouter>
//   )
// }

// export default App;