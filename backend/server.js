import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // To parse JSON bodies

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

console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
	connectDB();
	console.log('Server started at Port,', PORT);
});
