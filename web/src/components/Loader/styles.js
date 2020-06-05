import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  item: {
    alignSelf: 'center',
  },
}));

export default style;
