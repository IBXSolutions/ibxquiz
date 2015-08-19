//Definicion del modelo de la tabla Quizzes
module.exports = function(sequelize, DataTypes) {
    var Quiz = sequelize.define(
        'Quiz', {
            pregunta: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: "--> Falta Pregunta"
                    }
                }
            },
            respuesta: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: "--> Falta Respuesta"
                    }
                }
            },
            tema: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: "--> Falta Temática"
                    }
                }
            }
        }, {
            classMethods: {
                associate: function(models) {
                    Quiz.hasMany(models.Comment);
                }
            }
        });
    return Quiz;
};
