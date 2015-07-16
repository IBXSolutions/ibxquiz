var models = require('../models/models.js');

//GET /quizes
exports.index = function(req, res) {
    models.Quiz.findAll().then(function(quizes) {
        res.render('quizes/index', {
            title: vTitulo,
            quizes: quizes
        });
    });
};



//GET /quizes/show
exports.show = function(req, res) {
    models.Quiz.find(req.params.quizId).then(function(quiz) {
        res.render('quizes/show', {
            title: vTitulo,
            quiz: quiz
        });
    });
};

//GET /quizes/answer
exports.answer = function(req, res) {
    var vResultado;
    models.Quiz.find(req.params.quizId).then(function(quiz) {
        if (req.query.respuesta.toUpperCase() === quiz.respuesta.toUpperCase()) {
            vResultado = 'Correct';
        } else {
            vResultado = 'Wrong';
        }

        res.render('quizes/answer', {
            title: vTitulo,
            resultado: vResultado,
            respuesta: req.query.respuesta,
            quiz: quiz
        })
    })
};
