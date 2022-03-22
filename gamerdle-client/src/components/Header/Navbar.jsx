import { AppBar, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import React from 'react'


const Navbar = () => {


  return (
    <AppBar>
      Dorkle
      <Link to={'/games'}>
      {/* style={{ textDecoration: 'none', color: 'unset' }} */}
        <Typography>Games</Typography>
      </Link>
      <Link to={'/movies'}>
        <Typography>Movies</Typography>
      </Link>
      <Link to={'/anime'}>
        <Typography>Anime</Typography>
      </Link>
      <Link to={'/manga'}>
        <Typography>Manga</Typography>
      </Link>
      <Link to={'/books'}>
        <Typography>Books</Typography>
      </Link>
    </AppBar>
  )
}

export default Navbar