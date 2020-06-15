import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#795548',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f6b23d',
      contrastText: '#fff',
    },
  },
});

export default theme;
