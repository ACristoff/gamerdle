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

//get data errors out when there is no age_rating category

//Set up error handling for when no game comes up from the search
  //Quick and dirty console.warn DONE
  //Warn the user on the front-end when search comes up empty

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
  //Show answer upon failure DONE
  //Prevent new submissions once fail state has been reached
//Success state

//___

//future stuff: connecting to different API's for movies, books, tv shows, anime

const GameContainer = () => {
  const client_ID = process.env.REACT_APP_CLIENT_ID;
  const client_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const CORS_ANYWHERE_URL = 'https://acristoff-cors-anywhere.herokuapp.com'
  const API_URL = 'https://api.igdb.com/v4'
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
    const bodyData = `search "${guessedGame}"; fields *, age_ratings.*, game_modes.*, involved_companies.*, involved_companies.company.*, genres.*, player_perspectives.*, platforms.*, cover.*, artworks.*; where version_parent = null; limit 1;`
    
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
      console.log(response.data)
      //basic error handling if no game comes up
      if (response.data[0] === undefined) {
        console.warn('no game found')
        setGuess('');
        return
      }
      const releaseDateOfGame = Number(new Date(response.data[0].first_release_date * 1000).toLocaleDateString("en-us").slice(-4))
      //check to see if ratingOfGame remains accurate through debugging, otherwise make an algorithm to only select the one that has category = 0 (esrb category) DONE
      let ratingOfGame = null;
      for (const rating of response.data[0]?.age_ratings) {
        if (rating.category === 1) {
          ratingOfGame = parseRating(rating.rating)
        }
      }

      // const genreIds = response.data[0].genres.map((genre) => genre.id)
      // const genres = response.data[0].genres.map((genre) => genre.name)

      const newGuessData = gameData.guessData[day]
      newGuessData.push(({
        guessName: response.data[0].name, 
        raw: response.data[0],
        releaseDate: releaseDateOfGame,
        rating: ratingOfGame,
        ratingEnum: response.data[0].age_ratings[0].rating,
        genres: response.data[0].genres
        // genreIds: genreIds,
        // genres: genres
      }))
      setGameData({...gameData, guessData: {[day]: newGuessData}}, writeResultsData(gameData.guessData[day][gameData.guessData[day].length - 1], gameData.answerData))
      setGuess('');
    })
    .catch (error => {
      console.log(error)
    });
  }

  const getAnswerData = async () => {
    const bodyData = `search "dark souls"; fields *, age_ratings.*, game_modes.*, involved_companies.*, involved_companies.company.*, genres.*, player_perspectives.*, platforms.*, cover.*, artworks.*; where version_parent = null; limit 1;`
    // Example query for /games/ endpoint
    // `search "nier"; fields *; limit 10;`
    // where version_parent = null
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

      const releaseDateOfGame = Number(new Date(response.data[0].first_release_date * 1000).toLocaleDateString("en-us").slice(-4))
      //check to see if ratingOfGame remains accurate through debugging, otherwise make an algorithm to only select the one that has category = 0 (esrb category)
      const ratingOfGame = parseRating(response.data[0].age_ratings[0].rating)
      // const genreIds = response.data[0].genres.map((genre) => genre.id)
      // const genres = response.data[0].genres.map((genre) => genre.name)

      setGameData({
        ...gameData,
        answerData: {
          raw: response.data[0],
          releaseDate: releaseDateOfGame,
          gameName: response.data[0].name,
          rating: ratingOfGame,
          ratingEnum: response.data[0].age_ratings[0].rating,
          genres: response.data[0].genres
          // genreIds: genreIds,
          // genres: genres
        }  
      })
    })
    .catch(error => {
      console.log(error)
    })
  }

  const writeResultsData = (guess, answer) => {
    //write a results object
    const result = {};
    //compare guess and answer

    //compare release date
    //there has to be a more elegant solution than this
    if (guess.releaseDate === answer.releaseDate) {
      result.year = `${guess.releaseDate}: ✅ Same year`
    } else if (guess.releaseDate > answer.releaseDate) {
      result.year = `${guess.releaseDate}: ❌ Too new`
    } else {
      result.year = `${guess.releaseDate}: ❌ Too old`
    };
    //compare ESRB rating
    if (guess.ratingEnum === answer.ratingEnum) {
      result.rating = `${guess.rating}: ✅ Same rating`
    } else if (guess.ratingEnum > answer.ratingEnum) {
      result.rating = `${guess.rating}: ❌ Too mature`
    } else {
      result.rating = `${guess.rating}: ❌ Not mature enough`
    };

    //returned undefined when searching minecraft
    const genreComparisons =  guess.genres.map((genre) => {
      if (answer.genres.find(answerId => answerId.id === genre.id)) {
        return genre.name
      } else {
        return 'bluhhhh' //this must be fixed in the future, map returns undefined for every element it maps over
      }
    });

    result.genres = genreComparisons;
    //push that results object to gameData through setGameData by correctly spreading the information
    console.log(result)
  }
  
  //deprecate this by making an atomic function capable of spitting out correctly formatted html
  const compareYear = (currentGuess, answer) => {
    // console.log(currentGuess, answer)
    if (currentGuess.releaseDate === answer.releaseDate) {
      return (
        <div>
          {currentGuess.releaseDate}: ✅ Same Year
        </div>
      )
    } else if (currentGuess.releaseDate > answer.releaseDate) {
      return (
        <div>
          {currentGuess.releaseDate}: ❌ Too new
        </div>
      )
    } else {
      return (
        <div>
          {currentGuess.releaseDate}: ❌ Too old
        </div>
      )
    }
  }

  const parseRating = (rating) => {
    let esrbRating = null;
    switch (rating) {
      case 6:
        esrbRating = 'RP'
        break;
      case 7:
        esrbRating = 'EC'
        break;
      case 8:
        esrbRating = 'E'
        break;
      case 9:
        esrbRating = 'E10'
        break;
      case 10:
        esrbRating = 'T'
        break;
      case 11:
        esrbRating = 'M'
        break;
      case 12:
        esrbRating = 'AO'
        break;
      default:
        console.warn('No rating found')
    }
    return esrbRating
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
      <div className='guessData'>
        {/* current guessData: {gameData.guessData[day][gameData.guessData[day].length - 1] ? gameData.guessData[day][gameData.guessData[day].length - 1].guessName : 'empty'} */}
        <div className={gameData.guessData[day][0] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][0]?.guessName} {gameData.guessData[day][0] ? compareYear(gameData.guessData[day][0], gameData.answerData) : null}</div>
        <div className={gameData.guessData[day][1] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][1]?.guessName} {gameData.guessData[day][1] ? compareYear(gameData.guessData[day][1], gameData.answerData) : null}</div>
        <div className={gameData.guessData[day][2] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][2]?.guessName}</div>
        <div className={gameData.guessData[day][3] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][3]?.guessName}</div>
        <div className={gameData.guessData[day][4] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][4]?.guessName}</div>
        <div className={gameData.guessData[day][5] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][5]?.guessName}</div>
        <div>{gameData.guessData[day][6] ? `The answer is: ${gameData.answerData.gameName}` : null}</div>
      </div>
    
      <div className='guessSubmission' style={{marginTop: '2em'}}>
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