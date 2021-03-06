'use strict'
module.exports = function (sequelize, DataTypes) {

    var crypto = require('crypto');

    var Usuario = sequelize.define('Usuario',
        {

            Id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Nome: {
                type: DataTypes.STRING(100),
                allowNull: false,
                validate: {
                    is: { args: /^[a-zA-Zà-ú ']*$/, msg: 'O nome do usuário não pode conter caracteres especiais' }
                },
            },
            Login: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: { msg: 'Já existe um usuário com este login' },
                validate: { is: { args: /^[a-zA-Z0-9_-]{3,15}$/, msg: `O login deve conter de 3 a 15 caracteres e somente letras, números e os caracteres '_' e '-' ` } }
            },
            Email: {
                type: DataTypes.STRING(70),
                allowNull: false,
                unique: { msg: 'Já existe uma conta de usuário com este email' },
                validate: {
                    isEmail: { msg: 'O endereço de email está no formato inválido.' }
                }
            },
            Telefone: {
                type: DataTypes.STRING(15),
                allowNull: false,
                unique: false
            },
            Salt: {
                type: DataTypes.BLOB,
                allowNull: true,
                unique: false
            },
            Senha: {
                type: DataTypes.STRING(250),
                allowNull: false,
                unique: false,
                validate: {
                    is: { args: /[A-Z.]/, msg: 'A senha deve conter pelo menos uma letra maiúscula' }
                },
            },
            UrlFoto: {
                type: DataTypes.STRING(120),
                allowNull: true,
                unique: false
            },
            Admin: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            Ativo: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            TokenSenha:{
                type: DataTypes.STRING(150),
                allowNull: true,
                defaultValue: null
            },
            TokenSenhaExp: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null
            },
            createdBy: {
                type: DataTypes.STRING(70),
                unique: false,
                allowNull: true
            },
            updatedBy: {
                type: DataTypes.STRING(70),
                unique: false,
                allowNull: true
            }

        },
        {
            validate: {
                TamanhoSenha: function (t, i) {
                    let minLength = 6;
                    if (this.Senha.length < minLength)
                        throw new Error(`A senha deve ter possuir ${minLength} caracteres ou mais`);
                }
            },
            freezeTableName: true,
            tableName: 'usuario',
            classMethods: {
                associate: function (models) {

                    Usuario.hasMany(models.Noticia, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario_Noticia',
                    });

                    Usuario.hasMany(models.Comentario, {
                        foreignKey: 'UsuarioId',
                        contraints: true,
                        as: 'Usuario_Comentarios'
                    });

                    Usuario.belongsToMany(models.Grupo, {
                        through: {
                            model: models.IntegranteGrupo,
                            unique: true
                        },
                        foreignKey: 'UsuarioId',
                        contraints: true
                    });

                    Usuario.belongsToMany(models.Grupo, {
                        through: {
                            model: models.SolicitacaoGrupoPendente,
                            unique: true
                        },
                        foreignKey: 'UsuarioId',
                        contraints: true
                    });

                },
            },

            instanceMethods: {
                hashPassword: function (password) {
                    return crypto.pbkdf2Sync(password, this.Salt, 10000, 64).toString('base64');
                }
            },
        });

    Usuario.hook('beforeCreate', function (user, options) {
        if (user.Senha) {
            user.Salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
            user.Senha = user.hashPassword(user.Senha);
        }
    });

    Usuario.hook('beforeUpdate', function (user, options) {

        if (user.Senha !== user._previousDataValues.Senha) {
            user.Salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
            user.Senha = user.hashPassword(user.Senha);
        }
    });

    return Usuario;

};