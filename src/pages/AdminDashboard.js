/** @format */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
	const [pendingQuizzes, setPendingQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPendingQuizzes();
	}, []);

	const fetchPendingQuizzes = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/quizzes/pending');
			const data = await response.json();

			if (response.ok) {
				setPendingQuizzes(data);
			} else {
				toast.error('Bekleyen sorular yüklenirken hata oluştu');
			}
		} catch (error) {
			console.error('Error fetching pending quizzes:', error);
			toast.error('Bekleyen sorular yüklenirken hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	const handleQuizAction = async (quizId, action) => {
		try {
			const response = await fetch(`/api/quizzes/${quizId}/${action}`, {
				method: 'POST',
			});

			if (response.ok) {
				toast.success(
					action === 'approve' ? 'Soru onaylandı' : 'Soru reddedildi'
				);
				fetchPendingQuizzes();
			} else {
				toast.error('İşlem sırasında bir hata oluştu');
			}
		} catch (error) {
			console.error('Error handling quiz action:', error);
			toast.error('İşlem sırasında bir hata oluştu');
		}
	};

	return (
		<div className='admin-container'>
			<div className='admin-paper'>
				<div className='admin-header'>
					<h1 className='admin-title'>Yönetici Paneli</h1>
					<p className='admin-description'>
						Kullanıcılar tarafından gönderilen soruları inceleyin ve
						onaylayın.
					</p>
				</div>

				{loading ? (
					<div className='loading-container'>
						<div className='loading-spinner'></div>
					</div>
				) : pendingQuizzes.length > 0 ? (
					<div className='pending-quizzes'>
						{pendingQuizzes.map((quiz) => (
							<div
								key={quiz._id}
								className='quiz-card'
							>
								<div className='quiz-header'>
									<div className='quiz-info'>
										<h2 className='quiz-question'>
											{quiz.question}
										</h2>
										<div className='quiz-meta'>
											<span className='quiz-tag'>
												{quiz.category ===
												'General Knowledge'
													? 'Genel Kültür'
													: quiz.category ===
													  'Entertainment'
													? 'Eğlence'
													: quiz.category ===
													  'Science'
													? 'Bilim'
													: quiz.category ===
													  'Mythology'
													? 'Mitoloji'
													: quiz.category === 'Sports'
													? 'Spor'
													: quiz.category ===
													  'Geography'
													? 'Coğrafya'
													: quiz.category ===
													  'History'
													? 'Tarih'
													: quiz.category ===
													  'Politics'
													? 'Politika'
													: quiz.category === 'Art'
													? 'Sanat'
													: quiz.category ===
													  'Celebrities'
													? 'Ünlüler'
													: quiz.category ===
													  'Animals'
													? 'Hayvanlar'
													: quiz.category ===
													  'Vehicles'
													? 'Araçlar'
													: quiz.category}
											</span>
											<span className='quiz-tag'>
												{quiz.difficulty === 'easy'
													? 'Kolay'
													: quiz.difficulty ===
													  'medium'
													? 'Orta'
													: quiz.difficulty === 'hard'
													? 'Zor'
													: quiz.difficulty}
											</span>
											<span className='quiz-tag'>
												{quiz.answerType === 'boolean'
													? 'Doğru/Yanlış'
													: 'Çoktan Seçmeli'}
											</span>
										</div>
									</div>
								</div>

								<div className='quiz-answers'>
									{quiz.answers.map((answer, index) => (
										<div
											key={index}
											className={`answer-item ${
												index === quiz.correctAnswer
													? 'correct'
													: ''
											}`}
										>
											<div className='answer-number'>
												{index + 1}
											</div>
											<div className='answer-text'>
												{answer}
											</div>
										</div>
									))}
								</div>

								<div className='quiz-info'>
									<span className='author-text'>
										Yazar:{' '}
										<span className='author-name'>
											{quiz.authorName}
										</span>
									</span>
								</div>

								<div className='quiz-actions'>
									<button
										className='action-button approve-button'
										onClick={() =>
											handleQuizAction(
												quiz._id,
												'approve'
											)
										}
									>
										Onayla
									</button>
									<button
										className='action-button reject-button'
										onClick={() =>
											handleQuizAction(quiz._id, 'reject')
										}
									>
										Reddet
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='no-quizzes'>
						Bekleyen soru bulunmamaktadır.
					</div>
				)}
			</div>
		</div>
	);
}

export default AdminDashboard;
