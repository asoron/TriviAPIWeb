/** @format */

import React from 'react';
import '../styles/Documentation.css';

const renderJsonExample = (title, code) => (
	<div className='code-example'>
		<div className='code-header'>
			<div className='code-badge'>
				<i className='fas fa-code'></i>
				{title}
			</div>
		</div>
		<div className='code-content'>
			<pre>
				<code dangerouslySetInnerHTML={{ __html: formatJson(code) }} />
			</pre>
		</div>
	</div>
);

const formatCurl = (code) => {
	return code
		.replace(/(curl)/g, '<span class="curl">$1</span>')
		.replace(/(-X \w+)/g, '<span class="curl-method">$1</span>')
		.replace(/(https?:\/\/[^\s"]+)/g, '<span class="curl-url">$1</span>')
		.replace(/(-H "[^"]+")/g, '<span class="curl-header">$1</span>')
		.replace(/(-d '\{[^}]+\}')/g, '<span class="curl-data">$1</span>');
};

const renderCurlExample = (title, code) => (
	<div className='code-example'>
		<div className='code-header'>
			<div className='code-badge'>
				<i className='fas fa-terminal'></i>
				{title}
			</div>
		</div>
		<div className='code-content'>
			<pre>
				<code dangerouslySetInnerHTML={{ __html: formatCurl(code) }} />
			</pre>
		</div>
	</div>
);

const formatJson = (json) => {
	const stringified = JSON.stringify(json, null, 2);
	let colored = stringified
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	// Add spans for different parts
	colored = colored
		// Keys
		.replace(
			/"([^"]+)":/g,
			'<span class="json-key">"$1"</span><span class="json-punctuation">:</span>'
		)
		// String values in arrays and objects
		.replace(/: ?"([^"]+)"/g, ': <span class="json-string">"$1"</span>')
		.replace(/^( *)"([^"]+)"/gm, '$1<span class="json-string">"$2"</span>')
		// Numbers
		.replace(/: (\d+)/g, ': <span class="json-number">$1</span>')
		.replace(/^( *)(\d+)/gm, '$1<span class="json-number">$2</span>')
		// Booleans
		.replace(/: (true|false)/g, ': <span class="json-boolean">$1</span>')
		// Null
		.replace(/: (null)/g, ': <span class="json-null">$1</span>')
		// Brackets and braces
		.replace(/([{}\[\]])/g, '<span class="json-bracket">$1</span>')
		// Commas
		.replace(/,$/gm, '<span class="json-punctuation">,</span>');

	return colored;
};

const Documentation = () => {
	return (
		<div className='docs-container'>
			<div className='docs-background'>
				<div className='docs-glow'></div>
				<div className='docs-shapes'></div>
			</div>
			<div className='docs-paper'>
				<div className='docs-header'>
					<div className='docs-badge'>
						<span className='badge-icon'>📚</span>
						<span className='badge-text'>API Dokümantasyonu</span>
					</div>
					<h1 className='docs-title'>
						<span className='title-highlight'>TriviAPI</span>{' '}
						Geliştirici Rehberi
					</h1>
					<p className='docs-subtitle'>
						Trivia soruları için modern, hızlı ve kullanımı kolay
						bir REST API. Hemen entegre edin ve uygulamanızı
						güçlendirin.
					</p>
					<div className='feature-badges'>
						<div className='feature-badge'>
							<span className='feature-icon'>🚀</span>
							<span className='feature-text'>Hızlı Yanıtlar</span>
						</div>
						<div className='feature-badge'>
							<span className='feature-icon'>🔒</span>
							<span className='feature-text'>
								API Key Gerektirmez
							</span>
						</div>
						<div className='feature-badge'>
							<span className='feature-icon'>🌐</span>
							<span className='feature-text'>CORS Destekli</span>
						</div>
					</div>
				</div>

				<section className='docs-section'>
					<div className='section-header'>
						<div className='section-icon'>🔌</div>
						<h2>Genel Bilgiler</h2>
					</div>
					<p>
						TriviAPI, trivia soruları için ücretsiz ve açık bir
						API'dir. API anahtarı gerektirmez ve tüm istekler için
						temel URL:
					</p>
					<div className='code-example'>
						<div className='code-header'>
							<span className='code-badge'>Base URL</span>
						</div>
						<div className='code-content'>
							<pre>
								<code className='curl-url'>
									https://triviapi.onrender.com/api
								</code>
							</pre>
						</div>
					</div>
					<div className='info-grid'>
						<div className='info-card'>
							<div className='info-icon'>⚡</div>
							<h4>Rate Limiting</h4>
							<p>IP başına dakikada 30 istek</p>
						</div>
						<div className='info-card'>
							<div className='info-icon'>📦</div>
							<h4>Response Format</h4>
							<p>JSON / UTF-8</p>
						</div>
						<div className='info-card'>
							<div className='info-icon'>🔄</div>
							<h4>HTTP Methods</h4>
							<p>GET, POST</p>
						</div>
					</div>
					<div className='code-example'>
						<div className='code-header'>
							<span className='code-badge'>Response Format</span>
						</div>
						<div className='code-content'>
							<pre>
								<code
									dangerouslySetInnerHTML={{
										__html: formatJson({
											success: 'true/false',
											message: 'İşlem durumu mesajı',
											data: '/* Yanıt verileri */',
										}),
									}}
								/>
							</pre>
						</div>
					</div>
				</section>

				<section className='docs-section'>
					<div className='section-header'>
						<div className='section-icon'>🎯</div>
						<h2>Soru İşlemleri</h2>
					</div>

					<div className='endpoint'>
						<div className='endpoint-header'>
							<div className='endpoint-badge'>GET</div>
							<h3>Rastgele Soru Getirme</h3>
						</div>
						<code className='endpoint-url'>/quizzes/random</code>
						<p>
							Onaylanmış sorular arasından rastgele bir soru
							getirir. İsteğe bağlı filtreler ile belirli
							kriterlere uygun sorular alabilirsiniz.
						</p>

						<div className='params-section'>
							<h4>
								<span className='params-icon'>🔍</span>
								Query Parametreleri
							</h4>
							<ul className='params-list'>
								<li>
									<code>category</code>
									<span className='param-desc'>
										Belirli bir kategoriden soru (örn:
										tarih, bilim, spor, sanat, teknoloji)
									</span>
									<span className='param-type'>optional</span>
								</li>
								<li>
									<code>type</code>
									<span className='param-desc'>
										Soru tipi ('multiple' veya 'boolean')
									</span>
									<span className='param-type'>optional</span>
								</li>
								<li>
									<code>difficulty</code>
									<span className='param-desc'>
										Zorluk seviyesi ('kolay', 'orta' veya
										'zor')
									</span>
									<span className='param-type'>optional</span>
								</li>
							</ul>
						</div>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>📝</span>
								Örnek İstek
							</h4>
							{renderCurlExample(
								'CURL Örneği',
								`curl -X GET "https://triviapi.onrender.com/api/quizzes/random?category=tarih&difficulty=orta&type=multiple" \\
-H "Content-Type: application/json"`
							)}
						</div>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>✨</span>
								Başarılı Yanıt
							</h4>
							{renderJsonExample('200 OK', {
								success: true,
								message: 'Soru başarıyla getirildi',
								quiz: {
									_id: '65a123456789...',
									question:
										"Türkiye Cumhuriyeti'nin kuruluş yılı nedir?",
									type: 'multiple',
									category: 'tarih',
									difficulty: 'orta',
									answers: ['1920', '1923', '1924', '1926'],
									correctAnswer: 1,
									author: 'asoron',
									status: 'approved',
									createdAt: '2024-01-12T12:00:00.000Z',
									updatedAt: '2024-01-12T12:00:00.000Z',
								},
							})}
						</div>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>❌</span>
								Hata Yanıtı
							</h4>
							{renderJsonExample('404 Not Found', {
								success: false,
								message:
									'Belirtilen kriterlere uygun soru bulunamadı',
								error: 'NOT_FOUND',
							})}
						</div>
					</div>

					<div className='endpoint'>
						<div className='endpoint-header'>
							<div className='endpoint-badge post'>POST</div>
							<h3>Soru Ekleme</h3>
						</div>
						<code className='endpoint-url'>/quizzes</code>
						<p>
							Yeni bir soru ekler. Eklenen sorular önce onay
							sürecine girer. Onaylanan sorular API üzerinden
							erişilebilir hale gelir.
						</p>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>📝</span>
								İstek Gövdesi
							</h4>
							<div className='code-example'>
								<div className='code-header'>
									<span className='code-badge'>JSON</span>
								</div>
								<div className='code-content'>
									<pre>
										<code
											dangerouslySetInnerHTML={{
												__html: formatJson({
													question:
														'Soru metni (en az 10 karakter)',
													type: 'multiple veya boolean',
													category: 'kategori adı',
													difficulty:
														'kolay, orta veya zor',
													answers: [
														'cevap1',
														'cevap2',
														'cevap3',
														'cevap4',
													],
													correctAnswer:
														'0-3 arası sayı',
													author: 'yazar adı',
												}),
											}}
										/>
									</pre>
								</div>
							</div>
						</div>

						<div className='validation-section'>
							<h4>
								<span className='validation-icon'>✅</span>
								Validasyon Kuralları
							</h4>
							<ul className='validation-rules'>
								<li>
									<span className='rule-label'>Soru</span>
									<span className='rule-text'>
										En az 10 karakter uzunluğunda olmalıdır
									</span>
								</li>
								<li>
									<span className='rule-label'>Tip</span>
									<span className='rule-text'>
										'multiple' veya 'boolean' olmalıdır
									</span>
								</li>
								<li>
									<span className='rule-label'>Kategori</span>
									<span className='rule-text'>
										Geçerli kategorilerden biri olmalıdır
									</span>
								</li>
								<li>
									<span className='rule-label'>Zorluk</span>
									<span className='rule-text'>
										'kolay', 'orta' veya 'zor' olmalıdır
									</span>
								</li>
								<li>
									<span className='rule-label'>Cevaplar</span>
									<span className='rule-text'>
										Multiple choice için 4, boolean için 2
										cevap
									</span>
								</li>
							</ul>
						</div>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>📝</span>
								Örnek İstek
							</h4>
							{renderCurlExample(
								'CURL Örneği',
								`curl -X POST "https://triviapi.onrender.com/api/quizzes" \\
-H "Content-Type: application/json" \\
-d '{
	"question": "Türkiye Cumhuriyeti'nin kuruluş yılı nedir?",
	"type": "multiple",
	"category": "tarih",
	"difficulty": "orta",
	"answers": ["1920", "1923", "1924", "1926"],
	"correctAnswer": 1,
	"author": "asoron"
}'`
							)}
						</div>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>✨</span>
								Başarılı Yanıt
							</h4>
							{renderJsonExample('201 Created', {
								success: true,
								message: 'Soru başarıyla eklendi',
								quiz: {
									_id: '65a123456789...',
									question:
										"Türkiye Cumhuriyeti'nin kuruluş yılı nedir?",
									type: 'multiple',
									category: 'tarih',
									difficulty: 'orta',
									answers: ['1920', '1923', '1924', '1926'],
									correctAnswer: 1,
									author: 'asoron',
									status: 'pending',
									createdAt: '2024-01-12T12:00:00.000Z',
									updatedAt: '2024-01-12T12:00:00.000Z',
								},
							})}
						</div>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>❌</span>
								Validasyon Hatası
							</h4>
							{renderJsonExample('400 Bad Request', {
								success: false,
								message: 'Validasyon hatası',
								errors: [
									'Soru en az 10 karakter olmalıdır',
									"Geçersiz kategori: 'teknoloji1'",
									'Multiple choice sorular için 4 cevap gereklidir',
									'correctAnswer 0-3 arasında olmalıdır',
								],
							})}
						</div>
					</div>
				</section>

				<section className='docs-section'>
					<div className='section-header'>
						<div className='section-icon'>📊</div>
						<h2>İstatistik ve Kategori İşlemleri</h2>
					</div>

					<div className='endpoint'>
						<div className='endpoint-header'>
							<div className='endpoint-badge'>GET</div>
							<h3>İstatistikleri Getirme</h3>
						</div>
						<code className='endpoint-url'>/quizzes/stats</code>
						<p>
							Genel soru istatistiklerini getirir. Toplam soru
							sayısı, kategori ve zorluk seviyesine göre
							dağılımlar gibi detaylı istatistikler sunar.
						</p>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>📝</span>
								Örnek İstek
							</h4>
							{renderCurlExample(
								'CURL Örneği',
								`curl -X GET "https://triviapi.onrender.com/api/quizzes/stats" \\
-H "Content-Type: application/json"`
							)}
						</div>

						<div className='example-section'>
							<h4>
								<span className='example-icon'>✨</span>
								Başarılı Yanıt
							</h4>
							{renderJsonExample('200 OK', {
								success: true,
								message: 'İstatistikler başarıyla getirildi',
								stats: {
									total: 100,
									byCategory: [
										{
											category: 'tarih',
											count: 30,
											icon: '📚',
										},
										{
											category: 'bilim',
											count: 25,
											icon: '🔬',
										},
										{
											category: 'spor',
											count: 20,
											icon: '⚽',
										},
										{
											category: 'sanat',
											count: 15,
											icon: '🎨',
										},
										{
											category: 'teknoloji',
											count: 10,
											icon: '💻',
										},
									],
									byDifficulty: {
										kolay: 30,
										orta: 40,
										zor: 30,
									},
									byType: {
										multiple: 80,
										boolean: 20,
									},
									recentActivity: {
										lastDay: 15,
										lastWeek: 45,
										lastMonth: 100,
									},
								},
							})}
						</div>
					</div>
				</section>

				<section className='docs-section'>
					<div className='section-header'>
						<div className='section-icon'>⚠️</div>
						<h2>Hata Kodları</h2>
					</div>
					<div className='error-codes'>
						<div className='error-item'>
							<div className='error-header'>
								<span className='error-code'>400</span>
								<h4>Bad Request</h4>
							</div>
							<p>
								Validasyon hatası veya eksik/hatalı parametreler
							</p>
							{renderJsonExample('Başarısız Yanıt', {
								success: false,
								message: 'Validasyon hatası',
								errors: [
									'Soru en az 10 karakter olmalıdır',
									'Geçersiz kategori',
									'Cevap sayısı uyumsuz',
								],
							})}
						</div>

						<div className='error-item'>
							<div className='error-header'>
								<span className='error-code'>404</span>
								<h4>Not Found</h4>
							</div>
							<p>İstenen kaynak bulunamadı</p>
							{renderJsonExample('Başarısız Yanıt', {
								success: false,
								message: 'Soru bulunamadı',
								error: 'NOT_FOUND',
							})}
						</div>

						<div className='error-item'>
							<div className='error-header'>
								<span className='error-code'>429</span>
								<h4>Too Many Requests</h4>
							</div>
							<p>Rate limit aşıldı</p>
							{renderJsonExample('Başarısız Yanıt', {
								success: false,
								message: 'Çok fazla istek gönderildi',
								error: 'RATE_LIMIT_EXCEEDED',
								retryAfter: 60,
							})}
						</div>

						<div className='error-item'>
							<div className='error-header'>
								<span className='error-code'>500</span>
								<h4>Internal Server Error</h4>
							</div>
							<p>Sunucu hatası</p>
							{renderJsonExample('Başarısız Yanıt', {
								success: false,
								message: 'Sunucu hatası oluştu',
								error: 'INTERNAL_SERVER_ERROR',
							})}
						</div>
					</div>
				</section>

				<section className='docs-section'>
					<div className='section-header'>
						<div className='section-icon'>💡</div>
						<h2>İpuçları ve Öneriler</h2>
					</div>
					<div className='tips-grid'>
						<div className='tip-card'>
							<div className='tip-icon'>🚀</div>
							<h4>Performans İyileştirmeleri</h4>
							<p>API'yi daha verimli kullanmak için öneriler:</p>
							<ul>
								<li>Yanıtları önbelleğe alın</li>
								<li>Rate limit aşımını önleyin</li>
								<li>Gereksiz isteklerden kaçının</li>
								<li>Hata durumlarını düzgün yönetin</li>
							</ul>
						</div>
						<div className='tip-card'>
							<div className='tip-icon'>🎯</div>
							<h4>Doğru Soru Seçimi</h4>
							<p>Daha iyi kullanıcı deneyimi için:</p>
							<ul>
								<li>Kategorileri kombine edin</li>
								<li>Zorluk seviyelerini dengeleyin</li>
								<li>Soru tiplerini karıştırın</li>
								<li>Kullanıcı seviyesine uygun filtreleyin</li>
							</ul>
						</div>
						<div className='tip-card'>
							<div className='tip-icon'>⚡</div>
							<h4>Hızlı Entegrasyon</h4>
							<p>Projenize hızlı başlangıç için:</p>
							<ul>
								<li>Örnek kodları inceleyin</li>
								<li>Hata kodlarını kontrol edin</li>
								<li>Validasyon kurallarına uyun</li>
								<li>Test ortamında deneyin</li>
							</ul>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Documentation;
