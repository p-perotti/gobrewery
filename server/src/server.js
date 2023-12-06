import app from './app';

app.listen(process.env.APP_PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API listening at port ${process.env.APP_PORT}`);
  }
});
