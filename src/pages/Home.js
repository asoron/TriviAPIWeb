/** @format */

import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const features = [
	{
		title: 'RESTful API',
		description:
			'Modern ve sezgisel REST API ile trivia sorularına erişin. Çoktan seçmeli ve doğru/yanlış formatlarında, farklı zorluk seviyelerinde sorular.',
		icon: '🔌',
		color: '#FF4081',
		gradient: 'linear-gradient(135deg, #FF4081 0%, #C51162 100%)',
		highlights: [
			'Kolay entegrasyon',
			'Detaylı dokümantasyon',
			'JSON yanıtlar',
		],
	},
	{
		title: 'Çoklu Filtreleme',
		description:
			'Kategori, tür ve zorluk seviyesine göre soruları filtreleme. Her soru için yazar ve oluşturulma tarihi bilgisi.',
		icon: '🎯',
		color: '#7C4DFF',
		gradient: 'linear-gradient(135deg, #7C4DFF 0%, #512DA8 100%)',
		highlights: [
			'Kategori filtreleme',
			'Zorluk seviyeleri',
			'Detaylı bilgiler',
		],
	},
	{
		title: 'Yönetim Paneli',
		description:
			'Soru ekleyin, onaylayın ve istatistikleri takip edin. Kullanıcı dostu arayüz ile içerik yönetimi.',
		icon: '🛠️',
		color: '#00BFA5',
		gradient: 'linear-gradient(135deg, #00BFA5 0%, #00796B 100%)',
		highlights: ['Soru yönetimi', 'İstatistikler', 'Onay sistemi'],
	},
];

const apiFeatures = [
	{
		title: 'Rastgele Soru',
		description: 'Filtrelere göre onaylanmış sorulardan rastgele getirme',
		icon: '🎲',
		color: '#FF4081',
		gradient: 'linear-gradient(135deg, #FF4081 0%, #C51162 100%)',
		code: 'GET /quizzes/random',
	},
	{
		title: 'Soru Ekleme',
		description: 'Yeni soru ekleyip onaya gönderme',
		icon: '➕',
		color: '#7C4DFF',
		gradient: 'linear-gradient(135deg, #7C4DFF 0%, #512DA8 100%)',
		code: 'POST /quizzes',
	},
	{
		title: 'İstatistikler',
		description: 'Detaylı soru istatistikleri',
		icon: '📊',
		color: '#00BFA5',
		gradient: 'linear-gradient(135deg, #00BFA5 0%, #00796B 100%)',
		code: 'GET /quizzes/stats',
	},
	{
		title: 'Filtreleme',
		description: 'Kategori, tür ve zorluk seviyesine göre filtreleme',
		icon: '🔍',
		color: '#FF4081',
		gradient: 'linear-gradient(135deg, #FF4081 0%, #C51162 100%)',
		code: '?category=tarih&difficulty=orta',
	},
	{
		title: 'Kategoriler',
		description: 'Mevcut kategorileri listeleme',
		icon: '📑',
		color: '#7C4DFF',
		gradient: 'linear-gradient(135deg, #7C4DFF 0%, #512DA8 100%)',
		code: 'GET /quizzes/categories',
	},
	{
		title: 'Başarılı Yanıtlar',
		description: 'Her yanıtta başarı durumu ve mesaj',
		icon: '✨',
		color: '#00BFA5',
		gradient: 'linear-gradient(135deg, #00BFA5 0%, #00796B 100%)',
		code: '{ "success": true, "message": "..." }',
	},
];

const codeExample = `
// Rastgele bir soru getirme örneği
fetch('https://triviapi.onrender.com/api/quizzes/random?difficulty=orta', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    const quiz = data.quiz;
    console.log('Soru:', quiz.question);
    console.log('Kategori:', quiz.category);
    console.log('Zorluk:', quiz.difficulty);
    console.log('Cevaplar:', quiz.answers);
  }
});
`;

const Home = () => {
	const [activeFeature, setActiveFeature] = useState(0);
	const featuresRef = useRef(null);
	const apiFeaturesRef = useRef(null);
	const codeRef = useRef(null);
	const ctaRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const observerOptions = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		};

		const handleIntersect = (entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		};

		const observer = new IntersectionObserver(
			handleIntersect,
			observerOptions
		);
		const refs = [featuresRef, apiFeaturesRef, codeRef, ctaRef];

		refs.forEach((ref) => {
			if (ref.current) {
				observer.observe(ref.current);
			}
		});

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveFeature((prev) => (prev + 1) % features.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleDocClick = () => {
		navigate('/docs');
	};

	return (
		<div className='home-container'>
			<section className='hero-section'>
				<div className='hero-content'>
					<div className='hero-badge'>
						<span className='badge-icon'>⚡</span>
						<span className='badge-text'>
							Güçlü Soru Bankası API
						</span>
					</div>
					<h1 className='hero-title'>
						<span className='title-highlight'>Trivia API</span>{' '}
						Geliştiriciler İçin
					</h1>
					<p className='hero-subtitle'>
						Uygulamalarınıza ilgi çekici soru içeriği ekleyin. Basit
						ve güçlü API'miz ile birden çok kategoride binlerce
						doğrulanmış soruya erişin.
					</p>
					<div className='hero-features'>
						<div className='hero-feature'>
							<span className='hero-feature-icon'>🎯</span>
							<span className='hero-feature-text'>
								1000+ Soru
							</span>
						</div>
						<div className='hero-feature'>
							<span className='hero-feature-icon'>🎯</span>
							<span className='hero-feature-text'>
								Çoklu Kategoriler
							</span>
						</div>
						<div className='hero-feature'>
							<span className='hero-feature-icon'>🎲</span>
							<span className='hero-feature-text'>
								3 Zorluk Seviyesi
							</span>
						</div>
						<div className='hero-feature'>
							<span className='hero-feature-icon'>⚡</span>
							<span className='hero-feature-text'>
								Hızlı Yanıtlar
							</span>
						</div>
					</div>
					<div className='hero-actions'>
						<Link
							to='/browse'
							className='primary-button'
						>
							<span className='button-icon'>🚀</span>
							<span className='button-text'>Hemen Dene</span>
							<span className='button-shine'></span>
						</Link>
						<Link
							to='/submit'
							className='secondary-button'
						>
							<span className='button-icon'>➕</span>
							<span className='button-text'>Soru Ekle</span>
						</Link>
					</div>
					<a
						href='https://github.com/asoron'
						target='_blank'
						rel='noopener noreferrer'
						className='author-link'
					>
						<div className='author-badge'>
							<div className='author-avatar'>👨‍💻</div>
							<div className='author-info'>
								<div className='author-name'>@asoron</div>
								<div className='author-role'>Developer</div>
							</div>
						</div>
					</a>
					<div className='hero-background'>
						<div className='hero-glow'></div>
						<div className='hero-shapes'></div>
					</div>
				</div>
			</section>

			<section
				className='features-section'
				ref={featuresRef}
			>
				<div className='section-background'></div>
				<h2 className='section-title'>Temel Özellikler</h2>
				<div className='features-container'>
					<div className='features-nav'>
						{features.map((feature, index) => (
							<button
								key={index}
								className={`feature-nav-item ${
									index === activeFeature ? 'active' : ''
								}`}
								onClick={() => setActiveFeature(index)}
								style={{
									'--accent-color': feature.color,
									'--accent-gradient': feature.gradient,
								}}
							>
								<div className='feature-nav-icon'>
									{feature.icon}
								</div>
								<span className='feature-nav-title'>
									{feature.title}
								</span>
							</button>
						))}
					</div>
					<div className='feature-content-wrapper'>
						{features.map((feature, index) => (
							<div
								key={index}
								className={`feature-content ${
									index === activeFeature ? 'active' : ''
								}`}
								style={{
									'--accent-color': feature.color,
									'--accent-gradient': feature.gradient,
								}}
							>
								<div className='feature-header'>
									<div className='feature-icon'>
										{feature.icon}
									</div>
									<h3 className='feature-title'>
										{feature.title}
									</h3>
								</div>
								<p className='feature-description'>
									{feature.description}
								</p>
								<ul className='feature-highlights'>
									{feature.highlights.map(
										(highlight, idx) => (
											<li
												key={idx}
												className='feature-highlight-item'
											>
												<span className='highlight-icon'>
													✓
												</span>
												{highlight}
											</li>
										)
									)}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			<section
				className='api-features-section'
				ref={apiFeaturesRef}
			>
				<h2 className='section-title'>API Özellikleri</h2>
				<div className='api-features-grid'>
					{apiFeatures.map((feature, index) => (
						<div
							key={index}
							className='api-feature-card'
							style={{
								'--accent-color': feature.color,
								'--accent-gradient': feature.gradient,
							}}
						>
							<div className='api-feature-icon'>
								{feature.icon}
							</div>
							<h3 className='api-feature-title'>
								{feature.title}
							</h3>
							<p className='api-feature-description'>
								{feature.description}
							</p>
							<div className='api-feature-code'>
								<code>{feature.code}</code>
							</div>
						</div>
					))}
				</div>
			</section>

			<section
				className='code-example-section'
				ref={codeRef}
			>
				<div className='code-example-container'>
					<div className='code-example'>
						<div className='code-line code-comment'>
							// API'den belirli zorluktaki bir soru almak için
						</div>
						<div className='code-line'>
							<span className='code-keyword'>const</span> response
							= <span className='code-keyword'>await</span> fetch(
							<span className='code-string'>
								'https://triviapi.onrender.com/api/quizzes/random?difficulty=kolay'
							</span>
							);
						</div>
						<div className='code-line'>
							<span className='code-keyword'>const</span> quiz ={' '}
							<span className='code-keyword'>await</span>{' '}
							response.json();
						</div>
						<div className='code-line code-comment'>
							// Soru detaylarını görüntüle
						</div>
						<div className='code-line'>
							console.log(quiz.question); // Soru metni
						</div>
						<div className='code-line'>
							console.log(quiz.difficulty); // Zorluk seviyesi
						</div>
						<div className='code-line'>
							console.log(quiz.answers); // Cevap seçenekleri
						</div>
						<div className='code-line code-comment'>
							// Doğru cevabı kontrol et
						</div>
						<div className='code-line'>
							<span className='code-keyword'>const</span>{' '}
							isCorrect = userAnswer === quiz.correctAnswer;
						</div>
					</div>
					<div className='code-example-description'>
						<h3>Hızlı Başlangıç</h3>
						<p>
							Sadece birkaç satır kodla API'yi projenize entegre
							edin. Modern ve kullanımı kolay REST API'miz ile
							trivia sorularını hızlıca uygulamanıza ekleyin.
						</p>
						<a
							href='/docs'
							className='code-example-button'
						>
							<span>📚</span>
							<span>Dokümantasyonu İncele</span>
						</a>
					</div>
				</div>
			</section>

			<section
				className='cta-section'
				ref={ctaRef}
			>
				<div className='cta-content'>
					<h2 className='cta-title'>Hemen Başlayın</h2>
					<p className='cta-description'>
						Ücretsiz hesabınızı oluşturun ve API'mizi kullanmaya
						başlayın. İhtiyacınız olan tüm araçlar hazır.
					</p>
					<div className='cta-actions'>
						<Link
							to='/browse'
							className='cta-button primary'
						>
							<span>Soruları İncele</span>
							<span className='button-icon'>🎯</span>
						</Link>
						<Link
							to='/submit'
							className='cta-button secondary'
						>
							<span>Soru Ekle</span>
							<span className='button-icon'>✨</span>
						</Link>
					</div>
				</div>
			</section>

			<section className='docs-preview'>
				<div className='section-header'>
					<h2>Dokümantasyon</h2>
					<p>
						API'yi kullanmaya başlamadan önce dokümantasyonu
						inceleyin.
					</p>
				</div>
				<div className='code-examples'>
					{apiFeatures.map((feature, index) => (
						<div
							key={index}
							className='feature-highlight'
							onClick={handleDocClick}
							style={{ cursor: 'pointer' }}
						>
							<div
								className='feature-icon'
								style={{
									background: feature.gradient,
								}}
							>
								{feature.icon}
							</div>
							<div className='feature-content'>
								<h3>{feature.title}</h3>
								<p>{feature.description}</p>
								<code>{feature.code}</code>
							</div>
						</div>
					))}
				</div>
				<button
					onClick={handleDocClick}
					className='view-docs-button'
				>
					Dokümantasyonu İncele
				</button>
			</section>
		</div>
	);
};

export default Home;
