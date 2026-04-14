const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Get all products
app.get('/api/products', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const products = data ? JSON.parse(data) : [];
    res.json(products);
  });
});

// Add a new product
app.post('/api/products', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    const products = data ? JSON.parse(data) : [];
    const newProduct = {
      id: Date.now().toString(),
      ...req.body
    };
    products.push(newProduct);
    
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save data' });
      }
      res.status(201).json(newProduct);
    });
  });
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    let products = data ? JSON.parse(data) : [];
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    
    products[index] = { ...products[index], ...req.body, id }; // Keep original ID
    
    fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save data' });
      res.json(products[index]);
    });
  });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read data' });
    let products = data ? JSON.parse(data) : [];
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    fs.writeFile(DATA_FILE, JSON.stringify(filteredProducts, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Failed to save data' });
      res.status(204).send();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
