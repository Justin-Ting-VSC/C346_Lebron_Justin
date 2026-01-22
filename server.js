const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

const app = express();
app.use(express.json());

app.listen(port, () => {
    console.log('Server running on port', port);
});

app.get('/alllebrons', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM defaultdb.lebrons');
        res.send(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error while getting lebrons' });
    }
});

// POST: Add a new lebron
app.post('/addlebron', async (req, res) => {
    const { lebron_name, lebron_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO defaultdb.lebrons (lebron_name, lebron_pic) VALUES (?, ?)',
            [lebron_name, lebron_pic]
        );
        await connection.end();
        res.status(201).json({ message: 'Lebron ' + lebron_name + ' added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add lebron' });
    }
});

// PUT: Update an existing lebron
app.put('/updatelebron/:id', async (req, res) => {
    const { id } = req.params;
    const { lebron_name, lebron_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE lebrons SET lebron_name=?, lebron_pic=? WHERE id=?',
            [lebron_name, lebron_pic, id]
        );
        res.status(201).json({ message: 'Lebron ' + id + ' updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update lebron ' + id });
    }
});

// DELETE: Delete a lebron
app.delete('/deletelebron/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM lebrons WHERE id=?', [id]);
        res.status(201).json({ message: 'Lebron ' + id + ' deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete lebron ' + id });
    }
});
