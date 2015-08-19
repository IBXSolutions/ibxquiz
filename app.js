var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

//Importamos nuestro router
var routes = require('./routes/index');
// Importamos las constantes
var models = require('./models/models');
var constantes = models.Constantes;
var criptoSeed = 'unasemillaparaencriptar';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser(criptoSeed));

// Instalamos express-session con parametros de inicialización
app.use(session({
    secret: criptoSeed,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {
    var sess = req.session;

    // console.log("******El url que tenemos en app.js es: " + req.url.toString());
    // if (sess.redir !== undefined) {
    //     console.log("******El sess.redir que tenemos en app.js antes de actualizarlo es: " + sess.redir.toString());
    // }

    // guardar path en session.redir para despues de login/logout
    if (!req.path.match(/\/login|\/logout/)) {
        sess.redir = req.url.replace("favico.ico","");
    }

    // Desconectar auto-logout de sesion por mas de dos minutos
    if (sess.lastClick) {
        var lastClick = new Date().getTime();
        var intervalo = lastClick - sess.lastClick;
        console.log("intervalo: "+sess.lastClick);
        if (intervalo > (5 * 60 * 1000)) {
            delete sess.lastClick;
            sess.autoLogout = true;
            res.redirect("/logout");
        } else {
            sess.autoLogout = false;
            sess.lastClick = lastClick;
        }
    }
    //Hacer visible req.session en las vistas
    res.locals.session = sess;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            title: constantes.TITULO,
            message: err.message,
            error: err,
            errors: null
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: constantes.TITULO,
        message: err.message,
        error: {},
        errors: null
    });
});


module.exports = app;
