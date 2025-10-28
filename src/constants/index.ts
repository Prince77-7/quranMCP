/**
 * Constants and configuration for the Quran MCP Server
 * Contains API endpoints, available resources, and validation data
 */

// API Base URLs
export const API_ENDPOINTS = {
  TAFSIR: 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir',
  HADITH: 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions',
  QURAN_ARABIC: 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions',
  QURAN_ENGLISH: 'https://api.alquran.cloud/v1/ayah',
  RECITATION: 'https://everyayah.com/data',
} as const;

// Surah information (114 surahs)
export const SURAH_INFO = [
  { number: 1, name: 'Al-Fatihah', ayahs: 7, type: 'Meccan' },
  { number: 2, name: 'Al-Baqarah', ayahs: 286, type: 'Medinan' },
  { number: 3, name: 'Ali \'Imran', ayahs: 200, type: 'Medinan' },
  { number: 4, name: 'An-Nisa', ayahs: 176, type: 'Medinan' },
  { number: 5, name: 'Al-Ma\'idah', ayahs: 120, type: 'Medinan' },
  { number: 6, name: 'Al-An\'am', ayahs: 165, type: 'Meccan' },
  { number: 7, name: 'Al-A\'raf', ayahs: 206, type: 'Meccan' },
  { number: 8, name: 'Al-Anfal', ayahs: 75, type: 'Medinan' },
  { number: 9, name: 'At-Tawbah', ayahs: 129, type: 'Medinan' },
  { number: 10, name: 'Yunus', ayahs: 109, type: 'Meccan' },
  { number: 11, name: 'Hud', ayahs: 123, type: 'Meccan' },
  { number: 12, name: 'Yusuf', ayahs: 111, type: 'Meccan' },
  { number: 13, name: 'Ar-Ra\'d', ayahs: 43, type: 'Medinan' },
  { number: 14, name: 'Ibrahim', ayahs: 52, type: 'Meccan' },
  { number: 15, name: 'Al-Hijr', ayahs: 99, type: 'Meccan' },
  { number: 16, name: 'An-Nahl', ayahs: 128, type: 'Meccan' },
  { number: 17, name: 'Al-Isra', ayahs: 111, type: 'Meccan' },
  { number: 18, name: 'Al-Kahf', ayahs: 110, type: 'Meccan' },
  { number: 19, name: 'Maryam', ayahs: 98, type: 'Meccan' },
  { number: 20, name: 'Taha', ayahs: 135, type: 'Meccan' },
  { number: 21, name: 'Al-Anbya', ayahs: 112, type: 'Meccan' },
  { number: 22, name: 'Al-Hajj', ayahs: 78, type: 'Medinan' },
  { number: 23, name: 'Al-Mu\'minun', ayahs: 118, type: 'Meccan' },
  { number: 24, name: 'An-Nur', ayahs: 64, type: 'Medinan' },
  { number: 25, name: 'Al-Furqan', ayahs: 77, type: 'Meccan' },
  { number: 26, name: 'Ash-Shu\'ara', ayahs: 227, type: 'Meccan' },
  { number: 27, name: 'An-Naml', ayahs: 93, type: 'Meccan' },
  { number: 28, name: 'Al-Qasas', ayahs: 88, type: 'Meccan' },
  { number: 29, name: 'Al-\'Ankabut', ayahs: 69, type: 'Meccan' },
  { number: 30, name: 'Ar-Rum', ayahs: 60, type: 'Meccan' },
  { number: 31, name: 'Luqman', ayahs: 34, type: 'Meccan' },
  { number: 32, name: 'As-Sajdah', ayahs: 30, type: 'Meccan' },
  { number: 33, name: 'Al-Ahzab', ayahs: 73, type: 'Medinan' },
  { number: 34, name: 'Saba', ayahs: 54, type: 'Meccan' },
  { number: 35, name: 'Fatir', ayahs: 45, type: 'Meccan' },
  { number: 36, name: 'Ya-Sin', ayahs: 83, type: 'Meccan' },
  { number: 37, name: 'As-Saffat', ayahs: 182, type: 'Meccan' },
  { number: 38, name: 'Sad', ayahs: 88, type: 'Meccan' },
  { number: 39, name: 'Az-Zumar', ayahs: 75, type: 'Meccan' },
  { number: 40, name: 'Ghafir', ayahs: 85, type: 'Meccan' },
  { number: 41, name: 'Fussilat', ayahs: 54, type: 'Meccan' },
  { number: 42, name: 'Ash-Shuraa', ayahs: 53, type: 'Meccan' },
  { number: 43, name: 'Az-Zukhruf', ayahs: 89, type: 'Meccan' },
  { number: 44, name: 'Ad-Dukhan', ayahs: 59, type: 'Meccan' },
  { number: 45, name: 'Al-Jathiyah', ayahs: 37, type: 'Meccan' },
  { number: 46, name: 'Al-Ahqaf', ayahs: 35, type: 'Meccan' },
  { number: 47, name: 'Muhammad', ayahs: 38, type: 'Medinan' },
  { number: 48, name: 'Al-Fath', ayahs: 29, type: 'Medinan' },
  { number: 49, name: 'Al-Hujurat', ayahs: 18, type: 'Medinan' },
  { number: 50, name: 'Qaf', ayahs: 45, type: 'Meccan' },
  { number: 51, name: 'Adh-Dhariyat', ayahs: 60, type: 'Meccan' },
  { number: 52, name: 'At-Tur', ayahs: 49, type: 'Meccan' },
  { number: 53, name: 'An-Najm', ayahs: 62, type: 'Meccan' },
  { number: 54, name: 'Al-Qamar', ayahs: 55, type: 'Meccan' },
  { number: 55, name: 'Ar-Rahman', ayahs: 78, type: 'Medinan' },
  { number: 56, name: 'Al-Waqi\'ah', ayahs: 96, type: 'Meccan' },
  { number: 57, name: 'Al-Hadid', ayahs: 29, type: 'Medinan' },
  { number: 58, name: 'Al-Mujadila', ayahs: 22, type: 'Medinan' },
  { number: 59, name: 'Al-Hashr', ayahs: 24, type: 'Medinan' },
  { number: 60, name: 'Al-Mumtahanah', ayahs: 13, type: 'Medinan' },
  { number: 61, name: 'As-Saf', ayahs: 14, type: 'Medinan' },
  { number: 62, name: 'Al-Jumu\'ah', ayahs: 11, type: 'Medinan' },
  { number: 63, name: 'Al-Munafiqun', ayahs: 11, type: 'Medinan' },
  { number: 64, name: 'At-Taghabun', ayahs: 18, type: 'Medinan' },
  { number: 65, name: 'At-Talaq', ayahs: 12, type: 'Medinan' },
  { number: 66, name: 'At-Tahrim', ayahs: 12, type: 'Medinan' },
  { number: 67, name: 'Al-Mulk', ayahs: 30, type: 'Meccan' },
  { number: 68, name: 'Al-Qalam', ayahs: 52, type: 'Meccan' },
  { number: 69, name: 'Al-Haqqah', ayahs: 52, type: 'Meccan' },
  { number: 70, name: 'Al-Ma\'arij', ayahs: 44, type: 'Meccan' },
  { number: 71, name: 'Nuh', ayahs: 28, type: 'Meccan' },
  { number: 72, name: 'Al-Jinn', ayahs: 28, type: 'Meccan' },
  { number: 73, name: 'Al-Muzzammil', ayahs: 20, type: 'Meccan' },
  { number: 74, name: 'Al-Muddaththir', ayahs: 56, type: 'Meccan' },
  { number: 75, name: 'Al-Qiyamah', ayahs: 40, type: 'Meccan' },
  { number: 76, name: 'Al-Insan', ayahs: 31, type: 'Medinan' },
  { number: 77, name: 'Al-Mursalat', ayahs: 50, type: 'Meccan' },
  { number: 78, name: 'An-Naba', ayahs: 40, type: 'Meccan' },
  { number: 79, name: 'An-Nazi\'at', ayahs: 46, type: 'Meccan' },
  { number: 80, name: '\'Abasa', ayahs: 42, type: 'Meccan' },
  { number: 81, name: 'At-Takwir', ayahs: 29, type: 'Meccan' },
  { number: 82, name: 'Al-Infitar', ayahs: 19, type: 'Meccan' },
  { number: 83, name: 'Al-Mutaffifin', ayahs: 36, type: 'Meccan' },
  { number: 84, name: 'Al-Inshiqaq', ayahs: 25, type: 'Meccan' },
  { number: 85, name: 'Al-Buruj', ayahs: 22, type: 'Meccan' },
  { number: 86, name: 'At-Tariq', ayahs: 17, type: 'Meccan' },
  { number: 87, name: 'Al-A\'la', ayahs: 19, type: 'Meccan' },
  { number: 88, name: 'Al-Ghashiyah', ayahs: 26, type: 'Meccan' },
  { number: 89, name: 'Al-Fajr', ayahs: 30, type: 'Meccan' },
  { number: 90, name: 'Al-Balad', ayahs: 20, type: 'Meccan' },
  { number: 91, name: 'Ash-Shams', ayahs: 15, type: 'Meccan' },
  { number: 92, name: 'Al-Layl', ayahs: 21, type: 'Meccan' },
  { number: 93, name: 'Ad-Duhaa', ayahs: 11, type: 'Meccan' },
  { number: 94, name: 'Ash-Sharh', ayahs: 8, type: 'Meccan' },
  { number: 95, name: 'At-Tin', ayahs: 8, type: 'Meccan' },
  { number: 96, name: 'Al-\'Alaq', ayahs: 19, type: 'Meccan' },
  { number: 97, name: 'Al-Qadr', ayahs: 5, type: 'Meccan' },
  { number: 98, name: 'Al-Bayyinah', ayahs: 8, type: 'Medinan' },
  { number: 99, name: 'Az-Zalzalah', ayahs: 8, type: 'Medinan' },
  { number: 100, name: 'Al-\'Adiyat', ayahs: 11, type: 'Meccan' },
  { number: 101, name: 'Al-Qari\'ah', ayahs: 11, type: 'Meccan' },
  { number: 102, name: 'At-Takathur', ayahs: 8, type: 'Meccan' },
  { number: 103, name: 'Al-\'Asr', ayahs: 3, type: 'Meccan' },
  { number: 104, name: 'Al-Humazah', ayahs: 9, type: 'Meccan' },
  { number: 105, name: 'Al-Fil', ayahs: 5, type: 'Meccan' },
  { number: 106, name: 'Quraysh', ayahs: 4, type: 'Meccan' },
  { number: 107, name: 'Al-Ma\'un', ayahs: 7, type: 'Meccan' },
  { number: 108, name: 'Al-Kawthar', ayahs: 3, type: 'Meccan' },
  { number: 109, name: 'Al-Kafirun', ayahs: 6, type: 'Meccan' },
  { number: 110, name: 'An-Nasr', ayahs: 3, type: 'Medinan' },
  { number: 111, name: 'Al-Masad', ayahs: 5, type: 'Meccan' },
  { number: 112, name: 'Al-Ikhlas', ayahs: 4, type: 'Meccan' },
  { number: 113, name: 'Al-Falaq', ayahs: 5, type: 'Meccan' },
  { number: 114, name: 'An-Nas', ayahs: 6, type: 'Meccan' },
] as const;

// Available Tafsir sources
export const TAFSIR_SOURCES = [
  { slug: 'en-tafisr-ibn-kathir', name: 'Tafsir Ibn Kathir', language: 'English', author: 'Ibn Kathir' },
  { slug: 'en-tafsir-maarif-ul-quran', name: 'Maarif-ul-Quran', language: 'English', author: 'Mufti Muhammad Shafi' },
  { slug: 'ar-tafsir-al-tabari', name: 'Tafsir al-Tabari', language: 'Arabic', author: 'Al-Tabari' },
  { slug: 'ar-tafsir-al-qurtubi', name: 'Tafsir al-Qurtubi', language: 'Arabic', author: 'Al-Qurtubi' },
  { slug: 'ar-tafsir-ibn-kathir', name: 'Tafsir Ibn Kathir', language: 'Arabic', author: 'Ibn Kathir' },
] as const;

// Available Hadith collections
export const HADITH_COLLECTIONS = [
  { slug: 'bukhari', name: 'Sahih Bukhari', totalHadiths: 7563 },
  { slug: 'muslim', name: 'Sahih Muslim', totalHadiths: 7563 },
  { slug: 'abudawud', name: 'Sunan Abu Dawud', totalHadiths: 5274 },
  { slug: 'tirmidhi', name: 'Jami\' at-Tirmidhi', totalHadiths: 3956 },
  { slug: 'nasai', name: 'Sunan an-Nasa\'i', totalHadiths: 5758 },
  { slug: 'ibnmajah', name: 'Sunan Ibn Majah', totalHadiths: 4341 },
] as const;

// Available reciters
export const RECITERS = [
  { slug: 'Maher_AlMuaiqly_64kbps', name: 'Maher Al-Muaiqly', bitrate: '64kbps' },
  { slug: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit', bitrate: '192kbps' },
  { slug: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahman As-Sudais', bitrate: '192kbps' },
  { slug: 'Mishary_Rashid_Alafasy_128kbps', name: 'Mishary Rashid Alafasy', bitrate: '128kbps' },
  { slug: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Hussary', bitrate: '128kbps' },
] as const;

// Available translations
export const TRANSLATIONS = [
  { slug: 'en.asad', name: 'Muhammad Asad', language: 'English' },
  { slug: 'en.sahih', name: 'Sahih International', language: 'English' },
  { slug: 'en.pickthall', name: 'Pickthall', language: 'English' },
  { slug: 'en.yusufali', name: 'Yusuf Ali', language: 'English' },
  { slug: 'en.hilali', name: 'Hilali & Khan', language: 'English' },
] as const;

// Validation helpers
export function isValidSurah(surah: number): boolean {
  return surah >= 1 && surah <= 114;
}

export function isValidAyah(surah: number, ayah: number): boolean {
  if (!isValidSurah(surah)) return false;
  const surahInfo = SURAH_INFO.find(s => s.number === surah);
  return surahInfo ? ayah >= 1 && ayah <= surahInfo.ayahs : false;
}

export function getSurahInfo(surah: number) {
  return SURAH_INFO.find(s => s.number === surah);
}

// Format helpers
export function formatSurahNumber(surah: number): string {
  return surah.toString().padStart(3, '0');
}

export function formatAyahNumber(ayah: number): string {
  return ayah.toString().padStart(3, '0');
}

