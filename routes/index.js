var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: vTitulo });
});

router.get('/author', function(req,res) {
    res.render('author', {
        title: vTitulo,
        author: vAuthorName,
        nick: vAuthorNick,
        imagen: vAuthorImg
        });
})

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

module.exports = router;
