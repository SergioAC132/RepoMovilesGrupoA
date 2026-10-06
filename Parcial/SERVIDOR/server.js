require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 4000;

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error('ERROR: MONGO_URI no está definida en el archivo .env');
    process.exit(1);
}

const client = new MongoClient(uri);

let db;

app.use(cors());
app.use(express.json());

async function conectarMongoDB() {
    try {
        await client.connect();

        console.log('Conectado a MongoDB!');

        db = client.db('sample_mflix');

        console.log('Base de datos lista...');

    } catch (error) {
        console.error('ERROR en la conexión a MongoDB:');
        console.error(error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Servidor funcionando correctamente'
    });
});

app.post('/login', (req, res) => {

    const { username, password } = req.body;

    console.log('--- LOGIN ---');
    console.log('Usuario recibido:', username);
    console.log(
        'Contraseña recibida:',
        password ? 'SI' : 'NO'
    );

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            mensaje: 'Usuario y contraseña son requeridos.'
        });
    }

    if (
        username === process.env.APP_USERNAME &&
        password === process.env.APP_PASSWORD
    ) {

        console.log('LOGIN CORRECTO');

        return res.json({
            success: true,
            mensaje: 'Login correcto.'
        });
    }

    console.log('LOGIN INCORRECTO');

    return res.status(401).json({
        success: false,
        mensaje: 'Usuario o contraseña incorrectos.'
    });
});

app.get('/movies', async (req, res) => {

    try {

        if (!db) {
            return res.status(503).json({
                mensaje: 'La base de datos todavía no está disponible.'
            });
        }

        const movies = await db
            .collection('movies')
            .find(
                {},
                {
                    projection: {
                        poster: 1,
                        title: 1,
                        fullplot: 1,
                        plot: 1,
                        year: 1,
                        runtime: 1,
                        rated: 1,
                        genres: 1,
                        directors: 1,
                        cast: 1,
                        writers: 1,
                        languages: 1,
                        countries: 1,
                        imdb: 1,
                        awards: 1
                    }
                }
            )
            .limit(50)
            .toArray();

        res.json(movies);

    } catch (error) {

        console.error(
            'Error obteniendo películas:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al obtener los datos de la colección.'
        });
    }
});

app.listen(port, async () => {

    console.log(
        `Servidor ejecutándose en http://localhost:${port}`
    );

    await conectarMongoDB();

});
