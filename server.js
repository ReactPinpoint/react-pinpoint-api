const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json({ extended: false }));

// Cookie parser
app.use(cookieParser());

// Cors
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://reactpp.com', 'https://reactpinpoint.com'],
    credentials: true,
  })
);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routing
const isAuthorized = require('./auth/auth');
const login = require('./auth/login');
const register = require('./auth/register');
const logout = require('./auth/logout');
const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const commitRouter = require('./routes/commit');
app.use('/api/user', isAuthorized, userRouter);
app.use('/api/project', isAuthorized, projectRouter);
app.use('/api/commit', commitRouter);

app.get('/api/auth', isAuthorized, (req, res) => {
  res.json(res.locals.user_id);
});

app.post('/api/login', login, (req, res) => {
  res.json(res.locals.loggedIn);
});

app.post('/api/register', register, (req, res) => {
  res.json(res.locals.newUser);
});

app.get('/api/logout', logout, (req, res) => {
  res.json(res.locals.loggedOut);
});

app.get('/', isAuthorized, (req, res) => {
  res.send('Welcome to reactpp API');
});

// Global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Error:', err);
  }
  return res.status(400).json(err);
});

// Run the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold);
});
