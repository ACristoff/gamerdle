import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { TextField, Button } from '@material-ui/core';

//OPTIONAL: This can just be set up manually so that each day just has a predetermined manually selected game to select.
//set up an algorithm for designating the day's puzzle using local time date
//only {games} in the top 300

//Set up a manual library of answers for people to play for

//Spread the information correctly into answerData and pull from it DONE
//Spread the information correctly only into GuessData and deprecate guesses DONE
//Consider unifying the state data for all the game data into one DONE

//Set up error handling for when no game comes up from the search

//Edge case: Doom produces a rerelease of doom rather than the original copy of doom 1993
//Possible solution: Pull the top 5 results from the /games endpoint and sort by rating then write the top one to guessData
  //Possible problem: what if that messes with another answer/guess combination? Must test further
//

//set up proper error reporting through console.error console.alert and time the amount of time it takes to make requests using console.time

//comparison logic for correct information relating to the answer from the guess data, this requires proper spreading from above tasks
//eg release date year, ESRB rating, developer, game platform

//rendering for guess data DONE

//Save guess data to local storage
  //pull guess data from local storage
//

//share results as a series of emojis and a link to the website

//Fail state
  //Show answer upon failure
//Success state

//___

//future stuff: connecting to different API's for movies, books, tv shows, anime

const GameContainer = () => {
  const client_ID = process.env.REACT_APP_CLIENT_ID;
  const client_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const [token, setToken] = useState('');
  const [guess, setGuess] = useState('');

  const day = new Date().toISOString().slice(0, 10);
  const [gameData, setGameData] = useState({
    guessData: {[day]: []},
    answerData: {},
    resultsData: {[day]: []}
  })
  //sample resultsData
  //{"2022-03-15":[
  //   {"name":"Dark Souls", raw: {...},"year":"Correct"}
  // ]}

  //sample guessData
  //{"2022-03-15":[
  //   {"name":"Dark Souls", raw: {...},"year":"Correct"}
  // ]}

  //sample answerData
  //{}

  

  const CORS_ANYWHERE_URL = 'https://acristoff-cors-anywhere.herokuapp.com'
  const API_URL = 'https://api.igdb.com/v4'

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    getGuessData(guess);
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
    // below commented code is for using /search/ instead of /games/ which seems to be less accurate (?)
    // const bodyData = `search "${guessedGame}"; fields alternative_name,character,checksum,collection,company,description,game,name,platform,published_at,test_dummy,theme;`
    const bodyData = `search "${guessedGame}"; fields *; limit 1;`
    
    axios({
      method: 'POST',
      // url: `${CORS_ANYWHERE_URL}/${API_URL}/search/`,
      url: `${CORS_ANYWHERE_URL}/${API_URL}/games/`,
      headers: {
        'Accept': 'application/json',
        'Client-ID': client_ID,
        'Authorization': `Bearer ${token}`,
      },
      data: bodyData
    }).then(response => {
      // console.log(response.data)
      const releaseDateOfGame = Number(new Date(response.data[0].first_release_date * 1000).toLocaleString("en-US").slice(5,9))
      const newGuessData = gameData.guessData[day]
      newGuessData.push(({
        guessName: response.data[0].name, 
        raw: response.data[0],
        releaseDate: releaseDateOfGame
      }))
      setGameData({...gameData, guessData: {[day]: newGuessData}})
      setGuess('');
    })
    .catch (error => {
      console.log(error)
    });
  }

  const getAnswerData = async () => {
    const bodyData = `search "dark souls"; fields *; limit 1;`
    // Example query for /games/ endpoint
    // `search "nier"; fields *; limit 10;`
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
      // console.log(response.data)
      const releaseDateOfGame = Number(new Date(response.data[0].first_release_date * 1000).toLocaleString("en-US").slice(5,9))
      setGameData({
        ...gameData,
        answerData: {
          raw: response.data[0],
          releaseDate: releaseDateOfGame,
          gameName: response.data[0].name
        }  
      })
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (!token) {
      getToken()
    } else {
      getAnswerData()
    };
  }, [token]);

  useEffect(() => {
    console.log(gameData)
  }, [gameData])

  return (
    <div>
      <div className='answerData'>
        Answer: {gameData.answerData.gameName ? gameData.answerData.gameName : 'null'} <br></br>
        Release Date: {gameData.answerData.releaseDate}
      </div>
      <div className='guessData'>
        current guessData: {gameData.guessData[day][gameData.guessData[day].length - 1] ? gameData.guessData[day][gameData.guessData[day].length - 1].guessName : 'empty'}
        {/* <div className={guesses[1] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[1]}</div>
        <div className={guesses[2] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[2]}</div>
        <div className={guesses[3] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[3]}</div>
        <div className={guesses[4] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[4]}</div>
        <div className={guesses[5] ? 'GuessAnalysis' : 'BlankGuess'}>{guesses[5]}</div> */}
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