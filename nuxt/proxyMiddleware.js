import path from 'path';
import express from 'express';

const app = express();

app.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  return res.sendFile(path.join(__dirname, '/IFrameCommunicator.html'));
});


export default () => app;
