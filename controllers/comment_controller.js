// Importamos los modelos
var models = require('../models/models.js');
var constantes = models.Constantes;

// Autoload por :commentId
exports.load = function(req, res, next, commentId) {
    models.Comment.find({
        where: {
            id: Number(commentId)
        }
    }).then(function(comment) {
        if (comment) {
            req.comment = comment;
            next();
        } else {
            next(new Error('No existe commentId=' + commentId))
        }
    }).catch(function(error) {
        next(error);
    });
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
    res.render('comments/new.ejs', {
        title: constantes.TITULO,
        quizid: req.params.quizId,
        errors: null
    });
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
    var comment = models.Comment.build({
        texto: req.body.comment.texto,
        QuizId: req.params.quizId
    });
    console.log('Creando comentario: ');
    console.log(comment);
    comment.save().then(function() {
        res.redirect('/quizes/' + req.params.quizId);
    }).catch(function(error) {
        res.render(
            'comments/new.ejs', {
                title: constantes.TITULO,
                comment: comment,
                quizid: req.params.quizId,
                errors: error
            });
    });
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function (req, res) {
    req.comment.publicado = true;

    req.comment.save( {
        fields: ["publicado"]
    }).then( function() {
        res.redirect('/quizes/' + req.params.quizId);
    }).catch(function(error) {
        next(error);
    });
};

// Otras funciones utiles
function objToString(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
};
