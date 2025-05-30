// src/types.ts

// Rick and Morty API'sinden gelen her bir karakterin detaylı tip tanımı
export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown'; // Olası durum değerleri belirli
  species: string;
  type: string;
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'; // Olası cinsiyet değerleri belirli
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string; // Karakterin avatar URL'si
  episode: string[]; // Bağlı olduğu bölümlerin URL listesi
  url: string; // Karakterin kendi API URL'si
  created: string; // Oluşturulma tarihi (ISO 8601 formatında olabilir)
}

// Rick and Morty API'sinden gelen genel yanıtın yapısı
// Bu, genellikle karakter listesiyle birlikte sayfalama bilgileri içerir.
export interface ApiResponse {
  info: {
    count: number; // Toplam sonuç sayısı
    pages: number; // Toplam sayfa sayısı
    next: string | null; // Bir sonraki sayfanın URL'si (yoksa null)
    prev: string | null; // Bir önceki sayfanın URL'si (yoksa null)
  };
  results: Character[]; // Karakterlerin listesi
}