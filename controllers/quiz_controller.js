
//GET /quizes/question
exports.question = function (req, res) {
    res.render('quizes/question', {
                             title: vTitulo
                            ,pregunta: 'Capital de Italia'
                            });
};

//GET /quizes/answer
exports.answer = function(req, res) {
    var vResultado;
    if (req.query.respuesta.toUpperCase() === 'ROMA') {
        vResultado = 'Correcto';
    } else {
        vResultado = 'Incorrecto';
    }

    res.render('quizes/answer', {
                title: vTitulo
               ,resultado: vResultado
               ,respuesta: req.query.respuesta
            });
};
