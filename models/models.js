var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name     = (url[6] || null);
var user        = (url[2] || null);
var pwd         = (url[3] || null);
var protocol    = (url[1] || null);
var dialect     = (url[1] || null);
var port        = (url[5] || null);
var host        = (url[4] || null);
var storage     = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, {
    dialect:    dialect,
    protocol:   protocol,
    port:       port,
    host:       host,
    storage:    storage, //solo SQLite (.env)
    omitNull:   true //solo Postgres
});

//Importamos la definiciñon de la tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);
//Y la exportamos
exports.Quiz = Quiz;

//sequelize.sync() crea e inicializa la tabla de preguntas
sequelize.sync().then(function() {
    //then(...) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function(count) {
        if (count === 0) {
            //La tabla solo se inicializa si esta vacia
            Quiz.create({
                    pregunta: 'Capital de Italia',
                    respuesta: 'ROMA'
                })
                .then(function() {
                    console.log('Base de datos inicializada')
                });
        };
    });
});
