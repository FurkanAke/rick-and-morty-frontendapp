// src/App.tsx
// Ana uygulama bileşeni. Rick and Morty karakter listesini görüntüler,
// filtreleme, sıralama, sayfalama ve karakter detay gösterme işlevlerini yönetir.
// useCharacters custom hook'u aracılığıyla API'den veri çeker ve state'leri yönetir.

// React 17+ ile 'React' import etmeye gerek yoksa sadece hook'ları import edin.
// `React`'ın altı sarı çiziliydi çünkü doğrudan kullanılmıyordu ve TypeScript'in
// `jsxRuntime` ayarı sayesinde implicit olarak var oluyor. Bu uyarıyı gidermek için kaldırıldı.
import { useState } from 'react';

import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Pagination
} from '@mui/material';
import { FixedSizeList } from 'react-window'; // Sanallaştırılmış liste için

import { useCharacters } from './hooks/useCharacters'; // Karakter verilerini ve yönetim mantığını sağlayan özel hook
import { type Character } from './types'; // Karakter veri yapısı tanımları ('type' anahtar kelimesiyle import edildi)

function App() {
  // useCharacters hook'undan gelen tüm state'ler ve mantıklar
  const {
    characters, // Bu artık zaten sayfalanmış ve sıralanmış karakterler listesi
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
    clearSort
  } = useCharacters();

  // Seçili karakterin detaylarını tutacak state
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Rick and Morty Karakterleri
      </Typography>

      {/* FİLTRELEME ALANLARI */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
        <TextField
          label="İsme Göre Filtrele"
          size="small"
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            // setPage(1) burada gerekli değil, çünkü useCharacters içindeki useEffect,
            // filtreler değiştiğinde otomatik olarak sayfayı 1'e sıfırlar.
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Durum</InputLabel>
          <Select
            value={statusFilter}
            label="Durum"
            onChange={(e) => {
              setStatusFilter(e.target.value as string);
              // setPage(1) burada da gerekli değil.
            }}
          >
            <MenuItem value="">Hepsi</MenuItem>
            <MenuItem value="alive">Canlı</MenuItem>
            <MenuItem value="dead">Ölü</MenuItem>
            <MenuItem value="unknown">Bilinmiyor</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Türe Göre Filtrele"
          size="small"
          value={speciesFilter}
          onChange={(e) => {
            setSpeciesFilter(e.target.value);
            // setPage(1) burada da gerekli değil.
          }}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Cinsiyet</InputLabel>
          <Select
            value={genderFilter}
            label="Cinsiyet"
            onChange={(e) => {
              setGenderFilter(e.target.value as string);
              // setPage(1) burada da gerekli değil.
            }}
          >
            <MenuItem value="">Hepsi</MenuItem>
            <MenuItem value="female">Kadın</MenuItem>
            <MenuItem value="male">Erkek</MenuItem>
            <MenuItem value="genderless">Cinsiyetsiz</MenuItem>
            <MenuItem value="unknown">Bilinmiyor</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          color="secondary"
          onClick={clearFilters} // Filtreleri temizleme fonksiyonu
        >
          Filtreleri Temizle
        </Button>
      </Box>

      {/* SIRALAMA ALANLARI */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#e8f5e9' }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Sırala</InputLabel>
          <Select
            value={sortBy}
            label="Sırala"
            onChange={(e) => setSortBy(e.target.value as string)}
          >
            <MenuItem value="">Yok</MenuItem>
            <MenuItem value="name">İsme Göre</MenuItem>
            <MenuItem value="id">ID'ye Göre</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Yön</InputLabel>
          <Select
            value={sortOrder}
            label="Yön"
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} // Tipi belirtildi
            disabled={!sortBy} // Sıralama türü seçilmediyse yön seçilemez
          >
            <MenuItem value="asc">Artan</MenuItem>
            <MenuItem value="desc">Azalan</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="primary"
          onClick={clearSort} // Sıralamayı temizleme fonksiyonu
          disabled={!sortBy} // Sıralama türü seçilmediyse temizleme düğmesi pasif
        >
          Sıralamayı Temizle
        </Button>
      </Box>

      {/* SAYFA BOYUTU ALANI */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#e0f7fa' }}>
        <FormControl sx={{ minWidth: 150 }} size="small">
          <InputLabel>Sayfa Boyutu</InputLabel>
          <Select
            value={itemsPerPage}
            label="Sayfa Boyutu"
            onChange={(e) => {
              setItemsPerPage(e.target.value as number);
              setPage(1); // Sayfa boyutu değiştiğinde sayfayı sıfırla
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={250}>250</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* YÜKLENİYOR İKONU VE MESAJI */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress size={60} thickness={5} />
          <Typography variant="h6" style={{ marginLeft: '20px', color: '#3f51b5' }}>Karakterler Yükleniyor...</Typography>
        </Box>
      )}

      {/* HATA MESAJI */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* KARAKTER LİSTESİ VE SAYFALAMA KONTROLLERİ */}
      {/* Yükleme yoksa, hata yoksa ve karakter varsa bu bölümü göster */}
      {!loading && !error && characters.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Görüntülenen Karakter Sayısı: {characters.length} (Sayfa: {page}/{totalPages})
          </Typography>

          {/* Tablo Başlıkları - FixedSizeList'in üstünde konumlandırıldı */}
          <Box sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 10px',
              borderBottom: '2px solid #ccc',
              fontWeight: 'bold',
              backgroundColor: '#e0e0e0',
              borderRadius: '8px 8px 0 0' // Sadece üst köşeler yuvarlatıldı
          }}>
              <Box sx={{ width: '50px', marginRight: '15px' }}></Box> {/* Resim için boşluk */}
              <Typography variant="body1" sx={{ flex: 1, fontWeight: 'bold' }}>İsim</Typography>
              <Typography variant="body2" sx={{ flex: 0.5, fontWeight: 'bold' }}>Durum</Typography>
              <Typography variant="body2" sx={{ flex: 0.5, fontWeight: 'bold' }}>Tür</Typography>
              <Typography variant="body2" sx={{ flex: 0.5, fontWeight: 'bold' }}>Cinsiyet</Typography>
          </Box>

          {/* Karakter Listesi - react-window FixedSizeList ile performanslı render */}
          <Box sx={{ border: '1px solid #ccc', borderRadius: '0 0 4px 4px', overflow: 'hidden' }}>
            <FixedSizeList
              height={500} // Liste yüksekliği
              itemCount={characters.length} // Görüntülenecek toplam karakter sayısı
              itemSize={70} // Her satırın yüksekliği (pixel cinsinden)
              width="100%"
            >
              {/* Buradaki render fonksiyonu, listenin her bir öğesini çizer */}
              {({ index, style }) => {
                const character = characters[index];
                // Eğer data henüz yüklenmemişse veya indekste bir sorun varsa
                if (!character) {
                  return null;
                }

                return (
                  <div
                    style={{
                      ...style, // react-window tarafından sağlanan pozisyon stilleri
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      backgroundColor: index % 2 ? '#f9f9f9' : '#fff', // Çift/tek satır renk farkı
                      cursor: 'pointer', // Tıklanabilir olduğunu belirtir
                      // Seçili karakterin solunda mavi bir çizgi gösterir
                      borderLeft: selectedCharacter?.id === character.id ? '5px solid #3f51b5' : 'none'
                    }}
                    onClick={() => setSelectedCharacter(character)} // Tıklandığında bu karakteri seçili hale getir
                  >
                    <img
                      src={character.image}
                      alt={character.name}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }}
                    />
                    <Typography variant="body1" style={{ flex: 1 }}>{character.name}</Typography>
                    <Typography variant="body2" style={{ flex: 0.5 }}>{character.status}</Typography>
                    <Typography variant="body2" style={{ flex: 0.5 }}>{character.species}</Typography>
                    <Typography variant="body2" style={{ flex: 0.5 }}>{character.gender}</Typography>
                  </div>
                );
              }}
            </FixedSizeList>
          </Box>

          {/* Sayfalama Kontrolleri - MUI Pagination Bileşeni */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
                count={totalPages} // Toplam sayfa sayısı
                page={page} // Mevcut sayfa
                onChange={((_, value) => setPage(value))} // Sayfa değiştiğinde setPage fonksiyonunu çağır (event kullanılmadığı için '_' ile işaretlendi)
                color="primary" // Ana tema rengini kullan
                showFirstButton // İlk sayfa düğmesini göster
                showLastButton // Son sayfa düğmesini göster
            />
          </Box>

          {/* KARAKTER DETAY ALANI */}
          {/* Bir karakter seçildiyse (selectedCharacter null değilse) bu bölümü göster */}
          {selectedCharacter && (
            <Box sx={{ mt: 4, p: 3, border: '1px solid #007bff', borderRadius: '8px', backgroundColor: '#e6f7ff', display: 'flex', alignItems: 'center', gap: 3 }}>
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                style={{ width: '150px', height: '150px', borderRadius: '8px', marginRight: '20px', objectFit: 'cover', border: '3px solid #3f51b5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}
              />
              <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {selectedCharacter.name} Detayları
                </Typography>
                <Typography variant="body1">
                  **Durum:** {selectedCharacter.status}
                </Typography>
                <Typography variant="body1">
                  **Tür:** {selectedCharacter.species}
                </Typography>
                <Typography variant="body1">
                  **Cinsiyet:** {selectedCharacter.gender}
                </Typography>
                <Typography variant="body1">
                  **ID:** {selectedCharacter.id}
                </Typography>
                {selectedCharacter.origin && selectedCharacter.origin.name && (
                  <Typography variant="body1">
                    **Köken:** {selectedCharacter.origin.name}
                  </Typography>
                )}
                {selectedCharacter.location && selectedCharacter.location.name && (
                  <Typography variant="body1">
                    **Son Görüldüğü Yer:** {selectedCharacter.location.name}
                  </Typography>
                )}
              </Box>
            </Box>
          )}

        </>
      )}

      {/* KARAKTER BULUNAMADI MESAJI */}
      {/* Yükleme yoksa, hata yoksa ve karakter listesi boşsa bu mesajı göster */}
      {!loading && !error && characters.length === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>
              Aradığınız kriterlere uygun karakter bulunamadı. Lütfen filtreleri kontrol edin.
          </Alert>
      )}

    </Container>
  );
}

export default App;