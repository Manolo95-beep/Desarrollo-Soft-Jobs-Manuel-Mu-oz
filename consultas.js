const {Pool} = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Balto#4066',
    database: 'softjobs',
    port: 5432,
    allowExitOnIdle: true
});



const verUsuario = async (email) => {
    const consulta = 'SELECT * FROM usuarios WHERE email = $1';
    const valores = [email];
    const resultado = await pool.query(consulta, valores);
    return resultado.rows[0];
}

const crearUsuarios = async (email, password, rol,lenguage) => {
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const consulta = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *';
    const valores = [email, password, rol, lenguage]
    const resultado = await pool.query(consulta, valores);
    return resultado.rows;
}

const loginUsuario = async (email, password) => {
    const valores = [email]
    const consulta = 'SELECT * FROM usuarios WHERE email = $1';
    const {rows:[usuario]} = await pool.query(consulta, valores);
    const {password: passwordEncriptada} =usuario
    const passwordValida = bcrypt.compareSync(password, passwordEncriptada)

    if (!passwordValida) 
        throw {code:401, message: 'Email y constraseña incorrecta'}
}

module.exports = {
    crearUsuarios,
    loginUsuario,
    verUsuario
}
    