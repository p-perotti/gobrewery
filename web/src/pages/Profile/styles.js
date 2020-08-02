import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
  },
  avatar: {
    height: 180,
    width: 180,
    fontSize: 90,
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  name: {
    paddingTop: theme.spacing(3),
  },
  email: {
    paddingBottom: theme.spacing(3),
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default style;
