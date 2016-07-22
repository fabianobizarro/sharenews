

module.exports = {
    
    secret: 'secret',
    unilesteId: '1',

    logging: false,

    sequelize: {
        "development": {
            "username": "root",
            "password": null,
            "database": "database_dev",
            "host": "127.0.0.1",
            "dialect": "mysql"
        },
        "test": {
            "username": "root",
            "password": null,
            "database": "database_test",
            "host": "127.0.0.1",
            "dialect": "mysql"
        },
        "production": {
            "username": "root",
            "password": null,
            "database": "database_production",
            "host": "127.0.0.1",
            "dialect": "mysql"
        }
    }



};