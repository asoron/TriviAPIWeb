/** @format */

import React from 'react';
import '../styles/Documentation.css';

const Documentation = () => {
	return (
		<div className='docs-container'>
			<div className='docs-paper'>
				<div className='docs-header'>
					<h1 className='docs-title'>API Dokümantasyonu</h1>
					<p className='docs-subtitle'>
						TriviAPI ile trivia sorularını kolayca uygulamanıza
						entegre edin.
					</p>
				</div>

				<section className='docs-section'>
					<h2>Başlangıç</h2>
					<p>
						TriviAPI'yi kullanmak için herhangi bir API anahtarına
						ihtiyacınız yoktur. Tüm endpointler açık ve ücretsizdir.
					</p>
					<div className='endpoint-info'>
						<code className='base-url'>
							https://triviapi.onrender.com
						</code>
					</div>
				</section>

				<section className='docs-section'>
					<h2>Endpointler</h2>

					<div className='endpoint'>
						<h3>Rastgele Soru Al</h3>
						<div className='endpoint-info'>
							<code>GET /api/quizzes/random</code>
						</div>
						<p>Filtrelere göre rastgele bir soru döndürür.</p>

						<h4>Query Parametreleri</h4>
						<ul className='params-list'>
							<li>
								<code>category</code> - Soru kategorisi (örn:
								tarih, bilim, spor)
							</li>
							<li>
								<code>type</code> - Soru tipi (boolean veya
								multiple)
							</li>
							<li>
								<code>author</code> - Soruyu ekleyen kullanıcı
							</li>
						</ul>

						<div className='code-example'>
							<div className='code-header'>
								<span>Örnek İstek</span>
							</div>
							<pre>
								<code>
									{`fetch('https://triviapi.onrender.com/api/quizzes/random?category=tarih&type=multiple')
    .then(response => response.json())
    .then(data => console.log(data));`}
								</code>
							</pre>
						</div>

						<div className='code-example'>
							<div className='code-header'>
								<span>Örnek Yanıt</span>
							</div>
							<pre>
								<code>
									{`{
    "id": "1",
    "question": "Türkiye Cumhuriyeti hangi yılda kurulmuştur?",
    "type": "multiple",
    "category": "tarih",
    "answers": ["1920", "1922", "1923", "1924"],
    "correctAnswer": 2,
    "author": "asoron"
}`}
								</code>
							</pre>
						</div>
					</div>

					<div className='endpoint'>
						<h3>Soru Ekle</h3>
						<div className='endpoint-info'>
							<code>POST /api/quizzes</code>
						</div>
						<p>Yeni bir soru ekler.</p>

						<h4>İstek Gövdesi</h4>
						<div className='code-example'>
							<div className='code-header'>
								<span>JSON Format</span>
							</div>
							<pre>
								<code>
									{`{
    "question": "Soru metni",
    "type": "multiple",
    "category": "tarih",
    "answers": ["Cevap 1", "Cevap 2", "Cevap 3", "Cevap 4"],
    "correctAnswer": 2,
    "author": "kullanıcı_adı"
}`}
								</code>
							</pre>
						</div>

						<h4>Gerekli Alanlar</h4>
						<ul className='params-list'>
							<li>
								<code>question</code> - En az 10 karakter
								uzunluğunda soru metni
							</li>
							<li>
								<code>type</code> - "multiple" veya "boolean"
							</li>
							<li>
								<code>category</code> - Geçerli bir kategori
							</li>
							<li>
								<code>answers</code> - Cevap seçenekleri dizisi
							</li>
							<li>
								<code>correctAnswer</code> - Doğru cevabın
								indeksi (0-tabanlı)
							</li>
							<li>
								<code>author</code> - Soruyu ekleyen
								kullanıcının adı
							</li>
						</ul>
					</div>

					<div className='endpoint'>
						<h3>Mevcut Kategorileri Al</h3>
						<div className='endpoint-info'>
							<code>GET /api/categories</code>
						</div>
						<p>Sistemdeki tüm kategorileri listeler.</p>

						<div className='code-example'>
							<div className='code-header'>
								<span>Örnek Yanıt</span>
							</div>
							<pre>
								<code>
									{`{
    "categories": [
        "tarih",
        "bilim",
        "spor",
        "sanat",
        "genel_kultur"
    ]
}`}
								</code>
							</pre>
						</div>
					</div>
				</section>

				<section className='docs-section'>
					<h2>Hata Kodları</h2>
					<div className='error-codes'>
						<div className='error-item'>
							<code>400</code>
							<p>
								Geçersiz istek formatı veya eksik parametreler
							</p>
						</div>
						<div className='error-item'>
							<code>404</code>
							<p>İstenen kaynak bulunamadı</p>
						</div>
						<div className='error-item'>
							<code>500</code>
							<p>Sunucu hatası</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default Documentation;
