const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const EmployeeModel = require('./models/Employee');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'secret';

mongoose.connect('mongodb://127.0.0.1:27017/employee', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post('/register', (req, res) => {
  EmployeeModel.create(req.body)
    .then((employee) => {
      const token = jwt.sign({ id: employee._id }, JWT_SECRET, {
        expiresIn: '9000h',
      });
      res.json({ employee, token });
    })
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
