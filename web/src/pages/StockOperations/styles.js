import { makeStyles } from '@material-ui/core/styles';

const style = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

export default style;
