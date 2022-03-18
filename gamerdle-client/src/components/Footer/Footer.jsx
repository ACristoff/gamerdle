import { Container, Typography, Link } from '@material-ui/core'
import React from 'react'

const Footer = () => {
  return (
    <Container className='footer'>
      <Typography>
        Love this project? Follow me on <Link href="#">twitter</Link> or check out my <Link href="#">portfolio</Link>.
      </Typography>
      <Typography>
        Want to offer me a job? Contact me *NOW*.
      </Typography>
    </Container>
  )
}

export default Footer