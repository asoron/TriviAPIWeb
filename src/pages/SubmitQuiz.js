/** @format */

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/SubmitQuiz.css';

function SubmitQuiz() {
	const [formData, setFormData] = useState({
		question: '',
		category: '',
		answerType: 'multiple',
		answers: ['', '', '', ''],
		correctAnswer: null,
		difficulty: 'easy',
		authorName: '',
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [activeField, setActiveField] = useState('');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const handleAnswerChange = (index, value) => {
		const newAnswers = [...formData.answers];
		newAnswers[index] = value;
		setFormData((prev) => ({
			...prev,
			answers: newAnswers,
			// Clear correctAnswer if the selected answer is modified
			correctAnswer:
				prev.correctAnswer === index ? null : prev.correctAnswer,
		}));
		if (errors.answers) {
			setErrors((prev) => ({ ...prev, answers: '' }));
		}
	};

	const handleCorrectAnswerChange = (index) => {
		setFormData((prev) => ({
			...prev,
			correctAnswer: index,
		}));
		if (errors.correctAnswer) {
			setErrors((prev) => ({ ...prev, correctAnswer: '' }));
		}
	};

	const validateForm = () => {
		const errors = {};

		if (!formData.question.trim()) {
			errors.question = 'Lütfen bir soru girin';
		} else if (formData.question.trim().length < 10) {
			errors.question = 'Soru en az 10 karakter uzunluğunda olmalıdır';
		}

		if (!formData.category) {
			errors.category = 'Lütfen bir kategori seçin';
		}

		if (!formData.authorName.trim()) {
			errors.authorName = 'Lütfen adınızı girin';
		}

		if (formData.answerType === 'multiple') {
			const validAnswers = formData.answers.filter((a) => a.trim());
			if (validAnswers.length < 2) {
				errors.answers = 'Lütfen en az 2 cevap seçeneği girin';
			}
		}

		if (formData.correctAnswer === null) {
			errors.correctAnswer = 'Lütfen doğru cevabı seçin';
		}

		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm();

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			const firstError = Object.keys(validationErrors)[0];
			document
				.getElementById(firstError)
				?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}

		try {
			setLoading(true);
			const submissionData = {
				...formData,
				answers:
					formData.answerType === 'multiple'
						? formData.answers.filter((answer) => answer.trim())
						: [],
				correctAnswer:
					formData.answerType === 'boolean'
						? formData.correctAnswer === 'Doğru'
							? 0
							: 1
						: parseInt(formData.correctAnswer),
			};

			const response = await fetch('/api/quizzes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(submissionData),
			});

			const data = await response.json();

			if (response.ok) {
				toast.success(
					'Soru başarıyla gönderildi! Yönetici tarafından incelenecektir.'
				);
				resetForm();
			} else {
				if (data.errors && Array.isArray(data.errors)) {
					toast.error(data.errors.join('\n'));
				} else {
					toast.error(
						data.message || 'Soru gönderimi başarısız oldu'
					);
				}
			}
		} catch (error) {
			console.error('Soru gönderme hatası:', error);
			toast.error(
				'Soru gönderilirken hata oluştu. Lütfen tekrar deneyin.'
			);
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			question: '',
			category: '',
			answerType: 'multiple',
			answers: ['', '', '', ''],
			correctAnswer: null,
			difficulty: 'easy',
			authorName: '',
		});
		setErrors({});
		setActiveField('');
	};

	return (
		<div className='submit-container'>
			<div className='submit-paper'>
				<h1 className='submit-title'>Soru Oluştur</h1>
				<p className='submit-description'>
					Bilgini paylaş! İlginç bir soru oluştur ve diğer
					kullanıcıların çözmesi için gönder. Sorun, soru havuzuna
					eklenmeden önce yöneticilerimiz tarafından incelenecektir.
				</p>

				<form
					onSubmit={handleSubmit}
					className='submit-form'
				>
					{/* Question Field */}
					<div className='form-group'>
						<label htmlFor='question'>
							Soru <span className='required'>*</span>
						</label>
						<div className='input-wrapper'>
							<textarea
								id='question'
								name='question'
								value={formData.question}
								onChange={handleInputChange}
								onFocus={() => setActiveField('question')}
								onBlur={() => setActiveField('')}
								className={`form-field ${
									errors.question ? 'error' : ''
								} ${
									activeField === 'question' ? 'active' : ''
								}`}
								placeholder='Sorunuzu buraya yazın...'
								rows={3}
							/>
							<div className='character-count'>
								{formData.question.length}/500
							</div>
						</div>
						{errors.question && (
							<span className='error-message'>
								{errors.question}
							</span>
						)}
					</div>

					{/* Category Field */}
					<div className='form-group'>
						<label htmlFor='category'>
							Kategori <span className='required'>*</span>
						</label>
						<select
							id='category'
							name='category'
							value={formData.category}
							onChange={handleInputChange}
							onFocus={() => setActiveField('category')}
							onBlur={() => setActiveField('')}
							className={`form-field ${
								errors.category ? 'error' : ''
							} ${activeField === 'category' ? 'active' : ''}`}
						>
							<option value=''>Kategori seçin</option>
							<option value='General Knowledge'>
								Genel Kültür
							</option>
							<option value='Entertainment'>Eğlence</option>
							<option value='Science'>Bilim</option>
							<option value='Mythology'>Mitoloji</option>
							<option value='Sports'>Spor</option>
							<option value='Geography'>Coğrafya</option>
							<option value='History'>Tarih</option>
							<option value='Politics'>Politika</option>
							<option value='Art'>Sanat</option>
							<option value='Celebrities'>Ünlüler</option>
							<option value='Animals'>Hayvanlar</option>
							<option value='Vehicles'>Araçlar</option>
						</select>
						{errors.category && (
							<span className='error-message'>
								{errors.category}
							</span>
						)}
					</div>

					{/* Answer Type Field */}
					<div className='form-group'>
						<label htmlFor='answerType'>Cevap Tipi</label>
						<select
							id='answerType'
							name='answerType'
							value={formData.answerType}
							onChange={handleInputChange}
							className='form-field'
						>
							<option value='multiple'>
								Çoktan Seçmeli (4 seçenek)
							</option>
							<option value='boolean'>Doğru/Yanlış</option>
						</select>
					</div>

					{/* Answers Section */}
					<div className='form-group answers-group'>
						<label>
							Cevaplar <span className='required'>*</span>
						</label>
						<div className='answers-container'>
							{formData.answerType === 'boolean' ? (
								<div className='boolean-answers'>
									{['Doğru', 'Yanlış'].map(
										(option, index) => (
											<div
												key={option}
												className='answer-field'
											>
												<input
													type='radio'
													name='correctAnswer'
													value={option}
													checked={
														formData.correctAnswer ===
														option
													}
													onChange={() =>
														handleCorrectAnswerChange(
															option
														)
													}
													id={`answer-${option.toLowerCase()}`}
												/>
												<label
													htmlFor={`answer-${option.toLowerCase()}`}
												>
													{option}
												</label>
											</div>
										)
									)}
								</div>
							) : (
								<div className='multiple-answers'>
									{formData.answers.map((answer, index) => (
										<div
											key={index}
											className='answer-field'
										>
											<div className='answer-input-group'>
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
													onFocus={() =>
														setActiveField(
															`answer-${index}`
														)
													}
													onBlur={() =>
														setActiveField('')
													}
													placeholder={`Seçenek ${
														index + 1
													}`}
													className={`form-field ${
														errors.answers
															? 'error'
															: ''
													} ${
														activeField ===
														`answer-${index}`
															? 'active'
															: ''
													}`}
													maxLength={100}
												/>
												<input
													type='radio'
													name='correctAnswer'
													value={index}
													checked={
														formData.correctAnswer ===
														index
													}
													onChange={() =>
														handleCorrectAnswerChange(
															index
														)
													}
													id={`answer-${index}`}
													disabled={!answer.trim()}
												/>
												<label
													htmlFor={`answer-${index}`}
													className='correct-label'
												>
													Doğru
												</label>
											</div>
										</div>
									))}
								</div>
							)}
							{errors.answers && (
								<span className='error-message'>
									{errors.answers}
								</span>
							)}
							{errors.correctAnswer && (
								<span className='error-message'>
									{errors.correctAnswer}
								</span>
							)}
						</div>
					</div>

					{/* Difficulty Level Field */}
					<div className='form-group'>
						<label htmlFor='difficulty'>Zorluk Seviyesi</label>
						<select
							id='difficulty'
							name='difficulty'
							value={formData.difficulty}
							onChange={handleInputChange}
							className='form-field'
						>
							<option value='easy'>Kolay</option>
							<option value='medium'>Orta</option>
							<option value='hard'>Zor</option>
						</select>
					</div>

					{/* Author Name Field */}
					<div className='form-group'>
						<label htmlFor='authorName'>
							Adınız <span className='required'>*</span>
						</label>
						<input
							type='text'
							id='authorName'
							name='authorName'
							value={formData.authorName}
							onChange={handleInputChange}
							onFocus={() => setActiveField('authorName')}
							onBlur={() => setActiveField('')}
							className={`form-field ${
								errors.authorName ? 'error' : ''
							} ${activeField === 'authorName' ? 'active' : ''}`}
							placeholder='Adınızı girin'
							maxLength={50}
						/>
						{errors.authorName && (
							<span className='error-message'>
								{errors.authorName}
							</span>
						)}
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className='submit-button'
						disabled={loading}
					>
						{loading ? (
							<div className='loading-spinner'></div>
						) : (
							'Soruyu Gönder'
						)}
					</button>
				</form>
			</div>
		</div>
	);
}

export default SubmitQuiz;
