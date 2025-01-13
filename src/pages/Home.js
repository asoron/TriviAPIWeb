/** @format */

import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const features = [
	{
		title: 'RESTful API',
		description:
			'Kapsamlı soru bankamıza basit ve sezgisel REST API üzerinden erişin. Web ve mobil uygulamalar için mükemmel çözüm.',
		icon: '🔌',
		color: '#FF4081',
		gradient: 'linear-gradient(135deg, #FF4081 0%, #C51162 100%)',
		highlights: [
			'Kolay entegrasyon',
			'Detaylı dokümantasyon',
			'Güvenilir performans',
		],
	},
	{
		title: 'Çoklu Format',
		description:
			'Hem çoktan seçmeli hem de doğru/yanlış soruları destekler. Kategori, zorluk veya türe göre kolayca filtreleme yapın.',
		icon: '🎯',
		color: '#7C4DFF',
		gradient: 'linear-gradient(135deg, #7C4DFF 0%, #512DA8 100%)',
		highlights: ['Çoktan seçmeli', 'Doğru/Yanlış', 'Özel kategoriler'],
	},
	{
		title: 'Geliştirici Araçları',
		description:
			'Kapsamlı dokümantasyon, test ortamı ve soru içeriğinizi yönetmek için kontrol paneli.',
		icon: '🛠️',
		color: '#00BFA5',
		gradient: 'linear-gradient(135deg, #00BFA5 0%, #00796B 100%)',
		highlights: ['Test ortamı', 'API paneli', 'Gerçek zamanlı analitik'],
	},
];

const apiFeatures = [
	{
		title: 'Kolay Entegrasyon',
		description: 'Basit HTTP istekleri ve JSON yanıtları',
		icon: '🔄',
		color: '#FF4081',
		gradient: 'linear-gradient(135deg, #FF4081 0%, #C51162 100%)',
		code: 'GET /api/v1/questions',
	},
	{
		title: 'Özel Filtreler',
		description: 'Kategori, zorluk ve türe göre filtreleme',
		icon: '🔍',
		color: '#7C4DFF',
		gradient: 'linear-gradient(135deg, #7C4DFF 0%, #512DA8 100%)',
		code: 'GET /api/v1/questions?category=science',
	},
	{
		title: 'Hız Sınırı',
		description: 'Ücretsiz paket için saatte 1000 istek',
		icon: '⚡',
		color: '#00BFA5',
		gradient: 'linear-gradient(135deg, #00BFA5 0%, #00796B 100%)',
		code: 'X-RateLimit-Remaining: 985',
	},
	{
		title: 'CORS Destekli',
		description: 'Kolay geliştirme için tüm kaynaklardan erişim',
		icon: '🌐',
		color: '#FF4081',
		gradient: 'linear-gradient(135deg, #FF4081 0%, #C51162 100%)',
		code: 'Access-Control-Allow-Origin: *',
	},
	{
		title: 'Sürüm Kontrolü',
		description: 'Geriye dönük uyumlu kararlı API sürümleri',
		icon: '📦',
		color: '#7C4DFF',
		gradient: 'linear-gradient(135deg, #7C4DFF 0%, #512DA8 100%)',
		code: 'api.triviapi.com/v1/',
	},
	{
		title: 'Anlık Güncellemeler',
		description: 'Veritabanına düzenli olarak yeni sorular eklenir',
		icon: '🔄',
		color: '#00BFA5',
		gradient: 'linear-gradient(135deg, #00BFA5 0%, #00796B 100%)',
		code: 'WebSocket bağlantısı aktif',
	},
];

const codeExample = `
fetch('https://api.triviapi.com/v1/random', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));
`;

const Home = () => {
	const [activeFeature, setActiveFeature] = useState(0);
	const featuresRef = useRef(null);
	const apiFeaturesRef = useRef(null);
	const codeRef = useRef(null);
	const ctaRef = useRef(null);

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
							<span className='hero-feature-icon'>🎲</span>
							<span className='hero-feature-text'>
								Çoklu Kategoriler
							</span>
						</div>
						<div className='hero-feature'>
							<span className='hero-feature-icon'>⚡</span>
							<span className='hero-feature-text'>
								Anlık Güncellemeler
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
				<h2 className='section-title'>Hızlı Başlangıç</h2>
				<div className='code-example-container'>
					<pre className='code-example'>
						<code>{codeExample}</code>
					</pre>
					<div className='code-example-description'>
						<h3>Basit ve Hızlı</h3>
						<p>
							Sadece birkaç satır kod ile API'mizi kullanmaya
							başlayın. Modern web standartlarına uygun, güvenilir
							ve hızlı.
						</p>
						<Link
							to='/browse'
							className='code-example-button'
						>
							<span>Dokümantasyonu İncele</span>
							<span className='button-icon'>📚</span>
						</Link>
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
		</div>
	);
};

export default Home;
