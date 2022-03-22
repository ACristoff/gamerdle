import React from 'react'
import { Button, Typography } from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom'
import useStyles  from './styles';

const Navbar = () => {
  const classes = useStyles();


  return (
    <div className={classes.appBar}>
      <div className={classes.navigation}>
        <Button variant='contained' href='/games' size='small' className={classes.navLinkButton}>
          Games
        </Button>
        <Button variant='contained' href='/movies' className={classes.navLinkButton}>
          Movies
        </Button>
        <Button variant='contained' href='/anime' className={classes.navLinkButton}>
          Anime
        </Button>
        <Button variant='contained' href='/manga' className={classes.navLinkButton}>
          Manga
        </Button>
        <Button variant='contained' href='/books' className={classes.navLinkButton}>
          Books
        </Button>
      </div>
    </div>
  )
}

export default Navbar