import React, { useState } from 'react'

import { TextField, Button } from '@material-ui/core'


const GameContainer = () => {

  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [guessData, setGuessData] = useState({});

  const handleGuessSubmit = (e) => {
    // guesses.length === 6 ? return null : 

    e.preventDefault();
    setGuesses([...guesses, guess])
    setGuess('');
  }

  

  return (
    <div>


      <div className='guessData'>
        current guessData: {guessData.title ? guessData : 'empty'}
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