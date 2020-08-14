import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  paper: {
    height: 'calc(100vh - 112px)',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    padding: theme.spacing(2, 3),
  },
  container: {
    padding: theme.spacing(1, 2),
  },
  chart: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2, 3),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
}));

export default style;
