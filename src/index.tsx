import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Mevcut global CSS'inizi import edin (varsa)
import './App.css'; // Yeni App.css'inizi import edin!

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material'; // Tarayıcıların varsayılan stillerini sıfırlar

// Özel tema oluşturma
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Koyu mor-mavi (MUI varsayılan primary)
    },
    secondary: {
      main: '#f50057', // Kırmızı-pembe (MUI varsayılan secondary)
    },
    success: { // Örneğin, canlı durum için yeşil
      main: '#4caf50',
    },
    error: { // Hata mesajları için kırmızı
      main: '#f44336',
    },
    warning: { // Uyarılar için turuncu
      main: '#ff9800',
    },
    info: { // Bilgilendirme mesajları için açık mavi
      main: '#2196f3',
    },
    background: {
      default: '#f0f2f5', // Genel sayfa arka planı
      paper: '#ffffff', // Card/Box gibi bileşenlerin arka planı
    },
  },
  typography: {
    fontFamily: [
      'Inter', // Modern bir sans-serif fontu deneyelim
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: { // Uygulama başlığı için
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '0.02em',
      color: '#2c3e50',
    },
    h5: { // Detay başlığı için
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8, // Genel bileşenler için varsayılan köşeleri yuvarla
  },
  components: {
    // MUI Button bileşenleri için genel stil özelleştirmeleri
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Düğme metinlerini küçük harf yapmaz
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    // TextField ve Select bileşenleri için genel stil özelleştirmeleri
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // Sayfalama bileşeni için stil (MUI varsayılanlarına göre)
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiAlert: { // Hata/Bilgi mesajları için
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCircularProgress: { // Yükleniyor ikonu için
      styleOverrides: {
        root: {
          color: '#3f51b5', // Primary rengi kullan
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Tarayıcıların varsayılan stillerini sıfırlar */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);