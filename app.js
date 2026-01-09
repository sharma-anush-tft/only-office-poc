const express = require('express');
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const onlyOfficeRoutes = require('./routes/onlyofficeRoutes');

app.use(cors());

// Middleware to read JSON body
app.use(express.json());

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/tasks', taskRoutes);

app.use('/api/v1/onlyoffice', onlyOfficeRoutes);


// Health check route
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;
