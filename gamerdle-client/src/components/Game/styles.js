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
    zIndex: '1',
    //this makes the suggestions sit right on top of the form
    transform: 'translateY(-75%)'
  },
  guessCard: {
    'padding-top': '1em',
    maxWidth: '80vw',
    //need a more elegant solution for this
    minWidth: '330px',
    overflow: 'scroll',
    maxHeight: '60vh',
    marginRight: '1em',
    'scroll-snap-align': 'center'
  },
  guessDataContainer : {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignContent: 'center',
    alignItems: 'center'
  },
  submissionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // 'margin-bottom': 'calc(20px + env(keyboard-inset-height))'
    // width:'100%'
    // alignContent: 'center'
  },
  guessCarouselContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '80%',
    'overflow-x': 'auto',
    overflow: 'hidden',
    maxWidth: '100vw',
    'overscroll-behavior': 'contain',
    'scroll-snap-type': 'x mandatory'
  },
  gameContainer: {
    //resets the container so that it doesn't bleed on the sides of the mobile view
    padding: '0px'
  }
}));

// /* Hide scrollbar for Chrome, Safari and Opera */
// .scrolling-card-list-container::-webkit-scrollbar {
//   display: none; 
// }

// /* Hide scrollbar for IE, Edge and Firefox */
// .scrolling-card-list-container {
//   -ms-overflow-style: none;  /* IE and Edge */
//   scrollbar-width: none;  /* Firefox */
// }

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