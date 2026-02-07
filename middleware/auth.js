// Middleware สำหรับตรวจสอบว่าผู้ใช้ได้ login หรือยัง
function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

//Middleware สำหรับตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }
  next();
}

module.exports = {
  requireAuth,
  requireAdmin
};
