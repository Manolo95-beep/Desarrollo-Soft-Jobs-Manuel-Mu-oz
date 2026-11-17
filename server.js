const express = require('express');
const { crearUsuarios, loginUsuario,verUsuario } = require('./consultas');
const {validarToken, reportarConsultas,verificarCredenciales} = require('./middleware');

const jwt = require('jsonwebtoken');

const app = express();
const cors = require("cors");


app.use(express.json());
app.use(cors());
app.use(reportarConsultas);

app.get('/usuarios', validarToken, async (req, res) => {
    try {
        const Authorization = req.header("Authorization");
        const token = Authorization.split("Bearer ")[1];
        const {email} = jwt.decode(token);
        const usuario =await verUsuario(email);
        res.json([usuario]);
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Token inválido' });
    }
});


app.post('/usuarios', verificarCredenciales, async (req, res) => {
    try {
        const { email, password, rol, lenguage } = req.body;
        const nuevoUsuario = await crearUsuarios(email, password, rol, lenguage);
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        await loginUsuario(email, password);
        const token = jwt.sign({email}, "1116")
        res.json({token});
    } catch (error) {
        console.log (error)
        res.status(error.code || 500).json({ error: error.message || 'Error al iniciar sesión' });
    }
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
