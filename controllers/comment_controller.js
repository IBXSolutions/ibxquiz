// Importamos los modelos
var models = require('../models/models.js');
var constantes = models.Constantes;

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
        quizId: req.params.quizid
    });

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
