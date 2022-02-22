import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { TextField, Button } from '@material-ui/core';


const GameContainer = () => {
  const client_ID = process.env.REACT_APP_CLIENT_ID;
  const client_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const [token, setToken] = useState('');
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [guessData, setGuessData] = useState({});
  const [answer, setAnswer] = useState('Dark Souls 2 Scholar of The First Sin')
  const [answerData, setAnswerData] = useState({})

  const CORS_ANYWHERE_URL = 'https://acristoff-cors-anywhere.herokuapp.com'
  const API_URL = 'https://api.igdb.com/v4'

  const handleGuessSubmit = (e) => {
    // guesses.length === 6 ?
    e.preventDefault();
    setGuesses([...guesses, guess]);
    getGuessData(guess);
    setGuess('');
  }

  const getToken = async () => {
    try {
      axios({
        method: 'POST',
        url: `https://id.twitch.tv/oauth2/token?client_id=${client_ID}&client_secret=${client_SECRET}&grant_type=client_credentials`,
      }).then((res) => {
        console.log(res)
        setToken(res.data.access_token)
      });
    } catch (error) {
      console.log(error)
    }
  };

  const getGuessData = async (guessedGame) => {
    getAnswerData()

    const bodyData = `search "${guessedGame}"; fields alternative_name,character,checksum,collection,company,description,game,name,platform,published_at,test_dummy,theme;`
    
    axios({
      method: 'POST',
      url: `${CORS_ANYWHERE_URL}/${API_URL}/search/`,
      headers: {
        'Accept': 'application/json',
        'Client-ID': client_ID,
        'Authorization': `Bearer ${token}`,
      },
      data: bodyData
    }).then(response => {
      console.log(response.data)
    })
    .catch (error => {
      console.log(error)
    });
  }

  const getAnswerData = async () => {
    const bodyData = `search "dark souls"; fields *; limit 10;`
    // search "nier"; fields *; limit 10;
    axios({
      method: 'POST',
      url: `${CORS_ANYWHERE_URL}/${API_URL}/games/`,
      headers: {
        'Accept': 'application/json',
        'Client-ID': client_ID,
        'Authorization': `Bearer ${token}`,
      },
      data: bodyData
    }).then(response => {
      console.log(response.data)
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (!token) {
      getToken()
    }
  }, [token]);

  return (
    <div>


      <div className='guessData'>
        current guessData: {guessData.title ? guessData.title : 'empty'}
        <div className={guesses[0] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[0]}</div>
        <div className={guesses[1] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[1]}</div>
        <div className={guesses[2] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[2]}</div>
        <div className={guesses[3] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[3]}</div>
        <div className={guesses[4] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[4]}</div>
        <div className={guesses[5] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[5]}</div>
      </div>
    
      <div className='guessSubmission' style={{marginTop: '2em'}}>
       GuessInput: {guess}
       <form autoComplete='off' noValidate className='guessForm' onSubmit={handleGuessSubmit}>
         <TextField placeholder='Guess a random game!' className='guessInput' onChange={(e) => setGuess(e.target.value)} value={guess}/>
         <Button variant='contained' style={{marginTop: '20px'}} type="submit">
           Submit Guess
         </Button>
       </form>
     </div>
    </div>
  )
};

export default GameContainer;

// sample guess data saved to localStorage
// {"2022-02-17":[
//   {"name":"NEW ZEALAND","distance":0,"direction":"N"}
// ],
// "2022-02-19":[
//   {"name":"TURKEY","distance":5850222,"direction":"S"},
//   {"name":"SOUTH AFRICA","distance":2004357,"direction":"NNE"},
//   {"name":"MOZAMBIQUE","distance":1026924,"direction":"NW"},
//   {"name":"ZAMBIA","distance":0,"direction":"N"}
// ],
// "2022-02-20":[
//   {"name":"MALAYSIA","distance":7734305,"direction":"WNW"},
//   {"name":"TURKMENISTAN","distance":1415632,"direction":"WNW"},
//   {"name":"GEORGIA","distance":0,"direction":"N"}
// ]}