import React, { useState, useEffect } from 'react';
import axios from 'axios';

import gameLibrary from './gameLibrary';

import mRating from '../../images/ESRB_M_Rating.png'

import { TextField, Button, CircularProgress, Typography, Paper, Container, ClickAwayListener, Box} from '@material-ui/core';

//Make it so that the autosuggest when clicked, searches for the ID of the given title using a new function getGuessById(id)
//Make it so that suggestions are displayed as mui components

//future stuff: connecting to different API's for movies, books, tv shows, anime

const GameContainer = () => {
  const client_ID = process.env.REACT_APP_CLIENT_ID;
  const client_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const CORS_ANYWHERE_URL = 'https://acristoff-cors-anywhere.herokuapp.com'
  const API_URL = 'https://api.igdb.com/v4'
  const [token, setToken] = useState('');
  const [guess, setGuess] = useState('');
  const [autoSuggest, setAutoSuggest] = useState({
    suggestions: [],
    suggestId: ''
  });
  // const [gameId, setGameId] = useState('');
  const [open, setOpen] = useState(false)
  const loading = open && autoSuggest.suggestions.length === 0;

  //the library of answers
  const library = gameLibrary;

  const tzoffset = (new Date()).getTimezoneOffset() * 60000
  const day = new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
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
    getGuessDataByName(guess);
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

  const getGuessDataByName = async (guessedGame) => {
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
      // console.log(response.data)
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

  const getGuessDataById = async (id) => {
    // below commented code is for using /search/ instead of /games/ which seems to be less accurate (?)
    // const bodyData = `search "${guessedGame}"; fields alternative_name,character,checksum,collection,company,description,game,name,platform,published_at,test_dummy,theme;`
    const bodyData = `fields *, age_ratings.*, game_modes.*, involved_companies.*, involved_companies.company.*, genres.*, player_perspectives.*, platforms.*, cover.*, artworks.*; where id = ${id}; limit 1;`
    
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

  const getSuggestions = async (input) => {
    const bodyData = `search "${input}"; fields name, first_release_date; where version_parent = null; where category != 1; limit 5;`

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
      // const releaseDateOfGame = Number(new Date(response.data[0].first_release_date * 1000).toLocaleDateString("en-us").slice(-4))
      const suggestionArray = response.data.map((element) => {
        const interpretedElement = {
          name: element.name,
          id: element.id,
          releaseDate: Number(new Date(element.first_release_date * 1000).toLocaleDateString("en-us").slice(-4))
        }
        return interpretedElement
      });
      setAutoSuggest({...autoSuggest, suggestions: suggestionArray} /*, console.log(autoSuggest) */)
    })
    .catch (error => {
      console.log(error)
    })
  }

  const getAnswerData = async () => {
    const bodyData = `search "${library[day]}"; fields *, age_ratings.*, game_modes.*, involved_companies.*, involved_companies.company.*, genres.*, player_perspectives.*, platforms.*, cover.*, artworks.*; where version_parent = null; limit 1;`
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
      const companies = response.data[0].involved_companies.map((element) => {
        return element.company.name 
      })
      const platformArray = response.data[0].platforms.map((element) => {
        return element.abbreviation
      })

      const genreArray = response.data[0].genres.map((element) => {
        return element.name
      })

      setGameData({
        ...gameData,
        answerData: {
          raw: response.data[0],
          releaseDate: releaseDateOfGame,
          gameName: response.data[0].name,
          rating: ratingOfGame,
          ratingEnum: ratingEnum,
          genres: response.data[0].genres,
          genreArray: genreArray,
          platforms: response.data[0].platforms,
          platformArray: platformArray,
          playerPerspectives: response.data[0].player_perspectives,
          involvedCompanies: response.data[0].involved_companies,
          companies: companies
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
      result.ratingCorrect = true
    } else if (guess.ratingEnum === null && answer.ratingEnum !== null) {
      result.rating = `Unrated: ❌ The target game is rated on the ESRB`
    } else if(guess.ratingEnum === answer.ratingEnum) {
      result.rating = `${guess.rating}: ✅ Same rating`
      result.ratingCorrect = true
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
    if (guess.involvedCompanies) {
      for (const company of guess.involvedCompanies) {
        if (answer.involvedCompanies.find(answerId => answerId.company.id === company.company.id)) {
          companyMatches.push(company.company.name)
        }
      }
    }


    //writes genre data
    genreMatches.length > 0 ? result.genres = genreMatches : result.genres = ['No genre matches'];

    //writes platform data
    platformMatches.length > 0 ? result.platforms = platformMatches : result.platforms = ['No platform matches'];

    //writes perspective data
    perspectiveMatches.length > 0 ? result.perspectives = perspectiveMatches : result.perspectives = ['No perspective matches'];

    //write company data
    companyMatches.length > 0 ? result.companies = companyMatches : result.companies = ['No company matches'];

    // console.log(guess.guessName === answer.gameName)

    guess.guessName === answer.gameName ? result.correct = true : result.correct = false;

    result.guess = guess.guessName;
    
    //push that results object to gameData through setGameData by correctly spreading the information
    // console.log(result)
    const newResultsData = gameData.resultsData[day]
    newResultsData.push(result)
    setGameData({...gameData, resultsData: {[day]: newResultsData}})
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
      // console.log(day)
    };
  }, [token]);

  useEffect(() => {
    checkSuccess()
    console.log(gameData)
    localStorage.setItem('guesses', JSON.stringify(gameData.guessData))
  }, [gameData])

  useEffect(() => {

    if (guess.length !== 0) {
      // console.log(guess)
      setOpen(true)
      getSuggestions(guess)
    } else {
      setOpen(false)
    }
  }, [guess])

  const checkSuccess = () => {
    //there must be a better way to check the last element of an array
    if (gameData.resultsData[day].length > 0) {
      // console.log(gameData.resultsData[day][gameData.resultsData[day].length - 1].correct)
      return gameData.resultsData[day][gameData.resultsData[day].length - 1].correct
    }
    return false
  }

  const guessRender = (guessResult, i) => {
    const mapArray = (arr) => {
      // console.log(arr)
       return arr.map((element, index, array) => {
         if (index === array.length -1) {
           return `${element}`
         }
        return `${element}, `
      })
    }

    return (
      <Paper id='guessPaperContainer' key={i} elevation={6}>
        <Typography>
          {guessResult.correct ? `✅` : `❌`}  {guessResult.guess}
        </Typography>

        <Typography>
          {guessResult.rating}
        </Typography>

        <Typography>
          {guessResult.year}
        </Typography>
        <Typography>
          Platforms: {mapArray(guessResult.platforms)}
        </Typography>
        <Typography>
          Companies: {mapArray(guessResult.companies)}
        </Typography>
        {/* <Typography>
          Perspectives: {mapArray(guessResult.perspectives)}
        </Typography> */}
        <Typography>
          Genres: {mapArray(guessResult.genres)}
        </Typography>
    </Paper>
    )
  }

  const autoSuggestionRender = (suggestionArray) => {
    return (
      <Paper id='autoSuggestContainer' elevation={6}>
        {suggestionArray.map((element, index) => {
          return (
            <div key={index} className='autosuggestion'>
              <Button color='inherit' onClick={(e) => getGuessDataById(element.id)}>
                {element.name} ({element.releaseDate})
              </Button>
            </div>
          )
        })}
      </Paper>
    )
  }

  const handleClickAway = () => {
    setOpen(false)
  }

  const checkMatch = (guess, guessType, answerType) => {
    const guessArray = guess[guessType].sort()
    const answerArray = gameData.answerData[answerType].sort()
    // console.log(JSON.stringify(guessArray), JSON.stringify(answerArray))
    if (JSON.stringify(guess[guessType]) === JSON.stringify(gameData.answerData[answerType])) {
      return `🟩`
    } else if (guessArray[0] === answerArray[0]) {
      return `🟨`
    } else {
      return `⬛`
    }
  }

  const parseResults = (data) => {
    const parsed = []

    parsed.push(`Nerdle: Games: ${day}`)
    //turns out I didn't need the index after all but I learned a neat new trick about destructuring for of loops of arrays!
    for (const [index, guess] of data.entries()) {
      if (guess.correct) {
        parsed.push(`🟩🟩🟩🟩🟩: ✅`)
      } else {
        const guessResult = []

        //checks if the rating is correct
        if (guess.ratingCorrect) {
          guessResult.push(`🟩`)
        } else {
          guessResult.push(`⬛`)
        }

        //checks if the year is newer or older or matches
        // console.log(guess.year.slice(-3))
        if (guess.year.slice(-3) === `new`) {
          guessResult.push(`⏪`)
        } else if (guess.year.slice(-3) === `old`) {
          guessResult.push(`⏩`)
        } else {
          guessResult.push(`🟩`)
        }

        //checks for platforms
        guessResult.push(checkMatch(guess, `platforms`, `platformArray`))

        //checks for companies
        guessResult.push(checkMatch(guess, `companies`, `companies`))

        //checks for genres
        guessResult.push(checkMatch(guess, `genres`, `genreArray`))
        
        guessResult.push(`: ❌`)
        parsed.push(guessResult.join(``))
      }
    }

    parsed.push(`http://localhost:3000/`)
    // console.log(parsed.join("\n"))
    return parsed
  }

  return (
    <Container>
      <div className='guessData'>
        {/* {gameData.resultsData[day][0] && guessRender(gameData.resultsData[day][0])} */}
        {gameData.resultsData[day].map((result, index) => guessRender(result, index))}
        <div>{checkSuccess() && (
          <>Success! The answer was {gameData.answerData.gameName} ({gameData.answerData.releaseDate})</>
        )}</div>
        <div>{gameData.guessData[day][5] && checkSuccess() === false  ? `The answer is: ${gameData.answerData.gameName}` : null}</div>
      </div>
      {}
      {(!gameData.guessData[day][5] && checkSuccess() === false) && 
        <div className='guessSubmission' style={{marginTop: '2em'}}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
              <form autoComplete='off' noValidate className='guessForm' onSubmit={handleGuessSubmit}>
                {loading && <CircularProgress />}
                {open && autoSuggest.suggestions.length > 0 ? autoSuggestionRender(autoSuggest.suggestions) : null}
                <TextField placeholder='Guess a random game!' className='guessInput' onChange={(e) => setGuess(e.target.value, {/* setAutoSuggest({...autoSuggest, suggestId: ''}) */})} value={guess}/>
                <Button variant='contained' style={{marginTop: '20px'}} type="submit">
                  Submit Guess
                </Button>
              </form>
            </Box>
          </ClickAwayListener>
        </div>
      }
      {(gameData.guessData[day][5] || checkSuccess() === true) && 
        <div>
          {/* {parseResults(gameData.resultsData[day])} */}
          {/* onClick={() => {navigator.clipboard.writeText(this.state.textToCopy)}} */}
          <Button variant='contained' onClick={() => {navigator.clipboard.writeText(parseResults(gameData.resultsData[day]).join("\n"))}}>
          Share your results!
          </Button>
        </div>
      }
      {/* <img src={mRating} width='100px'/> */}
    </Container>
  )
};

export default GameContainer;