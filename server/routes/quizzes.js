/** @format */

const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Rastgele soru getir
router.get('/random', async (req, res) => {
	try {
		const { category, type, author } = req.query;
		const query = { status: 'approved' };

		if (category) query.category = category.toLowerCase();
		if (type) query.type = type;
		if (author) query.author = author;

		const count = await Quiz.countDocuments(query);
		if (count === 0) {
			return res.status(404).json({
				message: 'Bu kriterlere uygun soru bulunamadı',
			});
		}

		const random = Math.floor(Math.random() * count);
		const quiz = await Quiz.findOne(query).skip(random);

		res.json(quiz);
	} catch (error) {
		res.status(500).json({
			message: 'Sunucu hatası',
			error: error.message,
		});
	}
});

// Yeni soru ekle
router.post('/', async (req, res) => {
	try {
		const quiz = new Quiz(req.body);
		await quiz.save();
		res.status(201).json(quiz);
	} catch (error) {
		if (error.name === 'ValidationError') {
			return res.status(400).json({
				message: 'Validasyon hatası',
				errors: Object.values(error.errors).map((err) => err.message),
			});
		}
		res.status(500).json({
			message: 'Sunucu hatası',
			error: error.message,
		});
	}
});

// Admin: Bekleyen soruları listele
router.get('/pending', async (req, res) => {
	try {
		const quizzes = await Quiz.find({ status: 'pending' }).sort({
			createdAt: -1,
		});
		res.json(quizzes);
	} catch (error) {
		res.status(500).json({
			message: 'Sunucu hatası',
			error: error.message,
		});
	}
});

// Admin: Soru durumunu güncelle
router.patch('/:id/status', async (req, res) => {
	try {
		const { status } = req.body;
		if (!['approved', 'rejected'].includes(status)) {
			return res.status(400).json({
				message: 'Geçersiz durum',
			});
		}

		const quiz = await Quiz.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true }
		);

		if (!quiz) {
			return res.status(404).json({
				message: 'Soru bulunamadı',
			});
		}

		res.json(quiz);
	} catch (error) {
		res.status(500).json({
			message: 'Sunucu hatası',
			error: error.message,
		});
	}
});

// Kategorileri listele
router.get('/categories', async (req, res) => {
	try {
		const categories = await Quiz.distinct('category', {
			status: 'approved',
		});
		res.json({ categories });
	} catch (error) {
		res.status(500).json({
			message: 'Sunucu hatası',
			error: error.message,
		});
	}
});

module.exports = router;
