# TriviAPI - Açık Kaynak Trivia Dokümantasyon Sitesi

**TriviAPI**, Türkçe trivia soruları içeren bir API'yi tanıtmak ve geliştiricilerin bu API'yi kolayca entegre edebilmesi için tasarlanmış açık kaynak bir dokümantasyon ve demo sitesidir. Bu proje, API'nin nasıl kullanılacağını göstermek, deneme yapmalarını sağlamak ve katkıda bulunmak isteyenlere açık bir platform sunmak için geliştirilmiştir.

---

## 📖 **Projenin Amacı**

Bu proje, **Türkçe trivia soruları** sağlayan bir RESTful API'nin tanıtımı için oluşturulmuştur. Kullanıcılar:
- API'nin nasıl çalıştığını öğrenebilir,
- Soruları görüntüleyip filtreleyebilir,
- Yeni sorular ekleyebilir,
- API'nin tüm özelliklerini test edebilir.

Proje aynı zamanda açık kaynak bir şekilde paylaşılarak topluluk katkılarına açık hale getirilmiştir.

---

## 🚀 **Özellikler**

### 1. **Ana Sayfa**
- API'nin temel özelliklerini görsel ve anlaşılır bir şekilde tanıtan bir giriş sayfası.
- Hızlı başlangıç kod örnekleri ve API'nin kullanım senaryoları.
- Modern, animasyonlu ve kullanıcı dostu tasarım.

### 2. **Sorular Bölümü**
- Rastgele sorular görüntüleme ve cevaplama.
- Kategori, zorluk seviyesi ve tür bazlı filtreleme.
- İstatistikler paneli: Puan, başarı oranı ve toplam soru sayısı.

### 3. **Soru Ekleme**
- Kullanıcıların yeni sorular ekleyebileceği bir form.
- Form validasyonu: Soru uzunluğu, kategori seçimi, doğru cevap kontrolü.
- Çoktan seçmeli veya doğru/yanlış formatında soru ekleme.

### 4. **Dokümantasyon**
- API endpoint'lerinin detaylı açıklamaları.
- Örnek istek ve yanıt formatları.
- Hata kodları ve çözümleri.

### 5. **Admin Paneli**
- Soruları onaylama/reddetme işlemleri.
- Detaylı istatistikler ve kategori bazlı analiz.
- Admin giriş ve yetkilendirme sistemi.

---

## 🛠️ **Teknolojiler**

### **Frontend**
- **React.js**: Modern kullanıcı arayüzü geliştirme.
- **CSS Animasyonları**: Akıcı ve kullanıcı dostu deneyim.
- **React Router**: Sayfa yönlendirme.
- **React Toastify**: Bildirim sistemi.

### **Backend (API)**
- **Node.js & Express.js**: API geliştirme.
- **MongoDB**: Veritabanı yönetimi.
- **JWT**: Kimlik doğrulama.
- **RESTful Mimari**: Esnek ve genişletilebilir endpoint'ler.

---

## 📂 **Proje Yapısı**

```
src/
├── components/
│   ├── Home.js            # Ana sayfa
│   ├── BrowseQuizzes.js   # Sorular bölümü
│   ├── SubmitQuiz.js      # Soru ekleme bölümü
│   ├── Documentation.js   # API dokümantasyonu
│   └── AdminDashboard.js  # Admin paneli
├── styles/                # CSS dosyaları
├── App.js                 # Ana uygulama
└── index.js               # Giriş noktası
```

---

## 📦 **Kurulum ve Çalıştırma**

### 1. **Depoyu Klonlayın**
```bash
git clone https://github.com/kullaniciadi/triviapi-docs.git
cd triviapi-docs
```

### 2. **Bağımlılıkları Yükleyin**
```bash
npm install
```

### 3. **Uygulamayı Başlatın**
```bash
npm start
```

### 4. **Canlı Görüntüleme**
- Uygulama, `http://localhost:3000` adresinde çalışacaktır.

---

## 🌐 **Canlı Demo**

[TriviAPI Dokümantasyon ve Demo Sitesi](https://triviapi-demo.com)

---

## 🤝 **Katkıda Bulunun**

Bu projeye katkıda bulunmak isterseniz, aşağıdaki adımları takip edebilirsiniz:

1. **Fork**: Depoyu kendi hesabınıza fork edin.
2. **Branch Oluşturun**: Yeni bir özellik veya düzeltme için branch oluşturun.
   ```bash
   git checkout -b yeni-ozellik
   ```
3. **Değişiklik Yapın**: Kodunuzu düzenleyin ve test edin.
4. **Commit ve Push**: Değişikliklerinizi commit edip kendi fork'unuza gönderin.
   ```bash
   git add .
   git commit -m "Yeni özellik eklendi"
   git push origin yeni-ozellik
   ```
5. **Pull Request**: Değişikliklerinizi ana depoya göndermek için bir pull request oluşturun.

---

## 📜 **Lisans**

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır. Dilediğiniz gibi kullanabilir, değiştirebilir ve paylaşabilirsiniz.

---

## 💬 **İletişim**

Eğer herhangi bir sorunuz veya öneriniz varsa, lütfen [asoron](https://github.com/asoron) ile iletişime geçin.

---

## 🏆 **Teşekkürler**

TriviAPI'yi kullanmayı tercih ettiğiniz için teşekkür ederiz! Daha fazla özellik ve geliştirme için bizi takip etmeye devam edin. 😊
