const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const CATEGORIES_FILE = path.join(__dirname, 'categories.json');
const SETTINGS_FILE = path.join(__dirname, 'settings.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

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

// CATEGORIES ROUTES
app.get('/api/categories', (req, res) => {
  fs.readFile(CATEGORIES_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read categories' });
    res.json(JSON.parse(data));
  });
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  fs.readFile(CATEGORIES_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read categories' });
    const categories = JSON.parse(data);
    if (!categories.includes(name)) {
      categories.push(name);
      fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Failed' });
        res.status(201).json(categories);
      });
    } else {
      res.status(400).json({ error: 'Already exists' });
    }
  });
});

app.delete('/api/categories/:name', (req, res) => {
  const { name } = req.params;
  fs.readFile(CATEGORIES_FILE, 'utf8', (err, data) => {
    const categories = JSON.parse(data).filter(c => c !== name);
    fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), (err) => {
      res.status(204).send();
    });
  });
});

// SETTINGS/THEME ROUTES
app.get('/api/settings', (req, res) => {
  fs.readFile(SETTINGS_FILE, 'utf8', (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.put('/api/settings', (req, res) => {
  fs.writeFile(SETTINGS_FILE, JSON.stringify(req.body, null, 2), (err) => {
    res.json(req.body);
  });
});

// IMAGE UPLOAD ROUTE
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
