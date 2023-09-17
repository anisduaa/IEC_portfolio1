const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const employee = new EmployeeModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedEmployee = await employee.save();
    const token = jwt.sign({ id: savedEmployee._id }, JWT_SECRET, {
      expiresIn: '9000h',
    });
    res.json({ employee: savedEmployee, token });
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await EmployeeModel.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: employee._id }, JWT_SECRET, {
      expiresIn: '9000h',
    });

    res.json({ employee, token });
  } catch (error) {
    res.json({ message: error.message });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.employeeId = decoded.id;
    next();
  });
}

app.post('/logout', verifyToken, async (req, res) => {
  try {
    // If you want to implement a token-based logout
    // you can remove the token from the employee's tokens array
    // EmployeeModel.updateOne({ _id: req.employeeId }, { $pull: { tokens: req.headers['authorization'] } });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
