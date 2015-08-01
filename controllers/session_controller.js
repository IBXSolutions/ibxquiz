var models = require('../models/models.js');
var constantes = models.Constantes;

// GET /login --> form de login
exports.new = function(req, res) {
    var errors = req.session.errors || null;
    req.session.errors = {};

    res.render('sessions/new', {
        title: constantes.TITULO,
        errors: errors
    });
};

// POST /login --> crear la sesion
exports.create = function(req, res) {
    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {
        if (error) {
            req.session.errors = [{'message': 'Se ha producido un error: ' + error}];
            res.redirect('/login');
            return;
        };

        // Creamos req.session.user y guardamos id y username
        // La sesión se define por la existencia de req.session.user
        req.session.user = {
            id: user.id,
            username: user.username
        };

        // Redireccionamos al path anterior
        res.redirect(req.session.redir.toString());
    });
};

// GET /logout --> Destruimos session (deberia ser DELETE)
exports.destroy = function(req, res) {
    delete req.session.user;
    // Redireccionamos al path anterior
    res.redirect(req.session.redir.toString());
}
