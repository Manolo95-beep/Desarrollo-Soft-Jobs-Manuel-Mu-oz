const jwt = require('jsonwebtoken');


const reportarConsultas = (req, res, next) => {
    const parametros = req.params;
    const querys = req.query;
    const url = req.url;
    const metodo = req.method;

    console.log(
        `Hoy ${new Date()} se ha recibido una consulta en la ruta ${url} con el método ${metodo}`,
        { parametros, querys }
    );
    next(); 
};

const verificarCredenciales = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Faltan credenciales (email o password)" });
    }
    next(); 
};

const validarToken = (req, res, next) => {
    try {
        const Authorization = req.header("Authorization");
        if (!Authorization) {
            return res.status(401).json({ message: "No se proporcionó un token" });
        }

        const token = Authorization.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "Formato de token inválido" });
        }

        jwt.verify(token, "1116");
        next(); 
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};

module.exports = {
    reportarConsultas,
    verificarCredenciales,
    validarToken
};
