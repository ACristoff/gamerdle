import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { TextField, Button } from '@material-ui/core';


//Edge case: Doom produces a rerelease of doom rather than the original copy of doom 1993
//Possible solution: Pull the top 5 results from the /games endpoint and sort by rating then write the top one to guessData
  //Possible problem: what if that messes with another answer/guess combination? Must test further
//

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
      //implement this into getAnswerData
      let ratingOfGame = null;
      let ratingEnum = null;
      if (response.data[0].age_ratings) {
        for (const rating of response.data[0]?.age_ratings) {
          if (rating.category === 1) {
            ratingOfGame = parseRating(rating.rating)
            ratingEnum = rating.rating
          }
        }
      }


      const newGuessData = gameData.guessData[day]
      newGuessData.push(({
        guessName: response.data[0].name, 
        raw: response.data[0],
        releaseDate: releaseDateOfGame,
        rating: ratingOfGame,
        ratingEnum: ratingEnum,
        genres: response.data[0].genres,
        platforms: response.data[0].platforms,
        playerPerspectives: response.data[0].player_perspectives,
        involvedCompanies: response.data[0].involved_companies
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

      let ratingOfGame = null;
      let ratingEnum = null;
      if (response.data[0].age_ratings) {
        for (const rating of response.data[0]?.age_ratings) {
          if (rating.category === 1) {
            ratingOfGame = parseRating(rating.rating)
            ratingEnum = rating.rating
          }
        }
      }

      setGameData({
        ...gameData,
        answerData: {
          raw: response.data[0],
          releaseDate: releaseDateOfGame,
          gameName: response.data[0].name,
          rating: ratingOfGame,
          ratingEnum: ratingEnum,
          genres: response.data[0].genres,
          platforms: response.data[0].platforms,
          playerPerspectives: response.data[0].player_perspectives,
          involvedCompanies: response.data[0].involved_companies
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
    if (guess.ratingEnum === null && answer.ratingEnum === null) {
      result.rating = `Unrated: ✅ Both games are unrated`
    } else if (guess.ratingEnum === null && answer.ratingEnum !== null) {
      result.rating = `Unrated: ❌ The target game is rated on the ESRB`
    } else if(guess.ratingEnum === answer.ratingEnum) {
      result.rating = `${guess.rating}: ✅ Same rating`
    } else if (guess.ratingEnum > answer.ratingEnum) {
      result.rating = `${guess.rating}: ❌ Too mature`
    } else {
      result.rating = `${guess.rating}: ❌ Not mature enough`
    };

    //compare genres
    //There has to be a better solution than this
    const genreMatches = []
    if (guess.genres) {
      for (const genre of guess.genres) {
        if (answer.genres.find(answerId => answerId.id === genre.id)) {
          genreMatches.push(genre.name)
        }
      }
    }

    //compare platforms
    const platformMatches = []
    if (guess.platforms) {
      for (const platform of guess.platforms) {
        if (answer.platforms.find(answerId => answerId.id === platform.id)) {
          platformMatches.push(platform.abbreviation)
        }
      }
    }

    //compare perspectives
    const perspectiveMatches = []
    if (guess.perspectives) {
      for (const perspective of guess.playerPerspectives) {
        if (answer.playerPerspectives.find(answerId => answerId.id === perspective.id)) {
          perspectiveMatches.push(perspective.name)
        }
      }
    }

    //compare companies
    const companyMatches = []
    for (const company of guess.involvedCompanies) {
      if (answer.involvedCompanies.find(answerId => answerId.company.id === company.company.id)) {
        companyMatches.push(company.company.name)
      }
    }

    //writes genre data
    genreMatches.length > 0 ? result.genres = genreMatches : result.genres = 'No genre matches';

    //writes platform data
    platformMatches.length > 0 ? result.platforms = platformMatches : result.platforms = 'No platform matches';

    //writes perspective data
    perspectiveMatches.length > 0 ? result.perspectives = perspectiveMatches : result.perspectives = 'No perspective matches';

    //write company data
    companyMatches.length > 0 ? result.companies = companyMatches : result.companies = 'No company matches';

    // console.log(guess.guessName === answer.gameName)

    guess.guessName === answer.gameName ? result.correct = true : result.correct = false;

    result.guess = guess.guessName
    
    //push that results object to gameData through setGameData by correctly spreading the information
    // console.log(result)
    const newResultsData = gameData.resultsData[day]
    newResultsData.push(result)
    setGameData({...gameData, resultsData: {[day]: newResultsData}})
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
    checkSuccess()
    console.log(gameData)
  }, [gameData])

  const checkSuccess = () => {
    //there must be a better way to check the last element of an array
    if (gameData.resultsData[day].length > 0) {
      console.log(gameData.resultsData[day][gameData.resultsData[day].length - 1].correct)
      return gameData.resultsData[day][gameData.resultsData[day].length - 1].correct
    }
    return false
  }

  return (
    <div>
      <div className='guessData'>
        {/* current guessData: {gameData.guessData[day][gameData.guessData[day].length - 1] ? gameData.guessData[day][gameData.guessData[day].length - 1].guessName : 'empty'} */}
        {/* <div className={gameData.guessData[day][0] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][0]?.guessName} {gameData.guessData[day][0] ? compareYear(gameData.guessData[day][0], gameData.answerData) : null}</div>
        <div className={gameData.guessData[day][1] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][1]?.guessName} {gameData.guessData[day][1] ? compareYear(gameData.guessData[day][1], gameData.answerData) : null}</div>
        <div className={gameData.guessData[day][2] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][2]?.guessName}</div>
        <div className={gameData.guessData[day][3] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][3]?.guessName}</div>
        <div className={gameData.guessData[day][4] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][4]?.guessName}</div>
        <div className={gameData.guessData[day][5] ? 'GuessAnalysis' : 'BlankGuess'}>{gameData.guessData[day][5]?.guessName}</div> */}
        <div>{checkSuccess() && (
          <>Success! The answer was {gameData.answerData.gameName} ({gameData.answerData.releaseDate})</>
        )}</div>
        <div>{gameData.guessData[day][5] && checkSuccess() === false  ? `The answer is: ${gameData.answerData.gameName}` : null}</div>
      </div>
      
      {}
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