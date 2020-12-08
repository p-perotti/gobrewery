import { makeStyles } from '@material-ui/core';

const style = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: theme.spacing(1),
  },
  grid: {
    width: '100%',
    maxHeight: 'calc(100vh - 220px)',
  },
  title: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  white: {
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default style;
