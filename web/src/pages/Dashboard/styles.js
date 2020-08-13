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
  },
  container: {
    width: `calc(100% - ${theme.spacing(3)}px)`,
    height: 180,
  },
  chart: {
    padding: theme.spacing(2, 3),
    display: 'flex',
    flexDirection: 'column',
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
