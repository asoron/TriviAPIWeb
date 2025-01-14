/** @format */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';

const API_URL = 'https://triviapi.onrender.com/api';

function AdminDashboard() {
	const [loading, setLoading] = useState(true);
	const [pendingQuizzes, setPendingQuizzes] = useState([]);
	const [stats, setStats] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [adminData, setAdminData] = useState(null);
	const [loginData, setLoginData] = useState({
		username: '',
		password: '',
	});

	useEffect(() => {
		const token = localStorage.getItem('adminToken');
		const savedAdminData = localStorage.getItem('adminData');

		if (token && savedAdminData) {
			try {
				const parsedAdminData = JSON.parse(savedAdminData);
				setAdminData(parsedAdminData);
				setIsAuthenticated(true);
				loadDashboardData(token);
			} catch (error) {
				console.error('Error parsing admin data:', error);
				handleLogout();
			}
		} else {
			setLoading(false);
		}
	}, []);

	const loadDashboardData = async (token) => {
		try {
			setLoading(true);
			await Promise.all([
				fetchStats(token),
				fetchPendingQuizzes(token, currentPage),
			]);
		} catch (error) {
			console.error('Error loading dashboard data:', error);
			toast.error('Veriler yüklenirken hata oluştu', {
				position: 'bottom-right',
				autoClose: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const loginPayload = {
				username: loginData.username.trim(),
				password: loginData.password.trim(),
			};

			const response = await fetch(`${API_URL}/admin/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(loginPayload),
			});

			const data = await response.json();

			if (response.ok && data.success && data.admin) {
				localStorage.setItem('adminToken', data.token);
				localStorage.setItem('adminData', JSON.stringify(data.admin));
				setAdminData(data.admin);
				setIsAuthenticated(true);
				toast.success('Giriş başarılı!', {
					position: 'bottom-right',
					autoClose: 2000,
				});
				await loadDashboardData(data.token);
			} else {
				throw new Error(data.message || 'Giriş başarısız');
			}
		} catch (error) {
			console.error('Login error:', error);
			toast.error(error.message || 'Bağlantı hatası', {
				position: 'bottom-right',
				autoClose: 3000,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		try {
			localStorage.removeItem('adminToken');
			localStorage.removeItem('adminData');
			setIsAuthenticated(false);
			setAdminData(null);
			setPendingQuizzes([]);
			setStats(null);
			setLoading(false);
			setLoginData({ username: '', password: '' });
			setCurrentPage(1);
			toast.success('Çıkış yapıldı!', {
				position: 'bottom-right',
				autoClose: 2000,
			});
			window.location.href = '/admin';
		} catch (error) {
			console.error('Logout error:', error);
			toast.error('Çıkış yapılırken hata oluştu', {
				position: 'bottom-right',
				autoClose: 3000,
			});
		}
	};

	const checkPermission = (permission) => {
		return adminData?.permissions?.includes(permission) ?? false;
	};

	const handleInputChange = (e) => {
		setLoginData({
			...loginData,
			[e.target.name]: e.target.value,
		});
	};

	const fetchStats = async (token) => {
		try {
			const response = await fetch(`${API_URL}/admin/stats`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			if (data.success) {
				setStats(data.stats);
			} else {
				throw new Error(data.message || 'İstatistikler alınamadı');
			}
		} catch (error) {
			console.error('Stats error:', error);
			throw error;
		}
	};

	const fetchPendingQuizzes = async (token, page = 1) => {
		try {
			const response = await fetch(
				`${API_URL}/admin/quizzes/pending?page=${page}&limit=10`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			const data = await response.json();
			if (data.success) {
				setPendingQuizzes(data.quizzes);
				setTotalPages(data.pagination.totalPages);
				setCurrentPage(data.pagination.page);
			} else {
				throw new Error(data.message || 'Sorular alınamadı');
			}
		} catch (error) {
			console.error('Pending quizzes error:', error);
			throw error;
		}
	};

	const handlePageChange = async (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;
		const token = localStorage.getItem('adminToken');
		await fetchPendingQuizzes(token, newPage);
	};

	const handleQuizAction = async (quizId, action) => {
		if (
			!checkPermission(
				action === 'approve' ? 'approve_quizzes' : 'reject_quizzes'
			)
		) {
			toast.error('Bu işlem için yetkiniz yok', {
				position: 'bottom-right',
				autoClose: 3000,
			});
			return;
		}

		try {
			const token = localStorage.getItem('adminToken');
			const response = await fetch(
				`${API_URL}/admin/quizzes/${quizId}/${action}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						adminId: adminData._id,
						reason:
							action === 'approve' ? 'Onaylandı' : 'Reddedildi',
					}),
				}
			);

			const data = await response.json();

			if (data.success) {
				toast.success(data.message, {
					position: 'bottom-right',
					autoClose: 2000,
				});
				await loadDashboardData(token);
			} else {
				throw new Error(data.message || 'İşlem başarısız');
			}
		} catch (error) {
			console.error('Quiz action error:', error);
			toast.error(
				action === 'approve'
					? 'Soru onaylanırken hata oluştu'
					: 'Soru reddedilirken hata oluştu',
				{
					position: 'bottom-right',
					autoClose: 3000,
				}
			);
		}
	};

	if (loading) {
		return (
			<div className='admin-container'>
				<div className='loading-container'>
					<div className='loading-spinner'></div>
					<div className='loading-text'>Yükleniyor...</div>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className='admin-container'>
				<div className='admin-login'>
					<div className='login-card'>
						<h2 className='login-title'>Yönetici Girişi</h2>
						<form
							onSubmit={handleLogin}
							className='login-form'
						>
							<div className='form-group'>
								<input
									type='text'
									name='username'
									value={loginData.username}
									onChange={handleInputChange}
									placeholder='Kullanıcı Adı'
									className='form-field'
									autoComplete='username'
									required
								/>
							</div>
							<div className='form-group'>
								<input
									type='password'
									name='password'
									value={loginData.password}
									onChange={handleInputChange}
									placeholder='Şifre'
									className='form-field'
									autoComplete='current-password'
									required
								/>
							</div>
							<button
								type='submit'
								className='login-button'
								disabled={loading}
							>
								{loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
							</button>
						</form>
					</div>
				</div>
			</div>
		);
	}

	if (!adminData?.isActive) {
		return (
			<div className='admin-container'>
				<div className='admin-login'>
					<div className='login-card'>
						<h2 className='login-title'>Hesap Devre Dışı</h2>
						<p className='error-message'>
							Yönetici hesabınız devre dışı bırakılmış. Lütfen
							sistem yöneticisi ile iletişime geçin.
						</p>
						<button
							onClick={handleLogout}
							className='logout-button'
						>
							Çıkış Yap
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='admin-container'>
			<div className='admin-dashboard'>
				{/* Stats Sidebar */}
				<aside className='stats-sidebar'>
					<div className='stats-header'>
						<div className='stats-header-icon'>📊</div>
						<h2 className='stats-header-text'>İstatistikler</h2>
					</div>

					<div className='admin-info'>
						<div className='admin-avatar'>
							{adminData?.username.charAt(0).toUpperCase()}
						</div>
						<div className='admin-details'>
							<span className='admin-name'>
								{adminData?.username}
							</span>
							<span className='admin-role'>
								{adminData?.role}
							</span>
						</div>
					</div>

					<div className='stats-grid'>
						<div className='stat-card'>
							<div className='stat-value'>
								{stats?.counts?.pending || 0}
							</div>
							<div className='stat-label'>Bekleyen</div>
						</div>
						<div className='stat-card'>
							<div className='stat-value'>
								{stats?.counts?.approved || 0}
							</div>
							<div className='stat-label'>Onaylanan</div>
						</div>
						<div className='stat-card'>
							<div className='stat-value'>
								{stats?.counts?.rejected || 0}
							</div>
							<div className='stat-label'>Reddedilen</div>
						</div>
						<div className='stat-card'>
							<div className='stat-value'>
								{stats?.counts?.total || 0}
							</div>
							<div className='stat-label'>Toplam</div>
						</div>
					</div>

					{stats?.byCategory && (
						<div className='stats-details'>
							<h3>Kategorilere Göre</h3>
							{stats.byCategory.map((cat) => (
								<div
									key={cat._id}
									className='stat-row'
								>
									<span>
										{cat._id.charAt(0).toUpperCase() +
											cat._id.slice(1)}
									</span>
									<span>{cat.count}</span>
								</div>
							))}
						</div>
					)}

					{stats?.byDifficulty && (
						<div className='stats-details'>
							<h3>Zorluk Seviyesine Göre</h3>
							{stats.byDifficulty.map((diff) => (
								<div
									key={diff._id}
									className='stat-row'
								>
									<span>
										{diff._id.charAt(0).toUpperCase() +
											diff._id.slice(1)}
									</span>
									<span>{diff.count}</span>
								</div>
							))}
						</div>
					)}

					<button
						onClick={handleLogout}
						className='logout-button'
					>
						Çıkış Yap
					</button>
				</aside>

				{/* Main Content */}
				<main className='admin-paper'>
					<h1 className='admin-title'>Yönetici Paneli</h1>
					<p className='admin-subtitle'>
						Bekleyen soruları onaylayın veya reddedin
					</p>

					<div className='pending-quizzes'>
						{pendingQuizzes.length === 0 ? (
							<div className='no-quizzes'>
								<p>Bekleyen soru bulunmamaktadır.</p>
							</div>
						) : (
							<>
								{pendingQuizzes.map((quiz) => (
									<div
										key={quiz._id}
										className='quiz-card'
									>
										<div className='quiz-meta'>
											<div className='quiz-author'>
												<div className='author-avatar'>
													{quiz.author
														.charAt(0)
														.toUpperCase()}
												</div>
												<span>{quiz.author}</span>
											</div>

											<div
												className={`quiz-difficulty ${quiz.difficulty}`}
											>
												<div className='difficulty-icon'>
													{quiz.difficulty === 'kolay'
														? '🎯'
														: quiz.difficulty ===
														  'orta'
														? '⚡'
														: '🔥'}
												</div>
												<span>
													{quiz.difficulty === 'kolay'
														? 'Kolay'
														: quiz.difficulty ===
														  'orta'
														? 'Orta'
														: 'Zor'}
												</span>
											</div>

											<div className='quiz-category'>
												<span>
													{quiz.category
														.charAt(0)
														.toUpperCase() +
														quiz.category.slice(1)}
												</span>
											</div>
										</div>

										<div className='quiz-question'>
											{quiz.question}
										</div>

										<div className='quiz-answers'>
											{quiz.type === 'multiple' ? (
												quiz.answers.map(
													(answer, index) => (
														<div
															key={index}
															className={`answer ${
																index ===
																quiz.correctAnswer
																	? 'correct'
																	: ''
															}`}
														>
															{answer}
															{index ===
																quiz.correctAnswer &&
																' ✓'}
														</div>
													)
												)
											) : (
												<div className='boolean-answer'>
													Doğru Cevap:{' '}
													{quiz.correctAnswer === 0
														? 'Doğru'
														: 'Yanlış'}
												</div>
											)}
										</div>

										<div className='action-buttons'>
											{checkPermission(
												'approve_quizzes'
											) && (
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
											)}
											{checkPermission(
												'reject_quizzes'
											) && (
												<button
													className='action-button reject-button'
													onClick={() =>
														handleQuizAction(
															quiz._id,
															'reject'
														)
													}
												>
													Reddet
												</button>
											)}
										</div>
									</div>
								))}

								{/* Pagination */}
								{totalPages > 1 && (
									<div className='pagination'>
										<button
											onClick={() =>
												handlePageChange(
													currentPage - 1
												)
											}
											disabled={currentPage === 1}
											className='pagination-button'
										>
											← Önceki
										</button>
										<span className='page-info'>
											Sayfa {currentPage} / {totalPages}
										</span>
										<button
											onClick={() =>
												handlePageChange(
													currentPage + 1
												)
											}
											disabled={
												currentPage === totalPages
											}
											className='pagination-button'
										>
											Sonraki →
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

export default AdminDashboard;
