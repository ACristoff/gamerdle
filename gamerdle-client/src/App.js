import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Footer from './components/Footer/Footer';
import GameContainer from './components/Game/GameContainer';
import Header from './components/Header/Header';

import './App.css';

function App() {

  const client_ID = process.env.REACT_APP_CLIENT_ID;
  const client_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const [token, setToken] = useState('');

  const getToken = () => {
    try {
      axios({
        method: 'post',
        url: `https://id.twitch.tv/oauth2/token?client_id=${client_ID}&client_secret=${client_SECRET}&grant_type=client_credentials`
      }).then((res) => {
        console.log(res)
        setToken(res.data.access_token)
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!token) {
      getToken()
    }
  }, [token])


  return (
    <div className="App">
      <Header />
      <GameContainer />
      <Footer />
    </div>
  );
}

export default App;
