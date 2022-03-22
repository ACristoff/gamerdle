import React from 'react'
import { Container, Typography } from '@material-ui/core'
import Navbar from './Navbar'
import useStyles  from './styles';


const Header = () => {
  const classes = useStyles();

  return (
    <Container className="header" maxWidth="md">
      <div className={classes.topNavigation}>
        <Typography>?</Typography>
        <Typography>NERDLE</Typography>
        <Typography>Highscore</Typography>
      </div>
      <Navbar />
    </Container>
  )
}

export default Header

