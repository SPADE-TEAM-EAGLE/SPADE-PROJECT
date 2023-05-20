const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const { connect } = require('./config/connection');
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.use('/api/spade', userRoutes);
connect()
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
