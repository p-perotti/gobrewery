import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
  },
  card: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
    height: 180,
  },
  report: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
    height: 240,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  item: {
    alignSelf: 'center',
  },
  label: {
    textAnchor: 'middle',
    fill: theme.palette.text.primary,
  },
}));

export default style;
