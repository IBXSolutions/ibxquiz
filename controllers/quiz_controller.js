var models = require('../models/models.js');

//GET /quizes/question
exports.question = function(req, res) {
    models.Quiz.findAll().then(function(quiz) {
        res.render('quizes/question', {
            title: vTitulo,
            pregunta: quiz[0].pregunta
        });
    });
};

//GET /quizes/answer
exports.answer = function(req, res) {
    var vResultado;
    models.Quiz.findAll().then(function(quiz) {
        if (req.query.respuesta.toUpperCase() === quiz[0].respuesta.toUpperCase()) {
            vResultado = 'Correct';
        } else {
            vResultado = 'Wrong';
        }

        res.render('quizes/answer', {
            title: vTitulo,
            resultado: vResultado,
            respuesta: req.query.respuesta
        })
    })
};
