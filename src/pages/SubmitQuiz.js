/** @format */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/SubmitQuiz.css';

const API_URL = 'https://triviapi.onrender.com/api';

function SubmitQuiz() {
	const [loading, setLoading] = useState(false);
	const [availableCategories, setAvailableCategories] = useState([]);
	const [formData, setFormData] = useState({
		question: '',
		type: 'multiple',
		category: '',
		answers: ['', '', '', ''],
		correctAnswer: 0,
		author: '',
		difficulty: 'kolay',
	});
	const [errors, setErrors] = useState({});
	const [stats, setStats] = useState(null);

	const predefinedCategories = [
		'Genel Kültür',
		'Tarih',
		'Bilim',
		'Coğrafya',
		'Spor',
		'Sanat',
		'Müzik',
		'Sinema & TV',
		'Teknoloji',
		'Edebiyat',
		'Yemek & Mutfak',
		'Mitoloji',
		'Doğa & Hayvanlar',
		'Eğlence',
	];

	useEffect(() => {
		fetchCategories();
		fetchStats();
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

	const fetchCategories = async () => {
		try {
			const response = await fetch(`${API_URL}/quizzes/categories`);
			const data = await response.json();
			if (data.success) {
				setAvailableCategories(data.categories);
			}
		} catch (error) {
			console.error('Kategoriler yüklenirken hata:', error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const handleAnswerChange = (index, value) => {
		const newAnswers = [...formData.answers];
		newAnswers[index] = value;
		setFormData((prev) => ({
			...prev,
			answers: newAnswers,
		}));
		if (errors.answers) {
			setErrors((prev) => ({
				...prev,
				answers: '',
			}));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.question.trim()) {
			newErrors.question = 'Lütfen bir soru girin';
		} else if (formData.question.trim().length < 10) {
			newErrors.question = 'Soru en az 10 karakter uzunluğunda olmalıdır';
		}

		if (!formData.category) {
			newErrors.category = 'Lütfen bir kategori seçin';
		}

		if (!formData.author.trim()) {
			newErrors.author = 'Lütfen isminizi girin';
		}

		if (formData.type === 'multiple') {
			const filledAnswers = formData.answers.filter((answer) =>
				answer.trim()
			);
			if (filledAnswers.length < 4) {
				newErrors.answers = 'Tüm 4 cevap seçeneği zorunludur';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		try {
			const quizData = {
				question: formData.question.trim(),
				type: formData.type,
				category: formData.category.toLowerCase(),
				answers:
					formData.type === 'multiple'
						? formData.answers.filter((answer) => answer.trim())
						: [],
				correctAnswer: parseInt(formData.correctAnswer),
				author: formData.author.trim(),
				difficulty: formData.difficulty,
			};

			console.log('Sending quiz data:', quizData);

			const response = await fetch(`${API_URL}/quizzes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(quizData),
			});

			const data = await response.json();
			console.log('Server response:', data);

			if (!data.success) {
				if (data.errors && Array.isArray(data.errors)) {
					data.errors.forEach((error) => {
						toast.error(error, {
							position: 'bottom-right',
							autoClose: 3000,
						});
					});
					throw new Error(data.errors[0]);
				} else {
					throw new Error(
						data.message || 'Soru eklenirken bir hata oluştu'
					);
				}
			}

			toast.success('Soru başarıyla eklendi! Onay için bekleyecek.', {
				position: 'bottom-right',
				autoClose: 3000,
			});
			resetForm();
			fetchStats(); // Refresh stats after successful submission
		} catch (error) {
			console.error('Error details:', error);
			if (!error.message.includes('Validasyon')) {
				toast.error('Soru eklenirken bir hata oluştu', {
					position: 'bottom-right',
					autoClose: 3000,
				});
			}
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			question: '',
			type: 'multiple',
			category: '',
			answers: ['', '', '', ''],
			correctAnswer: 0,
			author: '',
			difficulty: 'kolay',
		});
		setErrors({});
	};

	return (
		<div className='submit-container'>
			<div className='submit-dashboard'>
				{/* Stats Sidebar */}
				<aside className='stats-sidebar'>
					<div className='stats-header'>
						<div className='stats-header-icon'>📊</div>
						<h2 className='stats-header-text'>
							Soru İstatistikleri
						</h2>
					</div>

					{stats && (
						<div className='stats-grid'>
							<div className='stat-card'>
								<div className='stat-value'>
									{stats.pending}
								</div>
								<div className='stat-label'>Bekleyen</div>
							</div>
							<div className='stat-card'>
								<div className='stat-value'>
									{stats.approved}
								</div>
								<div className='stat-label'>Onaylanan</div>
							</div>
							<div className='stat-card'>
								<div className='stat-value'>
									{stats.byCategory
										? stats.byCategory.length
										: 0}
								</div>
								<div className='stat-label'>Kategori</div>
							</div>
							<div className='stat-card'>
								<div className='stat-value'>
									{availableCategories.length}
								</div>
								<div className='stat-label'>Aktif</div>
							</div>
						</div>
					)}

					<div className='progress-section'>
						<div className='progress-title'>
							<div className='progress-title-icon'>📝</div>
							<span>Soru Gönderim Kuralları</span>
						</div>
						<ul className='guidelines-list'>
							<li>
								Açık ve anlaşılır sorular yazın (min. 10
								karakter)
							</li>
							<li>Tam olarak 4 farklı cevap seçeneği belirtin</li>
							<li>Sadece bir doğru cevap olduğundan emin olun</li>
							<li>Uygun zorluk seviyesi seçin</li>
							<li>Benzer veya tekrar eden sorulardan kaçının</li>
							<li>Yazım ve dilbilgisi kurallarına dikkat edin</li>
						</ul>
					</div>
				</aside>

				{/* Main Content */}
				<main className='submit-paper'>
					<h1 className='submit-title'>Yeni Soru Ekle</h1>
					<p className='submit-description'>
						Soru bankamıza yeni bir soru ekleyin. Tüm sorular
						yayınlanmadan önce incelenecektir.
					</p>

					<form
						onSubmit={handleSubmit}
						className='submit-form'
					>
						<div className='form-group'>
							<label htmlFor='question'>Soru</label>
							<textarea
								id='question'
								name='question'
								value={formData.question}
								onChange={handleInputChange}
								className={`form-field ${
									errors.question ? 'error' : ''
								}`}
								placeholder='Sorunuzu buraya yazın...'
							/>
							{errors.question && (
								<span className='error-message'>
									{errors.question}
								</span>
							)}
						</div>

						<div className='form-group'>
							<label htmlFor='category'>Kategori</label>
							<select
								id='category'
								name='category'
								value={formData.category}
								onChange={handleInputChange}
								className={`form-field ${
									errors.category ? 'error' : ''
								}`}
							>
								<option value=''>Kategori seçin</option>
								{predefinedCategories.map((category) => (
									<option
										key={category}
										value={category.toLowerCase()}
									>
										{category}
									</option>
								))}
							</select>
							{errors.category && (
								<span className='error-message'>
									{errors.category}
								</span>
							)}
						</div>

						<div className='form-group'>
							<label htmlFor='type'>Soru Tipi</label>
							<select
								id='type'
								name='type'
								value={formData.type}
								onChange={handleInputChange}
								className='form-field'
							>
								<option value='multiple'>Çoktan Seçmeli</option>
								<option value='boolean'>Doğru/Yanlış</option>
							</select>
						</div>

						<div className='form-group'>
							<label>Cevap Seçenekleri</label>
							{formData.type === 'multiple' ? (
								formData.answers.map((answer, index) => (
									<div
										key={index}
										className='answer-input-group'
									>
										<div className='answer-number'>
											{index + 1}
										</div>
										<input
											type='text'
											value={answer}
											onChange={(e) =>
												handleAnswerChange(
													index,
													e.target.value
												)
											}
											className={`form-field answer-input ${
												!answer.trim() ? 'required' : ''
											}`}
											placeholder={`${
												index + 1
											}. cevap seçeneği (zorunlu)`}
											required
										/>
									</div>
								))
							) : (
								<div className='answer-input-group'>
									<div className='answer-number'>✓</div>
									<div className='form-field'>
										Doğru/Yanlış Sorusu
									</div>
								</div>
							)}
							{errors.answers && (
								<span className='error-message'>
									{errors.answers}
								</span>
							)}
						</div>

						<div className='form-group'>
							<label>Doğru Cevap</label>
							<div className='correct-answer-group'>
								{formData.type === 'multiple' ? (
									formData.answers.map((answer, index) => (
										<label
											key={index}
											className={`correct-option ${
												!answer.trim() ? 'disabled' : ''
											}`}
										>
											<input
												type='radio'
												name='correctAnswer'
												value={index}
												checked={
													parseInt(
														formData.correctAnswer
													) === index
												}
												onChange={(e) =>
													handleInputChange({
														target: {
															name: 'correctAnswer',
															value: e.target
																.value,
														},
													})
												}
												disabled={!answer.trim()}
											/>
											<span className='correct-label'>
												Seçenek {index + 1}
											</span>
										</label>
									))
								) : (
									<>
										<label className='correct-option'>
											<input
												type='radio'
												name='correctAnswer'
												value='0'
												checked={
													parseInt(
														formData.correctAnswer
													) === 0
												}
												onChange={(e) =>
													handleInputChange({
														target: {
															name: 'correctAnswer',
															value: e.target
																.value,
														},
													})
												}
											/>
											<span className='correct-label'>
												Doğru
											</span>
										</label>
										<label className='correct-option'>
											<input
												type='radio'
												name='correctAnswer'
												value='1'
												checked={
													parseInt(
														formData.correctAnswer
													) === 1
												}
												onChange={(e) =>
													handleInputChange({
														target: {
															name: 'correctAnswer',
															value: e.target
																.value,
														},
													})
												}
											/>
											<span className='correct-label'>
												Yanlış
											</span>
										</label>
									</>
								)}
							</div>
						</div>

						<div className='form-group'>
							<label htmlFor='difficulty'>Zorluk</label>
							<select
								id='difficulty'
								name='difficulty'
								value={formData.difficulty}
								onChange={handleInputChange}
								className='form-field'
							>
								<option value='kolay'>Kolay</option>
								<option value='orta'>Orta</option>
								<option value='zor'>Zor</option>
							</select>
						</div>

						<div className='form-group'>
							<label htmlFor='author'>Yazar</label>
							<input
								type='text'
								id='author'
								name='author'
								value={formData.author}
								onChange={handleInputChange}
								className={`form-field ${
									errors.author ? 'error' : ''
								}`}
								placeholder='İsminizi girin'
							/>
							{errors.author && (
								<span className='error-message'>
									{errors.author}
								</span>
							)}
						</div>

						<button
							type='submit'
							className='submit-button'
							disabled={loading}
						>
							{loading ? 'Gönderiliyor...' : 'Soruyu Gönder'}
						</button>
					</form>
				</main>
			</div>
		</div>
	);
}

export default SubmitQuiz;
