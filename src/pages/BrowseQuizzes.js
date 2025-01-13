/** @format */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/BrowseQuizzes.css';

function BrowseQuizzes() {
	const [filters, setFilters] = useState({
		category: '',
		answerType: '',
		authorName: '',
	});
	const [currentQuiz, setCurrentQuiz] = useState(null);
	const [selectedAnswer, setSelectedAnswer] = useState('');
	const [score, setScore] = useState(0);
	const [questionsAnswered, setQuestionsAnswered] = useState(0);
	const [loading, setLoading] = useState(true);
	const [availableCategories, setAvailableCategories] = useState([]);
	const [availableAuthors, setAvailableAuthors] = useState([]);
	const [skipCount, setSkipCount] = useState(0);

	useEffect(() => {
		console.log('Component mounted - fetching first quiz');
		fetchNextQuiz();
	}, []);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		console.log('Filter changed:', name, value);
		setFilters((prev) => ({
			...prev,
			[name]: value,
		}));
		fetchNextQuiz({ ...filters, [name]: value });
	};

	const fetchNextQuiz = async (currentFilters = filters) => {
		try {
			setLoading(true);
			console.log('Fetching quiz with filters:', currentFilters);

			const queryParams = new URLSearchParams(
				Object.entries(currentFilters)
					.filter(([_, value]) => value !== '')
					.reduce(
						(acc, [key, value]) => ({ ...acc, [key]: value }),
						{}
					)
			).toString();

			console.log('API URL:', `/api/quizzes/random?${queryParams}`);

			const response = await fetch(`/api/quizzes/random?${queryParams}`);
			const data = await response.json();
			console.log('API Response:', data);

			if (response.ok && data.quizzes && data.quizzes.length > 0) {
				const quiz = data.quizzes[0];
				console.log('New quiz loaded:', {
					question: quiz.question,
					answerType: quiz.answerType,
					answers: quiz.answers,
					correctAnswer: quiz.correctAnswer,
					authorName: quiz.authorName,
				});

				if (data.filters) {
					setAvailableCategories(data.filters.categories || []);
					setAvailableAuthors(data.filters.authors || []);
				}

				setCurrentQuiz(quiz);
				setSelectedAnswer('');
				setSkipCount((prev) => prev + 1);
			} else {
				console.log('No quizzes found:', data.message);
				if (skipCount > 0) {
					setSkipCount(0);
					toast.info('Soru havuzunun başına dönülüyor');
					return fetchNextQuiz(currentFilters);
				} else {
					toast.error('Seçilen filtrelere uygun soru bulunamadı');
					setCurrentQuiz(null);
				}
			}
		} catch (error) {
			console.error('Error in fetchNextQuiz:', error);
			toast.error('Soru yüklenirken hata oluştu. Lütfen tekrar deneyin.');
			setCurrentQuiz(null);
		} finally {
			setLoading(false);
		}
	};

	const handleAnswerSelect = (answer, index) => {
		if (!currentQuiz) {
			console.log('No current quiz available');
			return;
		}

		setSelectedAnswer(answer);
		const isCorrect = index === currentQuiz.correctAnswer;

		if (isCorrect) {
			setScore((prev) => prev + 1);
			toast.success('Doğru cevap!', {
				position: 'top-right',
				autoClose: 1500,
			});
		} else {
			const correctAnswer =
				currentQuiz.answers[currentQuiz.correctAnswer];
			toast.error(`Yanlış cevap! Doğru cevap: ${correctAnswer}`, {
				position: 'top-right',
				autoClose: 1500,
			});
		}
		setQuestionsAnswered((prev) => prev + 1);

		setTimeout(() => {
			fetchNextQuiz();
		}, 1500);
	};

	return (
		<div className='quiz-container'>
			<div className='quiz-paper'>
				<div className='quiz-header'>
					<h1 className='quiz-title'>Quiz Yarışması</h1>
					<div className='score-container'>
						<span className='score-text'>
							Puan:{' '}
							<span
								className={`score-value ${
									score > 0 && score === questionsAnswered
										? 'perfect'
										: ''
								}`}
							>
								{score}
							</span>
							<span className='score-separator'>/</span>
							<span>{questionsAnswered}</span>
						</span>
					</div>
				</div>

				<div className='filters-paper'>
					<div className='filters-container'>
						<div className='filter-group'>
							<label className='filter-label'>Kategori</label>
							<select
								className='filter-select'
								name='category'
								value={filters.category}
								onChange={handleFilterChange}
							>
								<option value=''>Tüm Kategoriler</option>
								{availableCategories.map((category) => (
									<option
										key={category}
										value={category}
									>
										{category === 'General Knowledge'
											? 'Genel Kültür'
											: category === 'Entertainment'
											? 'Eğlence'
											: category === 'Science'
											? 'Bilim'
											: category === 'Mythology'
											? 'Mitoloji'
											: category === 'Sports'
											? 'Spor'
											: category === 'Geography'
											? 'Coğrafya'
											: category === 'History'
											? 'Tarih'
											: category === 'Politics'
											? 'Politika'
											: category === 'Art'
											? 'Sanat'
											: category === 'Celebrities'
											? 'Ünlüler'
											: category === 'Animals'
											? 'Hayvanlar'
											: category === 'Vehicles'
											? 'Araçlar'
											: category}
									</option>
								))}
							</select>
						</div>

						<div className='filter-group'>
							<label className='filter-label'>Soru Tipi</label>
							<select
								className='filter-select'
								name='answerType'
								value={filters.answerType}
								onChange={handleFilterChange}
							>
								<option value=''>Tüm Tipler</option>
								<option value='multiple'>Çoktan Seçmeli</option>
								<option value='boolean'>Doğru/Yanlış</option>
							</select>
						</div>

						<div className='filter-group'>
							<label className='filter-label'>Yazar</label>
							<select
								className='filter-select'
								name='authorName'
								value={filters.authorName}
								onChange={handleFilterChange}
							>
								<option value=''>Tüm Yazarlar</option>
								{availableAuthors.map((author) => (
									<option
										key={author}
										value={author}
									>
										{author}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{loading ? (
					<div className='loading-container'>
						<div className='loading-spinner'></div>
					</div>
				) : currentQuiz ? (
					<div className='quiz-content'>
						<div className='quiz-tags'>
							<span className='quiz-tag'>
								{currentQuiz.category === 'General Knowledge'
									? 'Genel Kültür'
									: currentQuiz.category === 'Entertainment'
									? 'Eğlence'
									: currentQuiz.category === 'Science'
									? 'Bilim'
									: currentQuiz.category === 'Mythology'
									? 'Mitoloji'
									: currentQuiz.category === 'Sports'
									? 'Spor'
									: currentQuiz.category === 'Geography'
									? 'Coğrafya'
									: currentQuiz.category === 'History'
									? 'Tarih'
									: currentQuiz.category === 'Politics'
									? 'Politika'
									: currentQuiz.category === 'Art'
									? 'Sanat'
									: currentQuiz.category === 'Celebrities'
									? 'Ünlüler'
									: currentQuiz.category === 'Animals'
									? 'Hayvanlar'
									: currentQuiz.category === 'Vehicles'
									? 'Araçlar'
									: currentQuiz.category}
							</span>
							<span className='quiz-tag'>
								{currentQuiz.difficulty === 'easy'
									? 'Kolay'
									: currentQuiz.difficulty === 'medium'
									? 'Orta'
									: currentQuiz.difficulty === 'hard'
									? 'Zor'
									: currentQuiz.difficulty}
							</span>
							<span className='quiz-tag'>
								{currentQuiz.answerType === 'boolean'
									? 'Doğru/Yanlış'
									: 'Çoktan Seçmeli'}
							</span>
						</div>
						<h2 className='question-text'>
							{currentQuiz.question}
						</h2>
						<div className='answer-options'>
							{currentQuiz.answers.map((answer, index) => (
								<button
									key={index}
									className={`answer-button ${
										selectedAnswer === answer
											? 'selected'
											: ''
									} ${
										selectedAnswer &&
										index === currentQuiz.correctAnswer
											? 'correct'
											: ''
									} ${
										selectedAnswer &&
										index !== currentQuiz.correctAnswer &&
										selectedAnswer === answer
											? 'incorrect'
											: ''
									}`}
									onClick={() =>
										handleAnswerSelect(answer, index)
									}
									disabled={selectedAnswer !== ''}
								>
									{answer}
								</button>
							))}
						</div>
						<div className='quiz-info'>
							<span className='author-text'>
								Yazar:{' '}
								<span className='author-name'>
									{currentQuiz.authorName}
								</span>
							</span>
						</div>
						<button
							className='skip-button'
							onClick={() => fetchNextQuiz()}
							disabled={selectedAnswer !== ''}
						>
							Soruyu Değiştir
						</button>
					</div>
				) : (
					<div className='no-questions'>
						Seçilen kriterlere uygun soru bulunamadı. Farklı
						filtreler deneyin veya yeni sorular ekleyin!
					</div>
				)}
			</div>
		</div>
	);
}

export default BrowseQuizzes;
