/** @format */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/BrowseQuizzes.css';

const API_URL = 'https://triviapi.onrender.com/api';

function BrowseQuizzes() {
	const [loading, setLoading] = useState(true);
	const [currentQuiz, setCurrentQuiz] = useState(null);
	const [score, setScore] = useState(0);
	const [questionsAnswered, setQuestionsAnswered] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [showCorrect, setShowCorrect] = useState(false);
	const [availableFilters, setAvailableFilters] = useState({
		categories: [],
		authors: [],
		types: ['multiple', 'boolean'],
		difficulties: ['kolay', 'orta', 'zor'],
	});
	const [currentFilters, setCurrentFilters] = useState({
		category: '',
		type: '',
		author: '',
		difficulty: '',
	});
	const [stats, setStats] = useState(null);

	// Fetch initial stats and quiz
	useEffect(() => {
		fetchStats();
		fetchNextQuiz();
	}, []);

	const fetchStats = async () => {
		try {
			const response = await fetch(`${API_URL}/quizzes/stats`);
			const data = await response.json();
			if (data.success) {
				setStats(data.stats);
			}
		} catch (error) {
			console.error('Stats yüklenirken hata:', error);
		}
	};

	const fetchNextQuiz = async () => {
		setLoading(true);
		try {
			// Build query params
			const params = new URLSearchParams();
			Object.entries(currentFilters).forEach(([key, value]) => {
				if (value) params.append(key, value);
			});

			const response = await fetch(
				`${API_URL}/quizzes/random?${params.toString()}`
			);
			const data = await response.json();

			if (!data.success) {
				toast.info(
					'Bu filtrelere uygun soru bulunamadı. Farklı filtreler deneyin!',
					{
						position: 'bottom-right',
						autoClose: 3000,
					}
				);
				return;
			}

			setCurrentQuiz(data.quiz);
			setAvailableFilters((prev) => ({
				...prev,
				categories: data.filters.categories,
				authors: data.filters.authors,
			}));
		} catch (error) {
			console.error('Soru yüklenirken hata:', error);
			toast.error('Soru yüklenirken bir hata oluştu', {
				position: 'bottom-right',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setCurrentFilters((prev) => ({
			...prev,
			[name]: value,
		}));
		fetchNextQuiz();
	};

	const handleAnswerSelect = async (selected) => {
		if (selectedAnswer !== null) return; // Prevent multiple selections

		setSelectedAnswer(selected);
		const isCorrect =
			currentQuiz.type === 'boolean'
				? (selected === 'true' ? 0 : 1) === currentQuiz.correctAnswer
				: selected === currentQuiz.correctAnswer;

		setShowCorrect(true);

		if (isCorrect) {
			setScore((prev) => prev + 1);
			toast.success('🎉 Doğru cevap!', {
				position: 'bottom-right',
				autoClose: 2000,
			});
		} else {
			toast.error('❌ Yanlış cevap!', {
				position: 'bottom-right',
				autoClose: 2000,
			});
		}

		setQuestionsAnswered((prev) => prev + 1);

		// Wait before fetching next question
		setTimeout(() => {
			setSelectedAnswer(null);
			setShowCorrect(false);
			fetchNextQuiz();
		}, 1500);
	};

	const getAnswerOptions = () => {
		if (currentQuiz.type === 'boolean') {
			return [
				{ text: 'Doğru', value: 'true' },
				{ text: 'Yanlış', value: 'false' },
			];
		}
		return currentQuiz.answers.map((answer, index) => ({
			text: answer,
			value: index,
		}));
	};

	const getAnswerButtonClass = (value) => {
		if (selectedAnswer === null) return '';

		if (currentQuiz.type === 'boolean') {
			const correctAnswer =
				currentQuiz.correctAnswer === 0 ? 'true' : 'false';
			if (value === selectedAnswer) {
				return value === correctAnswer ? 'correct' : 'incorrect';
			}
			return value === correctAnswer && showCorrect
				? 'show-correct'
				: 'disabled';
		} else {
			if (value === selectedAnswer) {
				return value === currentQuiz.correctAnswer
					? 'correct'
					: 'incorrect';
			}
			return value === currentQuiz.correctAnswer && showCorrect
				? 'show-correct'
				: 'disabled';
		}
	};

	if (loading) {
		return (
			<div className='quiz-container'>
				<div className='loading-container'>
					<div className='loading-spinner'></div>
					<div className='loading-text'>Soru yükleniyor...</div>
				</div>
			</div>
		);
	}

	return (
		<div className='quiz-container'>
			<div className='quiz-dashboard'>
				{/* Stats Sidebar */}
				<aside className='stats-sidebar'>
					<div className='stats-header'>
						<div className='stats-header-icon'>📊</div>
						<h2 className='stats-header-text'>İstatistikler</h2>
					</div>

					<div className='stats-grid'>
						<div className='stat-card'>
							<div className='stat-value'>{score}</div>
							<div className='stat-label'>Puan</div>
						</div>
						<div className='stat-card'>
							<div className='stat-value'>
								{questionsAnswered}
							</div>
							<div className='stat-label'>Cevaplanan</div>
						</div>
						<div className='stat-card'>
							<div className='stat-value'>
								{questionsAnswered > 0
									? Math.round(
											(score / questionsAnswered) * 100
									  )
									: 0}
								%
							</div>
							<div className='stat-label'>Başarı</div>
						</div>
						<div className='stat-card'>
							<div className='stat-value'>
								{stats?.approved || 0}
							</div>
							<div className='stat-label'>Toplam</div>
						</div>
					</div>

					<div className='progress-section'>
						<div className='progress-title'>
							<div className='progress-title-icon'>🎯</div>
							<span>İlerleme</span>
						</div>
						<div className='progress-bar'>
							<div
								className='progress-fill'
								style={{
									width: `${
										questionsAnswered > 0
											? Math.round(
													(score /
														questionsAnswered) *
														100
											  )
											: 0
									}%`,
								}}
							></div>
						</div>
						<div className='progress-label'>
							<span>
								{score} doğru / {questionsAnswered} soru
							</span>
							<span className='progress-percentage'>
								{questionsAnswered > 0
									? Math.round(
											(score / questionsAnswered) * 100
									  )
									: 0}
								%
							</span>
						</div>
					</div>

					{stats && (
						<div className='progress-section'>
							<div className='progress-title'>
								<div className='progress-title-icon'>🏆</div>
								<span>Genel İstatistikler</span>
							</div>
							<div className='stats-details'>
								<div className='stat-row'>
									<span>Kategoriler</span>
									<span>{stats.byCategory.length}</span>
								</div>
								<div className='stat-row'>
									<span>Yazarlar</span>
									<span>
										{availableFilters.authors.length}
									</span>
								</div>
								<div className='stat-row'>
									<span>Toplam Soru</span>
									<span>{stats.approved}</span>
								</div>
							</div>
						</div>
					)}
				</aside>

				{/* Main Quiz Content */}
				<main className='quiz-paper'>
					<h1 className='quiz-title'>Trivia Zamanı!</h1>

					{/* Filters */}
					<div className='filters-container'>
						<select
							name='category'
							value={currentFilters.category}
							onChange={handleFilterChange}
							className='filter-select'
						>
							<option value=''>Tüm Kategoriler</option>
							{availableFilters.categories.map((category) => (
								<option
									key={category}
									value={category}
								>
									{category.charAt(0).toUpperCase() +
										category.slice(1)}
								</option>
							))}
						</select>

						<select
							name='difficulty'
							value={currentFilters.difficulty}
							onChange={handleFilterChange}
							className='filter-select'
						>
							<option value=''>Tüm Zorluklar</option>
							{availableFilters.difficulties.map((difficulty) => (
								<option
									key={difficulty}
									value={difficulty}
								>
									{difficulty === 'kolay'
										? 'Kolay'
										: difficulty === 'orta'
										? 'Orta'
										: 'Zor'}
								</option>
							))}
						</select>

						<select
							name='type'
							value={currentFilters.type}
							onChange={handleFilterChange}
							className='filter-select'
						>
							<option value=''>Tüm Tipler</option>
							<option value='multiple'>Çoktan Seçmeli</option>
							<option value='boolean'>Doğru/Yanlış</option>
						</select>

						<select
							name='author'
							value={currentFilters.author}
							onChange={handleFilterChange}
							className='filter-select'
						>
							<option value=''>Tüm Yazarlar</option>
							{availableFilters.authors.map((author) => (
								<option
									key={author}
									value={author}
								>
									{author}
								</option>
							))}
						</select>
					</div>

					{currentQuiz && (
						<div className='quiz-content'>
							<div className='quiz-meta'>
								<div className='quiz-author'>
									<div className='author-avatar'>
										{currentQuiz.author
											.charAt(0)
											.toUpperCase()}
									</div>
									<span>{currentQuiz.author}</span>
								</div>

								<div
									className={`quiz-difficulty ${currentQuiz.difficulty}`}
								>
									<div className='difficulty-icon'>
										{currentQuiz.difficulty === 'kolay'
											? '🎯'
											: currentQuiz.difficulty === 'orta'
											? '⚡'
											: '🔥'}
									</div>
									<span>
										{currentQuiz.difficulty === 'kolay'
											? 'Kolay'
											: currentQuiz.difficulty === 'orta'
											? 'Orta'
											: 'Zor'}
									</span>
								</div>

								<div className='quiz-category'>
									<span>
										{currentQuiz.category
											.charAt(0)
											.toUpperCase() +
											currentQuiz.category.slice(1)}
									</span>
								</div>
							</div>

							<div className='quiz-question'>
								{currentQuiz.question}
							</div>

							<div className='answers-container'>
								{getAnswerOptions().map((option, index) => (
									<button
										key={index}
										className={`answer-button ${getAnswerButtonClass(
											option.value
										)}`}
										onClick={() =>
											handleAnswerSelect(option.value)
										}
										disabled={selectedAnswer !== null}
									>
										<div className='answer-icon'></div>
										<span>{option.text}</span>
									</button>
								))}
							</div>

							<button
								className='skip-button'
								onClick={fetchNextQuiz}
							>
								Soruyu Değiştir
							</button>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}

export default BrowseQuizzes;
