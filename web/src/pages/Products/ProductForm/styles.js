import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  title: {
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(2),
  },
  container: {
    padding: theme.spacing(1, 2),
  },
  tabs: {
    padding: 0,
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
