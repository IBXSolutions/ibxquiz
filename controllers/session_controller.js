var models = require('../models/models.js');
var constantes = models.Constantes;

//MW de autorización para acciones restringidas
exports.loginRequired = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// GET /login --> form de login
exports.new = function(req, res) {
    var errors = req.session.errors || null;
    req.session.errors = null;

    res.render('sessions/new', {
        title: constantes.TITULO,
        errors: errors
    });
};

// POST /login --> crear la sesion
exports.create = function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var lastUrl = req.session.redir.toString();
    console.log('Entrando en /login -> session.redir = ' + lastUrl);
    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {
        if (error) {
            req.session.errors = [{
                'message': 'No es posible iniciar sesión -&gt; ' + error
            }];
            console.log("/login -> Error autenticando: redirigiendo a /login, pero redir=" + lastUrl);
            res.redirect('/login');
            return;
        }

        // Creamos req.session.user y guardamos id y username
        // La sesión se define por la existencia de req.session.user
        req.session.user = {
            id: user.id,
            username: user.username
        };
        req.session.lastClick = new Date().getTime();
        req.session.autoLogout = false; //para mostrar mensaje alert desconexion +2 min.

        // Redireccionamos al path anterior
        console.log("/login -> redirigiendo a " + lastUrl);
        res.redirect(lastUrl);
    });
};

// GET /logout --> Destruimos session (deberia ser DELETE)
exports.destroy = function(req, res) {
    var lastUrl = req.session.redir.toString();
    console.log('Entrando en /logout -> session.redir = ' + lastUrl);
    delete req.session.user;
    //req.session.destroy();

    if (req.session.autoLogout) { //si el valor paso a true en app.js
        //redireccionamos y mostramos mensaje de alert desconexion +2 min.
        req.session.errors = [{
            'message': 'Sesión caducada por inactividad'
        }];
        req.session.autoLogout = false;
        console.log("/logout -> autoLogout: redirigiendo a /login, pero redir=" + lastUrl);
        res.redirect("/login");
    } else {
        // Redireccionamos al path anterior
        console.log("/logout -> redirigiendo a " + lastUrl);
        res.redirect(lastUrl);
    }
};
