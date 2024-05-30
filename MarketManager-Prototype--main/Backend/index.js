const express = require("express");
const app = express();
const {pool} = require('./connector.js');
const PORT = process.env.PGPORT; 
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Route untuk mendapatkan semua produk
app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route untuk menambah produk baru
app.post('/product', async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        const result = await pool.query(
            'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *',
            [name, price, stock]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route untuk menghapus produk
app.delete('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route untuk mengupdate produk
app.put('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock } = req.body;
        const result = await pool.query(
            'UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *',
            [name, price, stock, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});
