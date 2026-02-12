import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // To parse JSON bodies

app.get('/api/products', async (req, res) => {
	try {
		const products = await Product.find();
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.log('Error in fetching products', error.message);
		res.status(500).json({ success: false, message: 'Server error while fetching products.' });
	}
});

app.post('/api/products', async (req, res) => {
	const product = req.body; // User will send product data in the request body

	if (!product.name || !product.price || !product.image) {
		return res.status(400).json({ success: false, message: 'Name, price, and image are required fields.' });
	}

	const newProduct = new Product(product);

	try {
		await newProduct.save();
		res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
		console.error('Error saving product:', error);
	}
});

app.delete('/api/products/:id', async (req, res) => {
	const { id } = req.params;
	try {
		await Product.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: 'Product deleted successfully.' });
	} catch (error) {
		console.log('Error in deleting products', error.message);
		res.status(404).json({ success: false, message: 'Product not found.' });
	}
});

app.listen(PORT, () => {
	connectDB();
	console.log('Server started at Port,', PORT);
});
