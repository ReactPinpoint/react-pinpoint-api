const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: false }));
app.use(cookieParser());

const isAuthorized = require('./auth/auth');
const login = require('./auth/login');
const register = require('./auth/register');
const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const commitRouter = require('./routes/commit');
app.use('/api/user', isAuthorized, userRouter);
app.use('/api/project', isAuthorized, projectRouter);
app.use('/api/commit', isAuthorized, commitRouter);

app.post('/api/login', login, (req, res) => {
  res.json(res.locals.loggedIn);
});

app.post('/api/register', register, (req, res) => {
  res.json(res.locals.newUser);
});

app.get('/', isAuthorized, (req, res) => {
  res.send('Welcome to reactpp API');
});

// global error handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(err);
    console.log('Error:', err);
  }
  return res.status(400).json(err);
});

// run the server
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
