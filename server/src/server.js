import app from './app';

const port = process.env.APP_PORT;

app.listen(port, () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`API listening at port ${port}`);
  }
});

