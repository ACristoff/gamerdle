import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  hint: {
    filter: 'blur(20px)',
    maxWidth: '12rem',
    marginTop: '3vh'
  },
  resolved: {
    maxWidth: '12rem'
  },
  resultsBinaries: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  autoSuggestContainer: {
    position: 'absolute',
    // display: 'block',
    zIndex: '1',
    // top: '0px'
    transform: 'translateY(-100%)'
  },
  guessCard: {
    padding: '0.5em'
  }
}));

// .guessForm {
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// }

// .guessInput input{
//   color:aliceblue;
// }

// .autoSuggestContainer {
//   background-color: #282c34;
// }

// .guessSubmissions {
//   max-width: 50%;
// }

// .guessData {
//   color:aliceblue
// }

// #guessPaperContainer {
//   padding: 0.4em;
//   background-color: #282c34;
//   color: aliceblue;
// }

// #autoSuggestContainer {
//   background-color: #282c34;
//   color: aliceblue;
//   padding: 0.4em;
//   /* max-width:30vw; */
// }

// .hint {
//   filter: blur(20px);
//   /* backdrop-filter: blur(5px); */
//   width: 220px;
// }