const authCheck = (req, res, next) => {
  if (req.session.isAuthenticated) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({
      error: "Unauthorized",
    });
  }
};

module.exports = authCheck;
