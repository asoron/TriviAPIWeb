/** @format */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
mongoose
	.connect(
		process.env.MONGODB_URI ||
			'mongodb+srv://asrinylmz2:aa1980aa@triviapi.8r9lu.mongodb.net/?retryWrites=true&w=majority&appName=TriviAPI',
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log('Connected to MongoDB'))
	.catch((err) => {
		console.error('MongoDB connection error:', err);
		process.exit(1); // Exit if cannot connect to database
	});

// Quiz Schema with proper validation
const quizSchema = new mongoose.Schema({
	question: {
		type: String,
		required: [true, 'Question is required'],
		trim: true,
		minlength: [3, 'Question must be at least 3 characters long'],
	},
	category: {
		type: String,
		required: [true, 'Category is required'],
		trim: true,
	},
	answerType: {
		type: String,
		required: [true, 'Answer type is required'],
		enum: {
			values: ['multiple', 'boolean'],
			message: '{VALUE} is not a valid answer type',
		},
	},
	answers: {
		type: [String],
		validate: {
			validator: function (answers) {
				if (this.answerType === 'multiple') {
					return answers.length === 4;
				} else if (this.answerType === 'boolean') {
					return answers.length === 0; // We'll handle boolean answers in the API
				}
				return false;
			},
			message: 'Multiple choice questions must have exactly 4 answers',
		},
	},
	correctAnswer: {
		type: Number,
		required: [true, 'Correct answer is required'],
		validate: {
			validator: function (value) {
				if (this.answerType === 'multiple') {
					return value >= 0 && value < 4;
				} else if (this.answerType === 'boolean') {
					return value === 0 || value === 1;
				}
				return false;
			},
			message: 'Invalid correct answer index',
		},
	},
	difficulty: {
		type: String,
		required: [true, 'Difficulty is required'],
		enum: {
			values: ['easy', 'medium', 'hard'],
			message: '{VALUE} is not a valid difficulty level',
		},
	},
	authorName: {
		type: String,
		required: [true, 'Author name is required'],
		trim: true,
	},
	status: {
		type: String,
		default: 'pending',
		enum: {
			values: ['pending', 'approved', 'rejected'],
			message: '{VALUE} is not a valid status',
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Add indexes for better query performance
quizSchema.index({ status: 1, category: 1, answerType: 1 });
quizSchema.index({ authorName: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);

// Helper function to process quiz for response
const processQuizForResponse = (quiz) => {
	const processedQuiz = quiz.toObject();

	if (processedQuiz.answerType === 'boolean') {
		processedQuiz.answers = ['True', 'False'];
		processedQuiz.correctAnswer = Number(processedQuiz.correctAnswer);
	}

	return processedQuiz;
};

// Routes with better error handling
app.post('/api/quizzes', async (req, res) => {
	try {
		const quiz = new Quiz(req.body);
		await quiz.save();
		res.status(201).json(processQuizForResponse(quiz));
	} catch (error) {
		if (error.name === 'ValidationError') {
			return res.status(400).json({
				message: 'Validation Error',
				errors: Object.values(error.errors).map((err) => err.message),
			});
		}
		console.error('Error creating quiz:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

app.get('/api/quizzes/pending', async (req, res) => {
	try {
		const quizzes = await Quiz.find({ status: 'pending' })
			.sort({ createdAt: -1 })
			.limit(50);
		res.json(quizzes.map(processQuizForResponse));
	} catch (error) {
		console.error('Error fetching pending quizzes:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

app.post('/api/quizzes/:id/:action', async (req, res) => {
	try {
		const { id, action } = req.params;

		if (!['approve', 'reject'].includes(action)) {
			return res.status(400).json({ message: 'Invalid action' });
		}

		const quiz = await Quiz.findByIdAndUpdate(
			id,
			{
				status: action === 'approve' ? 'approved' : 'rejected',
				updatedAt: Date.now(),
			},
			{ new: true, runValidators: true }
		);

		if (!quiz) {
			return res.status(404).json({ message: 'Quiz not found' });
		}

		res.json(processQuizForResponse(quiz));
	} catch (error) {
		console.error('Error updating quiz status:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

app.get('/api/quizzes/random', async (req, res) => {
	try {
		const {
			category,
			answerType,
			authorName,
			skip = 0,
			limit = 1,
		} = req.query;

		// Build filter object
		const filter = { status: 'approved' };
		if (category) filter.category = category;
		if (answerType) filter.answerType = answerType;
		if (authorName) filter.authorName = new RegExp(authorName, 'i');

		// Get total count of matching documents
		const count = await Quiz.countDocuments(filter);

		if (count === 0) {
			return res.json({
				quizzes: [],
				filters: {
					categories: await Quiz.distinct('category', {
						status: 'approved',
					}),
					authors: await Quiz.distinct('authorName', {
						status: 'approved',
					}),
				},
				total: 0,
			});
		}

		// Get random documents using aggregation
		const randomQuizzes = await Quiz.aggregate([
			{ $match: filter },
			{ $sample: { size: parseInt(limit) } },
		]);

		// Get unique categories and authors for filters
		const [categories, authors] = await Promise.all([
			Quiz.distinct('category', { status: 'approved' }),
			Quiz.distinct('authorName', { status: 'approved' }),
		]);

		// Process quizzes for response
		const processedQuizzes = randomQuizzes.map((quiz) => {
			return processQuizForResponse(
				quiz instanceof mongoose.Document ? quiz : new Quiz(quiz)
			);
		});

		res.json({
			quizzes: processedQuizzes,
			filters: {
				categories,
				authors,
			},
			total: count,
		});
	} catch (error) {
		console.error('Error in /api/quizzes/random:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Serve static files from the React build directory
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../build')));

	// Handle React routing, return all requests to React app
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
