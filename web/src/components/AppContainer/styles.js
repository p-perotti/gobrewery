import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  main: {
    height: '100%',
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  content: {
    height: '100%',
  },
}));

export default style;
