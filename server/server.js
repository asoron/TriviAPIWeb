/** @format */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const quizRoutes = require('./routes/quizzes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quizzes', quizRoutes);

// MongoDB bağlantısı
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB bağlantısı başarılı'))
	.catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Ana route
app.get('/', (req, res) => {
	res.json({ message: 'TriviAPI - Trivia Soruları API' });
});

// Error handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: 'Bir şeyler ters gitti!',
		error: process.env.NODE_ENV === 'development' ? err.message : undefined,
	});
});

// Port ayarı
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
	console.log(`Server ${PORT} portunda çalışıyor`);
});
