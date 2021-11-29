import './setup.js';
import app from './app.js';

process.on('unhandledRejection', (reason, promise) => {
  const message = {
    type: 'Unhandled Rejection',
    reason,
    promise,
  };
  console.error('unhandledRejection', message);
});
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', JSON.stringify(err));
});

app.listen(process.env.PORT, () => {
// eslint-disable-next-line no-console
  console.log(`Server running on port ${process.env.PORT}`);
});
