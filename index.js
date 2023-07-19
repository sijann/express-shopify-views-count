const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = 3001;
const MONGO_URL = process.env.MONGO_URL;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
mongoose.connect(
    MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
const productSchema = new mongoose.Schema({
    _id: String,
    count: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

app.use(bodyParser.json());

app.get('/api/product', async (req, res) => {
    const { productId } = req.query;

    if (!productId) {
        return res.status(400).json({ error: 'Missing productId parameter' });
    }

    try {
        let product = await Product.findById(productId);

        if (product) {
            // If the product exists, increment the count field and save the document
            product.count++;
        } else {
            // If the product doesn't exist, create a new document
            product = new Product({ _id: productId, count: 1 });
        }

        await product.save();
        return res.json({ count: product.count });
    } catch (error) {
        console.error('Error updating or inserting product:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
