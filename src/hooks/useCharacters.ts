// src/hooks/useCharacters.ts
// Uygulamanın karakter verilerini yöneten özel React Hook'u.
// API çağrıları, filtreleme, sıralama, sayfalama ve yükleme/hata state'lerini içerir.

import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCharacters } from '../api'; // API çağrılarını yapan fonksiyonu import et
import { type Character } from '../types'; // Karakter veri tipi tanımını import et

// Yardımcı debounce fonksiyonu:
// Ardışık fonksiyon çağrılarını belirli bir gecikmeyle gruplar.
// Özellikle TextField gibi input'larda gereksiz API çağrılarını önlemek için kullanılır.
const debounce = (func: (...args: any[]) => void, delay: number): ((...args: any[]) => void) => {
  let timeout: NodeJS.Timeout; // NodeJS.Timeout tipi `@types/node` paketi yüklendikten sonra tanınır.
  return (...args: any[]) => {
    clearTimeout(timeout); // Önceki zamanlayıcıyı temizle
    timeout = setTimeout(() => func(...args), delay); // Yeni zamanlayıcıyı ayarla
  };
};

// useCharacters hook'unun döndüreceği değerlerin tipleri
interface UseCharactersResult {
  characters: Character[]; // Mevcut sayfada gösterilecek karakterler
  loading: boolean; // Veri yükleniyor mu?
  error: string | null; // Hata mesajı (varsa)
  page: number; // Mevcut sayfa numarası (frontend sayfalama)
  totalPages: number; // Toplam sayfa sayısı (frontend sayfalama)
  setPage: (page: number) => void; // Sayfayı değiştirmek için fonksiyon
  nameFilter: string; // İsim filtresi değeri
  setNameFilter: (filter: string) => void; // İsim filtresini ayarlamak için fonksiyon
  statusFilter: string; // Durum filtresi değeri
  setStatusFilter: (filter: string) => void; // Durum filtresini ayarlamak için fonksiyon
  speciesFilter: string; // Tür filtresi değeri
  setSpeciesFilter: (filter: string) => void; // Tür filtresini ayarlamak için fonksiyon
  genderFilter: string; // Cinsiyet filtresi değeri
  setGenderFilter: (filter: string) => void; // Cinsiyet filtresini ayarlamak için fonksiyon
  sortBy: string; // Sıralama kriteri ('name', 'id' vb.)
  setSortBy: (field: string) => void; // Sıralama kriterini ayarlamak için fonksiyon
  sortOrder: 'asc' | 'desc'; // Sıralama yönü ('asc' veya 'desc')
  setSortOrder: (order: 'asc' | 'desc') => void; // Sıralama yönünü ayarlamak için fonksiyon
  itemsPerPage: number; // Sayfa başına gösterilecek öğe sayısı (frontend)
  setItemsPerPage: (count: number) => void; // Sayfa boyutunu ayarlamak için fonksiyon
  clearFilters: () => void; // Tüm filtreleri temizlemek için fonksiyon
  clearSort: () => void; // Sıralama ayarlarını temizlemek için fonksiyon
}

export const useCharacters = (): UseCharactersResult => {
  // API'den çekilen ve filtrelenmiş tüm karakterleri tutacak state.
  // Bu, 'sayfa boyutu' gereksinimini karşılamak için önemlidir, çünkü API'den tüm ilgili veriyi çekeriz.
  const [allFetchedCharacters, setAllFetchedCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Veri yükleniyor durumunu yönetir
  const [error, setError] = useState<string | null>(null); // Hata mesajlarını tutar

  // Frontend'deki mevcut sayfa ve sayfa başına gösterilecek öğe sayısı state'leri
  const [page, setPage] = useState<number>(1); // Başlangıç sayfa numarası
  const [itemsPerPage, setItemsPerPage] = useState<number>(20); // Başlangıç sayfa boyutu

  // Filtre state'leri
  const [nameFilter, setNameFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [speciesFilter, setSpeciesFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');

  // Sıralama state'leri
  const [sortBy, setSortBy] = useState<string>(''); // Başlangıçta sıralama yok
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Varsayılan sıralama yönü artan

  // Filtreler değiştiğinde (veya ilk yüklendiğinde) API'den tüm ilgili karakterleri çeken fonksiyon.
  // Rick and Morty API'si sabit 20 karakter döndürdüğü için, tüm filtreli sonuçları çekmek için
  // birden fazla API çağrısı yapmamız gerekebilir.
  const fetchAllFilteredCharacters = useCallback(async (currentFilters: Record<string, string>) => {
    setLoading(true); // Yükleme durumunu başlat
    setError(null); // Önceki hataları temizle
    setAllFetchedCharacters([]); // Yeni filtrelerle eski veriyi temizle
    setPage(1); // Filtreler değiştiğinde sayfayı sıfırla

    try {
      let currentPage = 1;
      let allResults: Character[] = [];
      let hasNextPage = true;

      // API'nin tüm sayfalarını, filtreler doğrultusunda dönerek veri çek.
      while (hasNextPage) {
        const { results: fetchedCharacters, info } = await fetchCharacters(currentPage, currentFilters);
        allResults = allResults.concat(fetchedCharacters); // Çekilen karakterleri genel listeye ekle

        // API'nin 'info.next' alanı null değilse, bir sonraki sayfa var demektir.
        hasNextPage = info.next !== null;
        currentPage++; // Bir sonraki sayfaya geç

        // Ek Gereksinim: "Tablo en az 250 adet sıra içermelidir."
        // Eğer filtrelenmiş karakter sayısı 250'yi aşarsa veya istediğiniz bir üst sınıra ulaşırsa,
        // daha fazla çekmeyi durdurabilirsiniz (performans optimizasyonu için).
        // Şu anki implementasyon, tüm filtrelenmiş karakterleri çeker.
        // if (allResults.length >= 500 && hasNextPage) { // Örnek limit
        //     console.warn("Maksimum karakter limitine ulaşıldı, daha fazla çekilmiyor.");
        //     break;
        // }
      }
      setAllFetchedCharacters(allResults); // Tüm çekilen karakterleri state'e kaydet

    } catch (err: any) {
      console.error("Karakterler çekilirken hata oluştu (useCharacters):", err);
      // API'den gelen hata mesajını veya genel bir mesajı ayarla
      const errorMessage = err.message || 'Karakterler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
      setError(errorMessage);
    } finally {
      setLoading(false); // Yükleme durumunu bitir
    }
  }, []); // Bağımlılıkları boş bıraktık çünkü filtreleri argüman olarak alıyor.

  // Filtre state'leri değiştiğinde `fetchAllFilteredCharacters`'ı debounce ederek çağır.
  // Bu, kullanıcının hızlıca yazı yazması gibi durumlarda gereksiz API çağrılarını engeller.
  useEffect(() => {
    // Mevcut filtre değerlerini al
    const currentFilters = {
      name: nameFilter,
      status: statusFilter,
      species: speciesFilter,
      gender: genderFilter
    };

    // Debounced fonksiyonu çağır
    const debouncedFetch = debounce(() => fetchAllFilteredCharacters(currentFilters), 500); // 500ms gecikme
    debouncedFetch();

    // Component unmount edildiğinde veya bağımlılıklar değiştiğinde zamanlayıcıyı temizle.
    return () => {
      // `debounce` fonksiyonu zaten kendi içindeki `clearTimeout` ile bunu yönetir.
      // Buradaki return, linter veya belirli bir kod stil kılavuzu için eklenebilir.
    };
  }, [nameFilter, statusFilter, genderFilter, speciesFilter, fetchAllFilteredCharacters]); // Filtre state'leri değiştiğinde tetiklenir

  // Sıralama mantığı: API'den çekilen tüm (allFetchedCharacters) karakterler üzerinde çalışır.
  // useMemo, bu hesaplamayı sadece bağımlılıkları değiştiğinde yeniden yapar (performans optimizasyonu).
  const sortedCharacters = useMemo(() => {
    if (!sortBy) return allFetchedCharacters; // Sıralama kriteri yoksa, olduğu gibi döndür

    const sortableCharacters = [...allFetchedCharacters]; // Orjinal diziyi değiştirmemek için kopyala

    sortableCharacters.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      // Sıralama kriterine göre karşılaştırma değerlerini al
      if (sortBy === 'name') {
        valA = a.name.toLowerCase(); // İsimleri küçük harfe çevirerek karşılaştır
        valB = b.name.toLowerCase();
      } else if (sortBy === 'id') {
        valA = a.id; // ID'leri sayı olarak karşılaştır
        valB = b.id;
      } else {
        return 0; // Geçersiz sıralama alanı, sıralama yapma
      }

      // Değerleri karşılaştır ve sıralama yönüne göre (artan/azalan) sonuç döndür
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0; // Eşitlerse sıralama değişmez
    });

    return sortableCharacters; // Sıralanmış karakter listesini döndür
  }, [allFetchedCharacters, sortBy, sortOrder]); // Bağımlılıklar: tüm çekilen karakterler, sıralama kriteri, sıralama yönü

  // Sayfalama mantığı: Sıralanmış karakterler üzerinde çalışır.
  // Kullanıcının seçtiği `itemsPerPage` (sayfa boyutu) değerine göre karakterleri dilimler.
  const paginatedCharacters = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage; // Başlangıç indeksi hesapla
    const endIndex = startIndex + itemsPerPage; // Bitiş indeksi hesapla
    return sortedCharacters.slice(startIndex, endIndex); // Dilimlenmiş karakter listesini döndür
  }, [sortedCharacters, page, itemsPerPage]); // Bağımlılıklar: sıralanmış karakterler, mevcut sayfa, sayfa boyutu

  // Toplam sayfa sayısını hesapla (frontend'deki sayfalamaya göre).
  // Bu, API'den gelen toplam sayfa sayısı (info.pages) değil, frontend'deki sayfalama için geçerlidir
  const totalPages = useMemo(() => {
    if (sortedCharacters.length === 0) return 1; // Hiç karakter yoksa en az 1 sayfa göster
    return Math.ceil(sortedCharacters.length / itemsPerPage); // Toplam sayfa sayısını hesapla
  }, [sortedCharacters, itemsPerPage]); // Bağımlılıklar: sıralanmış karakterler, sayfa boyutu

  // Filtreleri temizleme fonksiyonu: Tüm filtre state'lerini sıfırlar.
  // Bu state değişimleri `useEffect`'i tetikleyerek `fetchAllFilteredCharacters`'ı yeniden çalıştırır.
  const clearFilters = useCallback(() => {
    setNameFilter('');
    setStatusFilter('');
    setSpeciesFilter('');
    setGenderFilter('');
  }, []);

  // Sıralama ayarlarını temizleme fonksiyonu: Sıralama kriterini ve yönünü sıfırlar.
  const clearSort = useCallback(() => {
    setSortBy('');
    setSortOrder('asc');
  }, []);

  // Hook'un döndürdüğü değerler ve fonksiyonlar
  return {
    characters: paginatedCharacters, // Dışarıya sayfalanmış ve sıralanmış karakterleri sunarız
    loading,
    error,
    page,
    totalPages,
    setPage,
    nameFilter,
    setNameFilter,
    statusFilter,
    setStatusFilter,
    speciesFilter,
    setSpeciesFilter,
    genderFilter,
    setGenderFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    itemsPerPage,
    setItemsPerPage,
    clearFilters,
    clearSort,
  };
};