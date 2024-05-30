import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', price: '', stock: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/product', form);
            fetchProducts();
            setForm({ name: '', price: '', stock: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/product/${id}`);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (id) => {
        const updatedProduct = products.find(p => p.id === id);
        const updatedName = prompt("Enter new name", updatedProduct.name);
        const updatedPrice = prompt("Enter new price", updatedProduct.price);
        const updatedStock = prompt("Enter new stock", updatedProduct.stock);

        const updatedForm = { name: updatedName, price: updatedPrice, stock: updatedStock };

        try {
            await axios.put(`http://localhost:5000/product/${id}`, updatedForm);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product Manager</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-2">
                    <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 w-full" required />
                </div>
                <div className="mb-2">
                    <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} className="border p-2 w-full" required />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
            </form>
            <div>
                {products.map(product => (
                    <div key={product.id} className="border p-4 mb-4">
                        <h2 className="text-xl font-bold">{product.name}</h2>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock}</p>
                        <div className="mt-2">
                            <button onClick={() => handleUpdate(product.id)} className="bg-yellow-500 text-white p-2 rounded mr-2">Update</button>
                            <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
