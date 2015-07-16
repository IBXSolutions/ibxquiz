var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
    models.Quiz.find(quizId).then(
        function(quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe quizId=' + quizId));
            }
        }
    ).catch(function(error) {
        next(error);
    });
}

//GET /quizes
exports.index = function(req, res) {
    models.Quiz.findAll().then(
        function(quizes) {
            res.render('quizes/index', {
                title: vTitulo,
                quizes: quizes
            });
        }
    ).catch(function(error) {
        next(error);
    });
};



//GET /quizes/show
exports.show = function(req, res) {
    res.render('quizes/show', {
        title: vTitulo,
        quiz: req.quiz
    });
};

//GET /quizes/answer
exports.answer = function(req, res) {
    var vResultado = 'Wrong';
    models.Quiz.find(req.params.quizId).then(function(quiz) {
        if (req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
            vResultado = 'Correct';
        }

        res.render('quizes/answer', {
            title: vTitulo,
            resultado: vResultado,
            respuesta: req.query.respuesta,
            quiz: req.quiz
        })
    })
};
