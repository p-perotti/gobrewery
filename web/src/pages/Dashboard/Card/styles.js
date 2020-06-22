import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
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
