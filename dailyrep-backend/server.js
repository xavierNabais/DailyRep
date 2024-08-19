const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

// Importar rotas
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const likeRoutes = require('./routes/likes');
const commentRoutes = require('./routes/comments');
const followRoutes = require('./routes/follows');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Usar rotas
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/follows', followRoutes);
app.use('/api/auth', authRoutes); 

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
