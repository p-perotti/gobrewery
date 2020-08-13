import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  positive: {
    color: theme.palette.success.main,
  },
  negative: {
    color: theme.palette.error.main,
  },
  date: {
    flex: 1,
  },
}));

export default style;
