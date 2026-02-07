const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// ตั้งค่า View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(session({
  secret: 'politician-promise-tracker-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set to true if using https
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Static files (ถ้ามี)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('System error occurred');
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
  console.log('');
  console.log('Login accounts:');
  console.log('   Admin: username=admin, password=admin123');
  console.log('   Politicians: somchai/somying/prayuth/phiangdin/anucha, password=pass123');
});
