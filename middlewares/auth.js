function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/user/login');
    }
}

module.exports = isAuthenticated;
