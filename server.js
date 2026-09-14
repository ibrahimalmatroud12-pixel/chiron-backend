const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chiron backend draait correct');
});

app.post('/chiron/webhook', (req, res) => {
  console.log(req.body);
  res.status(200).json({ status: 'ok' });
});

app.post('/chiron/request', (req, res) => {
  res.status(200).json({ message: 'Request placeholder' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
