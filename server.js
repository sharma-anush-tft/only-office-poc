const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: './config.env' });

const app = require('./app');

// 🔗 CONNECT TO MONGODB
// mongoose
//   .connect(process.env.DATABASE)
//   .then(() => {
//     console.log('MongoDB connected successfully');
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
  // });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
