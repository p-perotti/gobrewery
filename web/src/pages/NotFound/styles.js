import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    marginBottom: theme.spacing(1),
  },
}));

export default style;
