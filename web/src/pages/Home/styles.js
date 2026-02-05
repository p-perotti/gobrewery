import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles(() => ({
  container: {
    paddingTop: 'calc(50vh - 90px)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    opacity: '75%',
  },
}));

export default style;
