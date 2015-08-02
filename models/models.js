var path = require('path');
var fs = require("fs");

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, {
    dialect: dialect,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, //solo SQLite (.env)
    omitNull: true //solo Postgres
});

// Creamos un objeto maestro
var db = {};

// Importamos la definiciñon de la tabla Quiz
//var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
// Importamos la definicion de la tabla Comment
//var Comment = sequelize.import(path.join(__dirname, 'comments'))

//Comment.belongsTo(Quiz);
//Quiz.hasMany(Comment);

//Y la exportamos
//exports.Quiz = Quiz;
//exports.Comment = Comment;
fs.readdirSync(__dirname)
    .filter(function(file) {
        //console.log('Evaluando el archivo:' + file);
        return (file.indexOf(".") !== 0) && (file !== "models.js") && (file !== "constants.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        //console.log('\nEl modelo actual es: ');
        //console.log(model);
        db[model.name] = model;
        //console.log('\ndb contiene: ');
        //console.log(db);
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
        //console.log('\nModelo "associate". db contiene: ');
        //console.log(db);
    }
});

//sequelize.sync() crea e inicializa las tablas de la BBDD
sequelize.sync()
    //then(...) ejecuta un manejador una vez creada las tablas
    .then(function() {
        // Evaluamos los registros que hay en la tabla Quiz
        //console.log('Vamos a contar Quiz');
        db.Quiz.count()
            .then(function(count) {
                if (count === 0) {
                    //La tabla solo se inicializa si esta vacia
                    db.Quiz.create({
                            pregunta: 'Capital de Italia',
                            respuesta: 'Roma',
                            tema: 'Geografía'
                        })
                        .then(function() {
                            console.log('Primer registro creado')
                        });
                    db.Quiz.create({
                            pregunta: 'Capital de España',
                            respuesta: 'Madrid',
                            tema: 'Geografía'
                        })
                        .then(function() {
                            console.log('Base de datos inicializada')
                        });
                };
            });
    });

// Importamos el fichero de las constantes
var Constantes = require(path.join(__dirname, 'constants'));
db.Constantes = Constantes;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
