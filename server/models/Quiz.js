/** @format */

const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
	question: {
		type: String,
		required: [true, 'Soru metni zorunludur'],
		minlength: [10, 'Soru en az 10 karakter olmalıdır'],
	},
	type: {
		type: String,
		enum: ['multiple', 'boolean'],
		required: [true, 'Soru tipi zorunludur'],
	},
	category: {
		type: String,
		required: [true, 'Kategori zorunludur'],
		lowercase: true,
	},
	answers: {
		type: [String],
		validate: {
			validator: function (arr) {
				if (this.type === 'multiple') {
					return arr.length === 4;
				} else if (this.type === 'boolean') {
					return arr.length === 0;
				}
				return false;
			},
			message:
				'Çoktan seçmeli sorular için 4 cevap, doğru/yanlış sorular için cevap olmamalıdır',
		},
	},
	correctAnswer: {
		type: Number,
		required: [true, 'Doğru cevap zorunludur'],
		validate: {
			validator: function (value) {
				if (this.type === 'multiple') {
					return value >= 0 && value < 4;
				} else if (this.type === 'boolean') {
					return value === 0 || value === 1;
				}
				return false;
			},
			message: 'Geçersiz doğru cevap indeksi',
		},
	},
	author: {
		type: String,
		required: [true, 'Yazar adı zorunludur'],
	},
	status: {
		type: String,
		enum: ['pending', 'approved', 'rejected'],
		default: 'pending',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Kategorileri küçük harfe çevir
quizSchema.pre('save', function (next) {
	this.category = this.category.toLowerCase();
	next();
});

module.exports = mongoose.model('Quiz', quizSchema);
