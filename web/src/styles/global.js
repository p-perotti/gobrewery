import { withStyles } from '@material-ui/core/styles';

const GlobalStyle = withStyles({
  '@global': {
    '*': {
      margin: 0,
      padding: 0,
      outline: 0,
      boxSizing: 'border-box',
    },
    'html, body, #root': {
      height: '100%',
    },
  },
})(() => null);

export default GlobalStyle;
