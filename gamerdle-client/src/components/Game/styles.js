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
    transform: 'translateY(-75%)'
  },
  guessCard: {
    padding: '0.5em'
  },
  submissionContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
    // width:'100%'
    // alignContent: 'center'
  },
  guessCarouselContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    'overflow-x': 'auto',
    overflow: 'hidden',
    maxWidth: '100vw'
    // 'scrollbar-width': 'none'
    // '::-webkit-scrollbar': '{display: none}'
  },
  gameContainer: {
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