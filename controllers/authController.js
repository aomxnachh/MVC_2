const User = require('../models/User');

class AuthController {
  //show login page
  showLoginPage(req, res) {
    res.render('login', { error: null });
  }

  //login
  async login(req, res) {
    const { username, password } = req.body;
    
    try {
      const user = await User.authenticate(username, password);
      
      if (user) {
        req.session.user = user;
        res.redirect('/promises');
      } else {
        res.render('login', { error: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.render('login', { error: 'Login error occurred' });
    }
  }

  //logout
  logout(req, res) {
    req.session.destroy();
    res.redirect('/');
  }
}

module.exports = new AuthController();
