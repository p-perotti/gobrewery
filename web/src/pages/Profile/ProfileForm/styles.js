import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2, 3),
  },
  container: {
    padding: theme.spacing(1, 2),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default style;
