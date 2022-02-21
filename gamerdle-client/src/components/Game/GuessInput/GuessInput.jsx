import React, { useState } from 'react'
import { TextField } from '@material-ui/core'


const GuessInput = () => {
  const [guess, setGuess] = useState('')

  return (
    <div>
      GuessInput: {guess}<br></br> 
      <TextField placeholder='Guess a random game!' onChange={(e) => setGuess(e.target.value)}/>
    </div>
  )
}

export default GuessInput