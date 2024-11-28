const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/schoolRoutes');
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', schoolRoutes);

// Add the /hello route
app.get('/hello', (req, res) => {
  res.send('Hello! This is the School Management API.');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
