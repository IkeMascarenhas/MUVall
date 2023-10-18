module.exports = class UsuarioDAL {

    constructor(bd) {
        this.bd = bd;
    }

    findAll() {
        return new Promise((resolve, reject) => {
            this.bd.query("SELECT u.id_usuario, u.nome_usuario, " +
                "u.senha_usuario, u.email_usuario, u.dataNasc_usuario, u.tipo_usuario," +
                " u.status_usuarioFROM usuario u where u.status_usuario = 1 and " +
                " u.tipo_usuario = 1", function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    findUserEmail(camposForm) {
        return new Promise((resolve, reject) => {
            this.bd.query("SELECT * FROM usuario WHERE email_usuario = ?",
            [camposForm.email_usuario],
                function (error, elements) {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(elements);
                });
        });
    };

    findID(id) {
        return new Promise((resolve, reject) => {
            this.bd.query("SELECT * FROM usuario where id_usuario = ?", [id], function (error, elements) {
                    if (error) {
                        return reject(error);
                    }
                    
                    return resolve(elements);
                });
        });
    };

    create(camposJson) {
        return new Promise((resolve, reject) => {
            this.bd.query("insert into usuario set ?",
                camposJson,
                function (error, elements) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(elements);
                });
        });
    }
    update(camposJson) {
        return new Promise((resolve, reject) => {
            this.bd.query(
                "UPDATE usuario SET nome_usuario = ?, senha_usuario = ?,  " +
                " email_usuario = ?, dataNasc_usuario = ?, tipo_usuario = ?, status_usuario = ?, img_perfil = ? " +
                " WHERE id_usuario = ?",
                [camposJson.nome_usuario,  camposJson.senha_usuario,
                camposJson.email_usuario, camposJson.dataNasc_usuario, camposJson.tipo_usuario,
                camposJson.status_usuario, camposJson.img_perfil, camposJson.id
                ],
                function (error, results, fields) {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            this.bd.query("UPDATE usuario SET status_usuario = 0 WHERE id_usuario = ?", [id], function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }
}

