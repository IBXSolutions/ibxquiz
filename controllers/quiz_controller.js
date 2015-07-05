//GET /quizes/question
exports.question = function(req, res) {
    res.render('quizes/question', {
        title: vTitulo,
        pregunta: 'Capital of Italy'
    });
};

//GET /quizes/answer
exports.answer = function(req, res) {
    var vResultado;
    if (req.query.respuesta.toUpperCase() === 'ROMA' ||
        req.query.respuesta.toUpperCase() === 'ROME') {
        vResultado = 'Correct';
    } else {
        vResultado = 'Wrong';
    }

    res.render('quizes/answer', {
        title: vTitulo,
        resultado: vResultado,
        respuesta: req.query.respuesta
    });
};
