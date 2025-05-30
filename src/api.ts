// src/api.ts
// Rick and Morty API'sine HTTP istekleri göndermek için merkezi fonksiyon.

import axios from 'axios';
// `type` anahtar kelimesi, yalnızca tip tanımlamaları import edildiğinde kullanılır.
// Bu, TypeScript'in derleme zamanında bu importları kaldırmasına olanak tanır ve
// `verbatimModuleSyntax` ayarı etkinleştirildiğinde oluşabilecek hataları önler.
// 'Character' doğrudan bir değer olarak okunmadığı için oluşan uyarıyı kapatmak için
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type ApiResponse, type Character } from './types';

// Rick and Morty API'sinin temel URL'si sabit olarak tanımlanmıştır.
const BASE_URL = 'https://rickandmortyapi.com/api';

/**
 * Rick and Morty API'sinden karakter verilerini çeker.
 * Bu fonksiyon, verilen sayfa numarasına ve filtre parametrelerine göre API'ye istekte bulunur.
 * API'nin sayfa başına varsayılan 20 karakter döndürdüğü unutulmamalıdır.
 *
 * @param page Hangi sayfanın çekileceği (varsayılan: 1).
 * @param filters Filtreleme parametreleri (örneğin: { name: 'rick', status: 'alive' }).
 * @returns API'den gelen karakter verileri ve sayfalama bilgileri.
 */
export const fetchCharacters = async (page: number = 1, filters: Record<string, string> = {}): Promise<ApiResponse> => {
  try {
    // Filtreleri ve sayfa numarasını URL sorgu parametrelerine dönüştürür.
    // URLSearchParams, objeyi "key=value&key2=value2" formatına çevirir.
    const queryParams = new URLSearchParams({
      page: page.toString(), // Sayfa numarasını string'e çevir
      ...filters // Diğer filtreleri (name, status vb.) ekle
    }).toString();

    // Axios kullanarak API'ye GET isteği atar.
    // Gelen verinin tipini ApiResponse olarak belirtiriz.
    const response = await axios.get<ApiResponse>(`${BASE_URL}/character?${queryParams}`);

    // Başarılı yanıtı döndür
    return response.data;
  } catch (error) {
    // Hata yönetimi: Axios hatalarını daha spesifik olarak yakalarız.
    if (axios.isAxiosError(error) && error.response) {
      // API'den gelen spesifik hata mesajını (örneğin 404 Not Found) kullanırız.
      // Bu genellikle API yanıtında `error` alanında bulunur.
      throw new Error(error.response.data.error || `API hatası: ${error.response.status}`);
    } else {
      // Ağ bağlantısı sorunları veya bilinmeyen diğer hataları yakalarız.
      throw new Error('Karakterler çekilirken bir ağ hatası oluştu. Lütfen bağlantınızı kontrol edin.');
    }
  }
};