const req = require("express/lib/request");
const { is } = require("express/lib/request");
const res = require("express/lib/response");

const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'No está autorizado.');
        res.redirect('/users/signin');
    }
};

module.exports = helpers;