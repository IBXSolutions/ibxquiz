// Definición del modelo de la tabla Comments con validación
module.exports = function(sequelize, DataTypes) {
    var Comment = sequelize.define(
        'Comment', {
            texto: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: {
                        msg: "--> Falta Comentario"
                    }
                }
            },
            publicado: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            classMethods: {
                // Relaccionamos con la tabla Quizzes
                associate: function(models) {
                    Comment.belongsTo(models.Quiz, {
                        onDelete: "CASCADE",
                        foreignKey: {
                            allowNull: false
                        }
                    });
                }
            }
        }
    );
    return Comment;
};
