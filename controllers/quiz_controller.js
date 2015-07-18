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

//GET /quizes && /quizes/:buscar
exports.index = function(req, res) {
    var sqlBuscar;
    var cadenaBusca = "";
    if (req.query.buscar != "" && req.query.buscar != undefined) {
        cadenaBusca = cadenaBusca + req.query.buscar;
        //escapa caracteres reservados de expresiones regulares
        cadenaBusca = cadenaBusca.replace(/([\$\(\)\*\+\.\[\]\?\\\/\^\{\}\|])/g, "\\$1");
        //Sustituye los espacios inermedios por %
        cadenaBusca = cadenaBusca.replace(/\s+/g, "%");
        //Añadimos los % en los extremos
        cadenaBusca = "%" + cadenaBusca + "%";
        // Ahora montamos los parametros de Sequelize
        sqlBuscar = {
            where: ["pregunta like ?", cadenaBusca],
            order: "pregunta"
        };
    } else {
        sqlBuscar = {
            where: ["1=1"],
            order: "pregunta"
        }
    }
    console.log(sqlBuscar);

    // Finalmente realizamos la busqueda en bbdd
    models.Quiz.findAll(sqlBuscar).then(
        function(quizes) {
            res.render('quizes/index', {
                title: vTitulo,
                quizes: quizes,
                errors: null
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
        quiz: req.quiz,
        errors: null
    });
};

//GET /quizes/answer
exports.answer = function(req, res) {
    var vResultado = 'Wrong';
    var laRespuesta = req.query.respuesta;
    //escapa caracteres reservados de expresiones regulares
    laRespuesta = laRespuesta.replace(/([\$\(\)\*\+\.\[\]\?\\\/\^\{\}\|])/g, "\\$1");
    models.Quiz.find(req.params.quizId).then(function(quiz) {
        if (laRespuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
            vResultado = 'Correct';
        }

        res.render('quizes/answer', {
            title: vTitulo,
            resultado: vResultado,
            respuesta: laRespuesta,
            quiz: req.quiz,
            errors: null
        })
    })
};

// GET /quizes/new
exports.new = function(req, res) {
    var quiz = models.Quiz.build({
        pregunta: "Tu pregunta",
        respuesta: "La respuesta"
    });
    res.render('quizes/new', {
        title: vTitulo,
        quiz: quiz,
        errors: null
    });
}

// POST /quizes/create
exports.create = function(req, res, err) {
    req.quiz = models.Quiz.build(req.body.quiz);

    quiz.save({
        fields: ["pregunta", "respuesta"]
    }).then(function() {
        //Y redireccionamos a la lista de preguntas
        res.redirect('/quizes');
    }).catch(function(err) {
        console.log("Errores detectados\n" + objToString(err));
        res.render('quizes/new', {
            title: vTitulo,
            errors: err,
            quiz: quiz
        });
    });
};

// GET quizes/:quizId/edit
exports.edit = function(req, res) {
    var quiz = req.quiz; //Ya cargado en el Autoload
    res.render('quizes/edit', {
        title: vTitulo,
        quiz: quiz,
        errors: null
    });
};

// PUT /quizes/:quizId
exports.update = function(req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;

    req.quiz
        .save({
            fields: ["pregunta", "respuesta"]
        }).then(function() {
            //Y redireccionamos a la lista de preguntas
            res.redirect('/quizes');
        }).catch(function(err) {
            console.log("Errores detectados al actualizar\n" + objToString(err));
            res.render('quizes/edit', {
                title: vTitulo,
                errors: err,
                quiz: quiz
            });
        });
}

// Otras funciones utiles
function objToString(obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}
