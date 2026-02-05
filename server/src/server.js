import app from './app';

app.listen(process.env.APP_PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(`API listening at port ${process.env.APP_PORT}`);
  }
});
