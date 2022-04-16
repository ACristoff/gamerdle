import { Container, Typography, Link } from '@material-ui/core';
import React from 'react';
import useStyles  from './styles';

const Footer = () => {
  const classes = useStyles();

  return (
    <Container className={classes.footerContainer}>
      <Typography>
        Love this project? Buy me a <Link href='https://ko-fi.com/digifigurati'>coffee☕</Link>. 
      </Typography>
      <Typography>
        Got feedback? Follow me on <Link href="https://twitter.com/DiFigurati">twitter🐦</Link> and send me a message.
      </Typography>
      <Typography>
        Want to offer me a job? Contact me <i>NOW</i> or check out my <Link href="http://digifigurati.io/">portfolio🧙‍♂‍</Link>.
      </Typography>
    </Container>
  )
}

export default Footer