import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#282c34',
    maxWidth: '100vw'
  },
  navigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  topNavigation: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  navLinkButton: {
    margin: '2px',
    textDecoration: 'none'
  }
}));