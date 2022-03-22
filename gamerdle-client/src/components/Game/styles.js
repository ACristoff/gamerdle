import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  hint: {
    filter: 'blur(20px)'
  },
  resultsBinaries: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
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