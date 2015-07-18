'use strict';

var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);

// Ruta home page.
router.get('/', quizController.home);
// Ruta About us
router.get('/author', quizController.author);
// Rutas de quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
router.delete('/quizes/:quizId(\\d+)', quizController.borrar);

module.exports = router;
