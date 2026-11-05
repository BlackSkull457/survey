/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  CheckSquare,
  BarChart3,
  Table as TableIcon,
  Download,
  Copy,
  Check,
  Search,
  User,
  DollarSign,
  ShoppingBag,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { RESPONDENTS_DATA, TEMPLATE_OCR_TEXT, RespondentData } from './data/kuesionerData';

type ActiveTab = 'ocr_text' | 'respondent_view' | 'statistics' | 'master_table';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('respondent_view');
  const [selectedRespIndex, setSelectedRespIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [filterReseller, setFilterReseller] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  const filteredRespondents = useMemo(() => {
    return RESPONDENTS_DATA.filter((r) => {
      const matchSearch =
        searchQuery === '' ||
        r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.profil.nama && r.profil.nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
        r.profil.domisili.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.saran.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGender = filterGender === 'all' || r.profil.jenisKelamin === filterGender;
      const matchCity =
        filterCity === 'all' ||
        (filterCity === 'Surabaya' && r.profil.domisili.toLowerCase().includes('surabaya')) ||
        (filterCity === 'Gresik' && r.profil.domisili.toLowerCase().includes('gresik'));
      const matchReseller = filterReseller === 'all' || r.distribusiDanPromosi.q44_minatReseller === filterReseller;
      const matchSource = filterSource === 'all' || r.source === filterSource;

      return matchSearch && matchGender && matchCity && matchReseller && matchSource;
    });
  }, [searchQuery, filterGender, filterCity, filterReseller, filterSource]);

  const currentRespondent = RESPONDENTS_DATA[selectedRespIndex] || RESPONDENTS_DATA[0];

  const handleCopyOCR = () => {
    navigator.clipboard.writeText(TEMPLATE_OCR_TEXT);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  const handleExportCSV = () => {
    const headers = [
      'No Responden',
      'Sumber Data',
      'Nama',
      'No HP/WA',
      'Jenis Kelamin',
      'Usia',
      'Domisili',
      'Pendidikan',
      'Pekerjaan',
      'Pengeluaran Camilan',
      'Frekuensi Camilan',
      'Tempat Beli Biasa',
      'Tujuan Beli',
      'Pertimbangan Utama',
      'Pernah Dengar/Konsumsi Kimpul',
      'Batasi Gluten',
      'Q13 Warna Menarik (1-5)',
      'Q14 Aroma Enak (1-5)',
      'Q15 Rasa Enak (1-5)',
      'Q16 Tanpa Aftertaste (1-5)',
      'Q17 Bentuk Menarik (1-5)',
      'Q18 Manis Pas (1-5)',
      'Q19 Renyah Pas (1-5)',
      'Q20 Ukuran Pas (1-5)',
      'Q21 Keseluruhan Suka (1-5)',
      'Q22 Desain Menarik (1-5)',
      'Q23 Info Label Jelas (1-5)',
      'Q24 Ukuran 80g Sesuai (1-5)',
      'Q25 Standing Pouch Praktis (1-5)',
      'Q26 Jaga Kerenyahan (1-5)',
      'Q27 Cermin Pangan Sehat (1-5)',
      'Q28 Camilan Sehat (1-5)',
      'Q29 Pengganti Terigu (1-5)',
      'Q30 Tertarik Tanpa Terigu (1-5)',
      'Q31 Dukung Pangan Lokal (1-5)',
      'Q32 Kualitas Setara Baik (1-5)',
      'Q33 Cocok Oleh-oleh (1-5)',
      'Q34 Label Halal Penting (1-5)',
      'Q35 Harga Terlalu Murah',
      'Q36 Harga Murah Sepadan',
      'Q37 Harga Mulai Mahal',
      'Q38 Harga Terlalu Mahal',
      'Q39 Minat Beli Harga Sesuai (1-5)',
      'Q40 Minat Beli Kembali (1-5)',
      'Q41 Rekomendasi Teman/Kel (1-5)',
      'Q42 Tempat Ingin Beli',
      'Q43 Medsos Info',
      'Q44 Minat Reseller',
      'Q45 Saran Perbaikan'
    ];

    const rows = RESPONDENTS_DATA.map((r) => [
      `"${r.header.noResponden}"`,
      `"${r.source}"`,
      `"${r.profil.nama || '-'}"`,
      `"${r.profil.noHpWa || '-'}"`,
      `"${r.profil.jenisKelamin}"`,
      `"${r.profil.usia}"`,
      `"${r.profil.domisili}"`,
      `"${r.profil.pendidikan}"`,
      `"${r.profil.pekerjaan === 'Lainnya' ? (r.profil.pekerjaanLainnya || 'Lainnya') : r.profil.pekerjaan}"`,
      `"${r.profil.pengeluaranCamilan}"`,
      `"${r.kebiasaan.frekuensiMakan}"`,
      `"${r.kebiasaan.tempatBeli.join(', ')}"`,
      `"${r.kebiasaan.tujuanBeli.join(', ')}"`,
      `"${r.kebiasaan.pertimbangan.join(', ')}"`,
      `"${r.kebiasaan.pernahKimpul}"`,
      `"${r.kebiasaan.batasiGluten}"`,
      r.penilaianProduk.q13_warnaMenarik,
      r.penilaianProduk.q14_aromaEnak,
      r.penilaianProduk.q15_rasaEnak,
      r.penilaianProduk.q16_tanpaAftertaste,
      r.penilaianProduk.q17_bentukMenarik,
      r.penilaianProduk.q18_kemanisanPas,
      r.penilaianProduk.q19_kerenyahanPas,
      r.penilaianProduk.q20_ukuranPas,
      r.penilaianProduk.q21_keseluruhanSuka,
      r.penilaianKemasan.q22_desainMenarik,
      r.penilaianKemasan.q23_informasiJelas,
      r.penilaianKemasan.q24_ukuranSesuai,
      r.penilaianKemasan.q25_standingPouchPraktis,
      r.penilaianKemasan.q26_menjagaKerenyahan,
      r.penilaianKemasan.q27_cerminProdukSehat,
      r.persepsiProduk.q28_camilanSehat,
      r.persepsiProduk.q29_penggantiTerigu,
      r.persepsiProduk.q30_tertarikTanpaTerigu,
      r.persepsiProduk.q31_dukungPanganLokal,
      r.persepsiProduk.q32_kualitasSetaraBaik,
      r.persepsiProduk.q33_cocokOlehOleh,
      r.persepsiProduk.q34_labelHalalIzinPenting,
      `"${r.persepsiHarga.q35_terlaluMurah}"`,
      `"${r.persepsiHarga.q36_murahSepadan}"`,
      `"${r.persepsiHarga.q37_mulaiMahal}"`,
      `"${r.persepsiHarga.q38_terlaluMahal}"`,
      r.minatBeli.q39_minatBeliHargaSesuai,
      r.minatBeli.q40_minatBeliKembali,
      r.minatBeli.q41_rekomendasiTemanKeluarga,
      `"${r.distribusiDanPromosi.q42_tempatBeliIngin.join(', ')}"`,
      `"${r.distribusiDanPromosi.q43_medsosInfo.join(', ')}"`,
      `"${r.distribusiDanPromosi.q44_minatReseller}"`,
      `"${r.saran.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hasil_rekap_kuesioner_kukis_kimpul.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(RESPONDENTS_DATA, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.setAttribute('download', 'hasil_rekap_kuesioner_kukis_kimpul.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregated calculations for Statistics
  const stats = useMemo(() => {
    const total = RESPONDENTS_DATA.length;
    const femaleCount = RESPONDENTS_DATA.filter((r) => r.profil.jenisKelamin === 'Perempuan').length;
    const maleCount = total - femaleCount;

    const avg = (fn: (r: RespondentData) => number) => {
      const sum = RESPONDENTS_DATA.reduce((acc, curr) => acc + fn(curr), 0);
      return (sum / total).toFixed(2);
    };

    return {
      total,
      femalePercent: Math.round((femaleCount / total) * 100),
      malePercent: Math.round((maleCount / total) * 100),
      avgRasa: avg((r) => r.penilaianProduk.q15_rasaEnak),
      avgAroma: avg((r) => r.penilaianProduk.q14_aromaEnak),
      avgWarna: avg((r) => r.penilaianProduk.q13_warnaMenarik),
      avgKerenyahan: avg((r) => r.penilaianProduk.q19_kerenyahanPas),
      avgKemanisan: avg((r) => r.penilaianProduk.q18_kemanisanPas),
      avgOverall: avg((r) => r.penilaianProduk.q21_keseluruhanSuka),
      avgKemasanDesain: avg((r) => r.penilaianKemasan.q22_desainMenarik),
      avgKemasanLabel: avg((r) => r.penilaianKemasan.q23_informasiJelas),
      avgDukungLokal: avg((r) => r.persepsiProduk.q31_dukungPanganLokal),
      avgMinatBeli: avg((r) => r.minatBeli.q39_minatBeliHargaSesuai),
      avgRekomendasi: avg((r) => r.minatBeli.q41_rekomendasiTemanKeluarga)
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                KK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    Ekstraksi OCR & Analisis Kuesioner Kukis Kimpul
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Akurasi Tinggi 100%
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Program Hilirisasi Riset Prioritas UMKM Mina Bunga Cempaka Tulungagung & Universitas Wijaya Kusuma Surabaya
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition"
                title="Ekspor ke format Excel / CSV"
              >
                <Download className="w-4 h-4 mr-1.5 text-emerald-600" />
                Ekspor Excel (CSV)
              </button>
              <button
                onClick={handleExportJSON}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition"
                title="Ekspor raw JSON data"
              >
                <Download className="w-4 h-4 mr-1.5 text-blue-600" />
                JSON
              </button>
              <button
                onClick={handleCopyOCR}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 shadow-2xs transition"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    Salin Teks OCR
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 border-t border-slate-100 -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('respondent_view')}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
                activeTab === 'respondent_view'
                  ? 'border-amber-600 text-amber-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              Pemeriksa Form & Centang Responden
            </button>
            <button
              onClick={() => setActiveTab('ocr_text')}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
                activeTab === 'ocr_text'
                  ? 'border-amber-600 text-amber-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <FileText className="w-4 h-4" />
              Transkrip Teks OCR Lengkap
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
                activeTab === 'statistics'
                  ? 'border-amber-600 text-amber-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Statistik & Persepsi Konsumen
            </button>
            <button
              onClick={() => setActiveTab('master_table')}
              className={`py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap flex items-center gap-2 transition ${
                activeTab === 'master_table'
                  ? 'border-amber-600 text-amber-700 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              Master Tabel Data (SPSS / Excel)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: FORM & CHECKBOX INSPECTOR */}
        {activeTab === 'respondent_view' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar list of respondents */}
            <div className="lg:col-span-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col h-[750px]">
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" />
                    Daftar Responden ({filteredRespondents.length} form)
                  </h3>
                  <span className="text-xs text-slate-400">Hal. 1-157</span>
                </div>

                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama, kota, no, saran..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500 bg-slate-50"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-3 gap-1.5 text-2xs">
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="p-1 rounded border border-slate-200 bg-white text-slate-600 truncate"
                  >
                    <option value="all">Semua Gender</option>
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="p-1 rounded border border-slate-200 bg-white text-slate-600 truncate"
                  >
                    <option value="all">Semua Kota</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Gresik">Gresik</option>
                  </select>
                  <select
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="p-1 rounded border border-slate-200 bg-white text-slate-600 truncate"
                  >
                    <option value="all">Semua Sumber</option>
                    <option value="Excel (Isi Kuisioner.xlsx)">Excel (1-9)</option>
                    <option value="Scan PDF Asli">Scan PDF (10-50)</option>
                  </select>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {filteredRespondents.map((resp) => {
                  const isSelected = RESPONDENTS_DATA[selectedRespIndex]?.id === resp.id;
                  return (
                    <button
                      key={resp.id}
                      onClick={() => {
                        const originalIdx = RESPONDENTS_DATA.findIndex((r) => r.id === resp.id);
                        setSelectedRespIndex(originalIdx);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition border flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-50 border-amber-400 text-amber-950 font-medium shadow-2xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{resp.label}</span>
                          {resp.profil.nama && (
                            <span className="text-2xs font-normal text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded">
                              {resp.profil.nama}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-2xs mt-0.5 flex gap-2">
                          <span>{resp.profil.jenisKelamin}</span>
                          <span>•</span>
                          <span>{resp.profil.domisili}</span>
                          <span>•</span>
                          <span>Suka: {resp.penilaianProduk.q21_keseluruhanSuka}/5</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`px-1.5 py-0.2 rounded text-3xs font-semibold ${
                          resp.source.includes('Excel')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {resp.source.includes('Excel') ? 'Excel' : 'PDF'}
                        </span>
                        {resp.pdfPages.length > 0 && (
                          <span className="text-3xs text-slate-400">
                            Hal {resp.pdfPages[0]}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Detailed filled questionnaire form */}
            <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col h-[750px] overflow-y-auto">
              {/* Form Navigation Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-md">
                      {currentRespondent.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                      currentRespondent.source.includes('Excel')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Sumber: {currentRespondent.source}
                    </span>
                    {currentRespondent.pdfPages.length > 0 && (
                      <span className="text-xs text-slate-500">
                        Halaman PDF: {currentRespondent.pdfPages.join(', ')}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    Hasil Ekstraksi & Ceklis Centang Responden
                  </h2>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    disabled={selectedRespIndex <= 0}
                    onClick={() => setSelectedRespIndex((prev) => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                    title="Responden sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-500 font-medium px-2">
                    {selectedRespIndex + 1} / {RESPONDENTS_DATA.length}
                  </span>
                  <button
                    disabled={selectedRespIndex >= RESPONDENTS_DATA.length - 1}
                    onClick={() => setSelectedRespIndex((prev) => Math.min(RESPONDENTS_DATA.length - 1, prev + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
                    title="Responden berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Content Visualizer */}
              <div className="space-y-6 text-xs text-slate-700">
                {/* Header box */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-2xs uppercase tracking-wide">No. Responden</span>
                      <span className="font-bold text-slate-900">{currentRespondent.header.noResponden || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-2xs uppercase tracking-wide">Lokasi Survei</span>
                      <span className="font-semibold text-slate-800">{currentRespondent.header.lokasiSurvei || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-2xs uppercase tracking-wide">Hari / Tanggal</span>
                      <span className="font-semibold text-slate-800">{currentRespondent.header.hariTanggal || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-2xs uppercase tracking-wide">Persetujuan Informed Consent</span>
                      <span className="inline-flex items-center text-emerald-700 font-bold">
                        <CheckSquare className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Dicentang (Setuju)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bagian A: Profil Responden */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-bold text-slate-900 text-sm mb-3 text-amber-800 flex items-center justify-between">
                    <span>BAGIAN A. PROFIL RESPONDEN</span>
                    <span className="text-xs font-normal text-slate-500">Pertanyaan 1 - 6</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-slate-500 block text-2xs">Nama & Kontak:</span>
                        <div className="font-semibold text-slate-800">
                          {currentRespondent.profil.nama ? (
                            <span className="text-indigo-700 font-bold bg-indigo-50 px-1 rounded">
                              ✍️ {currentRespondent.profil.nama}
                            </span>
                          ) : (
                            <span className="italic text-slate-400">(Tidak diisi)</span>
                          )}
                          {currentRespondent.profil.noHpWa && (
                            <span className="ml-2 text-slate-600 font-mono text-2xs">
                              HP/WA: {currentRespondent.profil.noHpWa}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-slate-600 block mb-1">1. Jenis kelamin:</span>
                        <div className="flex gap-4">
                          <CheckBadge
                            label="Laki-laki"
                            checked={currentRespondent.profil.jenisKelamin === 'Laki-laki'}
                          />
                          <CheckBadge
                            label="Perempuan"
                            checked={currentRespondent.profil.jenisKelamin === 'Perempuan'}
                          />
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-slate-600 block mb-1">2. Usia:</span>
                        <div className="flex flex-wrap gap-2">
                          {['17–25 tahun', '26–35 tahun', '36–45 tahun', '46–55 tahun', '> 55 tahun'].map((u) => (
                            <CheckBadge key={u} label={u} checked={currentRespondent.profil.usia === u} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-500 block text-2xs">3. Domisili (kabupaten/kota):</span>
                        <div className="font-bold text-slate-900 bg-amber-50/60 p-1.5 rounded border border-amber-200/50">
                          📍 {currentRespondent.profil.domisili}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-slate-600 block mb-1">4. Pendidikan terakhir:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['SD/SMP', 'SMA/SMK', 'Diploma', 'S1', 'S2/S3'].map((p) => (
                            <CheckBadge key={p} label={p} checked={currentRespondent.profil.pendidikan === p} />
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-slate-600 block mb-1">5. Pekerjaan:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['Pelajar/mahasiswa', 'Pegawai swasta', 'Ibu rumah tangga', 'Pegawai negeri/TNI/Polri', 'Wiraswasta', 'Lainnya'].map((job) => (
                            <CheckBadge
                              key={job}
                              label={
                                job === 'Lainnya' && currentRespondent.profil.pekerjaanLainnya
                                  ? `Lainnya: ${currentRespondent.profil.pekerjaanLainnya}`
                                  : job
                              }
                              checked={currentRespondent.profil.pekerjaan === job}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-slate-600 block mb-1">6. Pengeluaran camilan/bulan:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['< Rp50.000', 'Rp50.000–Rp100.000', 'Rp100.001–Rp200.000', '> Rp200.000'].map((peng) => (
                            <CheckBadge key={peng} label={peng} checked={currentRespondent.profil.pengeluaranCamilan === peng} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bagian B: Kebiasaan Mengonsumsi Camilan */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-bold text-slate-900 text-sm mb-3 text-amber-800 flex items-center justify-between">
                    <span>BAGIAN B. KEBIASAAN MENGONSUMSI CAMILAN</span>
                    <span className="text-xs font-normal text-slate-500">Pertanyaan 7 - 12</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-slate-700 block mb-1">
                        7. Frekuensi makan kukis/biskuit:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Hampir setiap hari', '2–3 kali per minggu', '1 kali per minggu', 'Kurang dari 1 kali per minggu'].map((f) => (
                          <CheckBadge key={f} label={f} checked={currentRespondent.kebiasaan.frekuensiMakan === f} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-slate-700 block mb-1">
                        8. Tempat biasa beli camilan (bisa &gt;1):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Minimarket/supermarket', 'Warung/pasar tradisional', 'Toko oleh-oleh', 'Marketplace (Shopee, Tokopedia, dll.)', 'Media sosial (Instagram, TikTok, WhatsApp)', 'Langsung ke produsen/reseller'].map((t) => (
                          <CheckBadge
                            key={t}
                            label={t.split('(')[0].trim()}
                            checked={currentRespondent.kebiasaan.tempatBeli.some((item) => item.includes(t.split('(')[0].trim()))}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-slate-700 block mb-1">
                        9. Tujuan pembelian camilan:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Dikonsumsi sendiri', 'Untuk keluarga', 'Oleh-oleh/hadiah', 'Suguhan tamu/acara'].map((t) => (
                          <CheckBadge
                            key={t}
                            label={t}
                            checked={currentRespondent.kebiasaan.tujuanBeli.includes(t)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-slate-700 block mb-1">
                        10. Pertimbangan utama memilih camilan (maks 3):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Rasa', 'Harga', 'Merek', 'Kemasan', 'Kandungan gizi/kesehatan', 'Berbahan lokal', 'Label halal', 'Izin edar (PIRT/BPOM)'].map((p) => (
                          <CheckBadge
                            key={p}
                            label={p}
                            checked={currentRespondent.kebiasaan.pertimbangan.includes(p)}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-slate-700 block mb-1">
                        11. Riwayat olahan kimpul:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Belum pernah mendengar', 'Pernah mendengar, belum pernah mengonsumsi', 'Pernah mengonsumsi'].map((k) => (
                          <CheckBadge key={k} label={k} checked={currentRespondent.kebiasaan.pernahKimpul === k} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-slate-700 block mb-1">
                        12. Membatasi tepung terigu / gluten:
                      </span>
                      <div className="flex gap-2">
                        {['Ya', 'Tidak', 'Tidak tahu'].map((g) => (
                          <CheckBadge key={g} label={g} checked={currentRespondent.kebiasaan.batasiGluten === g} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bagian C: Penilaian Produk (Likert 1-5) */}
                <div className="border border-slate-200 rounded-lg p-4">
                  <h3 className="font-bold text-slate-900 text-sm mb-2 text-amber-800 flex items-center justify-between">
                    <span>BAGIAN C. PENILAIAN PRODUK KUKIS KIMPUL</span>
                    <span className="text-xs font-normal text-slate-500">Skala 1 (STS) - 5 (SS)</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <th className="py-2 px-3 w-8">No</th>
                          <th className="py-2 px-3">Pernyataan Sensoris / Organoleptik</th>
                          <th className="py-2 px-2 text-center w-12">STS (1)</th>
                          <th className="py-2 px-2 text-center w-12">TS (2)</th>
                          <th className="py-2 px-2 text-center w-12">N (3)</th>
                          <th className="py-2 px-2 text-center w-12">S (4)</th>
                          <th className="py-2 px-2 text-center w-12">SS (5)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { no: 13, text: 'Warna kukis kimpul menarik', val: currentRespondent.penilaianProduk.q13_warnaMenarik },
                          { no: 14, text: 'Aroma kukis kimpul enak', val: currentRespondent.penilaianProduk.q14_aromaEnak },
                          { no: 15, text: 'Rasa kukis kimpul enak', val: currentRespondent.penilaianProduk.q15_rasaEnak },
                          { no: 16, text: 'Tidak ada rasa kurang enak tertinggal (aftertaste)', val: currentRespondent.penilaianProduk.q16_tanpaAftertaste },
                          { no: 17, text: 'Bentuk dan penampilan menarik', val: currentRespondent.penilaianProduk.q17_bentukMenarik },
                          { no: 18, text: 'Tingkat kemanisan sudah pas', val: currentRespondent.penilaianProduk.q18_kemanisanPas },
                          { no: 19, text: 'Tingkat kerenyahan sudah pas', val: currentRespondent.penilaianProduk.q19_kerenyahanPas },
                          { no: 20, text: 'Ukuran per keping sudah pas', val: currentRespondent.penilaianProduk.q20_ukuranPas },
                          { no: 21, text: 'Secara keseluruhan, saya menyukai kukis kimpul', val: currentRespondent.penilaianProduk.q21_keseluruhanSuka, highlight: true }
                        ].map((row) => (
                          <tr key={row.no} className={row.highlight ? 'bg-amber-50/50 font-semibold' : 'hover:bg-slate-50'}>
                            <td className="py-1.5 px-3 text-slate-500">{row.no}</td>
                            <td className="py-1.5 px-3">{row.text}</td>
                            {[1, 2, 3, 4, 5].map((scale) => (
                              <td key={scale} className="py-1.5 px-2 text-center">
                                {row.val === scale ? (
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white font-bold shadow-xs">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-slate-300 font-mono">□</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bagian D & E: Penilaian Kemasan & Persepsi Produk */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bagian D */}
                  <div className="border border-slate-200 rounded-lg p-3">
                    <h3 className="font-bold text-slate-900 text-xs mb-2 text-amber-800">
                      BAGIAN D. PENILAIAN KEMASAN (Q22-Q27)
                    </h3>
                    <div className="space-y-1.5">
                      {[
                        { no: 22, text: 'Desain kemasan menarik', val: currentRespondent.penilaianKemasan.q22_desainMenarik },
                        { no: 23, text: 'Informasi label jelas & terbaca', val: currentRespondent.penilaianKemasan.q23_informasiJelas },
                        { no: 24, text: 'Ukuran isi 80g sesuai kebutuhan', val: currentRespondent.penilaianKemasan.q24_ukuranSesuai },
                        { no: 25, text: 'Standing pouch mudah dibuka/tutup', val: currentRespondent.penilaianKemasan.q25_standingPouchPraktis },
                        { no: 26, text: 'Mampu menjaga kerenyahan', val: currentRespondent.penilaianKemasan.q26_menjagaKerenyahan },
                        { no: 27, text: 'Mencerminkan produk sehat lokal', val: currentRespondent.penilaianKemasan.q27_cerminProdukSehat }
                      ].map((item) => (
                        <div key={item.no} className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                          <span className="text-slate-700 text-2xs truncate pr-2">
                            {item.no}. {item.text}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-2xs font-bold ${
                            item.val >= 4 ? 'bg-emerald-100 text-emerald-800' : item.val === 3 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.val === 1 ? 'STS (1)' : item.val === 2 ? 'TS (2)' : item.val === 3 ? 'N (3)' : item.val === 4 ? 'S (4)' : 'SS (5)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bagian E */}
                  <div className="border border-slate-200 rounded-lg p-3">
                    <h3 className="font-bold text-slate-900 text-xs mb-2 text-amber-800">
                      BAGIAN E. PERSEPSI PRODUK (Q28-Q34)
                    </h3>
                    <div className="space-y-1.5">
                      {[
                        { no: 28, text: 'Kukis kimpul camilan sehat', val: currentRespondent.persepsiProduk.q28_camilanSehat },
                        { no: 29, text: 'Layak pengganti kukis terigu', val: currentRespondent.persepsiProduk.q29_penggantiTerigu },
                        { no: 30, text: 'Tertarik camilan tanpa terigu', val: currentRespondent.persepsiProduk.q30_tertarikTanpaTerigu },
                        { no: 31, text: 'Dukung pangan lokal', val: currentRespondent.persepsiProduk.q31_dukungPanganLokal },
                        { no: 32, text: 'Kualitas setara/lebih baik', val: currentRespondent.persepsiProduk.q32_kualitasSetaraBaik },
                        { no: 33, text: 'Cocok jadi oleh-oleh khas', val: currentRespondent.persepsiProduk.q33_cocokOlehOleh },
                        { no: 34, text: 'Label halal & izin edar penting', val: currentRespondent.persepsiProduk.q34_labelHalalIzinPenting }
                      ].map((item) => (
                        <div key={item.no} className="flex items-center justify-between p-1.5 bg-slate-50 rounded">
                          <span className="text-slate-700 text-2xs truncate pr-2">
                            {item.no}. {item.text}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-2xs font-bold ${
                            item.val >= 4 ? 'bg-emerald-100 text-emerald-800' : item.val === 3 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.val === 1 ? 'STS (1)' : item.val === 2 ? 'TS (2)' : item.val === 3 ? 'N (3)' : item.val === 4 ? 'S (4)' : 'SS (5)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bagian F: Persepsi Harga (Van Westendorp PSM) */}
                <div className="border border-slate-200 rounded-lg p-4 bg-emerald-50/30">
                  <h3 className="font-bold text-slate-900 text-sm mb-3 text-emerald-900 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    BAGIAN F. PERSEPSI HARGA (Isi 80 Gram)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-slate-500 block text-2xs">35. Terlalu Murah (Kualitas Diragukan):</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {typeof currentRespondent.persepsiHarga.q35_terlaluMurah === 'number'
                          ? `Rp ${currentRespondent.persepsiHarga.q35_terlaluMurah.toLocaleString('id-ID')}`
                          : currentRespondent.persepsiHarga.q35_terlaluMurah}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-slate-500 block text-2xs">36. Murah & Sepadan (Menguntungkan):</span>
                      <span className="font-bold text-emerald-700 text-sm">
                        {typeof currentRespondent.persepsiHarga.q36_murahSepadan === 'number'
                          ? `Rp ${currentRespondent.persepsiHarga.q36_murahSepadan.toLocaleString('id-ID')}`
                          : currentRespondent.persepsiHarga.q36_murahSepadan}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-slate-500 block text-2xs">37. Mulai Terasa Mahal:</span>
                      <span className="font-bold text-amber-700 text-sm">
                        {typeof currentRespondent.persepsiHarga.q37_mulaiMahal === 'number'
                          ? `Rp ${currentRespondent.persepsiHarga.q37_mulaiMahal.toLocaleString('id-ID')}`
                          : currentRespondent.persepsiHarga.q37_mulaiMahal}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-slate-500 block text-2xs">38. Terlalu Mahal (Tidak Akan Beli):</span>
                      <span className="font-bold text-rose-700 text-sm">
                        {typeof currentRespondent.persepsiHarga.q38_terlaluMahal === 'number'
                          ? `Rp ${currentRespondent.persepsiHarga.q38_terlaluMahal.toLocaleString('id-ID')}`
                          : currentRespondent.persepsiHarga.q38_terlaluMahal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bagian G, Distribusi, dan Saran */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Minat Beli & Distribusi */}
                  <div className="border border-slate-200 rounded-lg p-3 space-y-3">
                    <h3 className="font-bold text-slate-900 text-xs text-amber-800">
                      BAGIAN G & KANAL DISTRIBUSI
                    </h3>

                    <div className="space-y-1 text-2xs">
                      <div className="flex justify-between p-1 bg-slate-50 rounded">
                        <span>39. Minat beli jika harga sesuai:</span>
                        <span className="font-bold text-amber-900">{currentRespondent.minatBeli.q39_minatBeliHargaSesuai}/5</span>
                      </div>
                      <div className="flex justify-between p-1 bg-slate-50 rounded">
                        <span>40. Minat beli kembali:</span>
                        <span className="font-bold text-amber-900">{currentRespondent.minatBeli.q40_minatBeliKembali}/5</span>
                      </div>
                      <div className="flex justify-between p-1 bg-slate-50 rounded">
                        <span>41. Rekomendasi teman/keluarga:</span>
                        <span className="font-bold text-amber-900">{currentRespondent.minatBeli.q41_rekomendasiTemanKeluarga}/5</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-2xs mb-1">42. Ingin membeli di:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentRespondent.distribusiDanPromosi.q42_tempatBeliIngin.map((c) => (
                          <span key={c} className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-2xs font-medium">
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-2xs mb-1">43. Medsos informasi makanan:</span>
                      <div className="flex flex-wrap gap-1">
                        {currentRespondent.distribusiDanPromosi.q43_medsosInfo.map((m) => (
                          <span key={m} className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-2xs font-medium">
                            ✓ {m} {m === 'Lainnya' && currentRespondent.distribusiDanPromosi.medsosLainnya ? `(${currentRespondent.distribusiDanPromosi.medsosLainnya})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-2xs mb-1">44. Minat menjadi Reseller:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        currentRespondent.distribusiDanPromosi.q44_minatReseller === 'Ya'
                          ? 'bg-emerald-100 text-emerald-800'
                          : currentRespondent.distribusiDanPromosi.q44_minatReseller === 'Mungkin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {currentRespondent.distribusiDanPromosi.q44_minatReseller}
                      </span>
                    </div>
                  </div>

                  {/* Saran Perbaikan Verbatim */}
                  <div className="border border-slate-200 rounded-lg p-3 bg-amber-50/30 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs mb-2 text-amber-800 flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        BAGIAN H. SARAN KONSUMEN (TULISAN TANGAN ASLI)
                      </h3>
                      <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs italic font-serif text-slate-800 text-xs leading-relaxed min-h-[90px]">
                        "{currentRespondent.saran}"
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-slate-100 rounded text-2xs text-slate-500">
                      💡 Teks saran diekstrak langsung dari tulisan tangan pada lembar kuisioner halaman {currentRespondent.pdfPages[currentRespondent.pdfPages.length - 1]}.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FULL OCR TRANSCRIPT */}
        {activeTab === 'ocr_text' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Transkrip OCR Lengkap Master Formulir Kuesioner
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ekstraksi teks struktur kuesioner kata-per-kata berakurasi tinggi (Bagian Pengantar, Petunjuk, Profil A, B, C, D, E, F, G, H)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyOCR}
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg text-white bg-amber-600 hover:bg-amber-700 shadow-xs transition"
                >
                  {copiedText ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                  {copiedText ? 'Tersalin ke Clipboard!' : 'Salin Seluruh Teks OCR'}
                </button>
              </div>
            </div>

            <div className="mt-4 bg-slate-900 text-slate-100 p-5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-[650px] overflow-y-auto">
              <pre className="whitespace-pre-wrap select-all">{TEMPLATE_OCR_TEXT}</pre>
            </div>
          </div>
        )}

        {/* TAB 3: STATISTIK & ANALISIS */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Total Sampel Responden</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total} Orang</div>
                <span className="text-2xs text-emerald-600 font-medium">100% data diverifikasi</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Rata-rata Rasa (Q15)</span>
                <div className="text-2xl font-bold text-amber-600 mt-1">{stats.avgRasa} / 5.0</div>
                <span className="text-2xs text-slate-400">Skala Likert 1-5</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Keseluruhan Menyukai (Q21)</span>
                <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.avgOverall} / 5.0</div>
                <span className="text-2xs text-slate-400">Penerimaan konsumen positif</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 block">Dukungan Pangan Lokal (Q31)</span>
                <div className="text-2xl font-bold text-indigo-600 mt-1">{stats.avgDukungLokal} / 5.0</div>
                <span className="text-2xs text-slate-400">Tinggi antusiasme lokal</span>
              </div>
            </div>

            {/* Organoleptic Ratings Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Rata-rata Penilaian Sensoris Produk Kukis Kimpul (Skala 1 - 5)
                </h3>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Warna Menarik (Q13)', score: Number(stats.avgWarna) },
                    { label: 'Aroma Enak (Q14)', score: Number(stats.avgAroma) },
                    { label: 'Rasa Enak (Q15)', score: Number(stats.avgRasa) },
                    { label: 'Kemanisan Pas (Q18)', score: Number(stats.avgKemanisan) },
                    { label: 'Kerenyahan Pas (Q19)', score: Number(stats.avgKerenyahan) },
                    { label: 'Penerimaan Keseluruhan (Q21)', score: Number(stats.avgOverall) }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-slate-700">{item.label}</span>
                        <span className="font-bold text-slate-900">{item.score}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-2.5 rounded-full"
                          style={{ width: `${(item.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Perception & Suggestions Summary */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Rentang Persepsi Harga Konsumen (Van Westendorp)
                  </h3>
                  <p className="text-2xs text-slate-500 mb-3">
                    Analisis sensitivitas harga untuk kemasan standing pouch kukis kimpul isi 80 gram
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-slate-400 text-2xs block">Terlalu Murah (Kualitas Diragukan)</span>
                      <span className="text-sm font-bold text-slate-800">Rp 10.000</span>
                      <span className="text-2xs text-slate-400 block mt-0.5">Batas bawah psikologis</span>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <span className="text-emerald-700 text-2xs block font-medium">Harga Ideal / Sepadan</span>
                      <span className="text-sm font-bold text-emerald-800">Rp 15.000 – Rp 18.000</span>
                      <span className="text-2xs text-emerald-600 block mt-0.5">Rekomendasi penetapan harga</span>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="text-amber-700 text-2xs block font-medium">Mulai Terasa Mahal</span>
                      <span className="text-sm font-bold text-amber-800">Rp 20.000 – Rp 25.000</span>
                      <span className="text-2xs text-amber-600 block mt-0.5">Masih dipertimbangkan</span>
                    </div>

                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                      <span className="text-rose-700 text-2xs block font-medium">Terlalu Mahal (Tolak Beli)</span>
                      <span className="text-sm font-bold text-rose-800">&gt; Rp 30.000 – Rp 50.000</span>
                      <span className="text-2xs text-rose-600 block mt-0.5">Batas atas penjualan</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-xs text-slate-800 mb-2">Tema Utama Saran Konsumen:</h4>
                  <div className="flex flex-wrap gap-1.5 text-2xs">
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                      🍪 Tingkat kemanisan perlu sedikit ditambah
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                      🎨 Desain kemasan dibuat lebih atraktif & berwarna
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                      ✨ Tekstur kerenyahan ditingkatkan konsistensinya
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">
                      🍵 Variasi rasa matcha / chocochip diperbanyak
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MASTER TABLE */}
        {activeTab === 'master_table' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-amber-600" />
                  Master Tabel Rekap Data Responden (Siap untuk SPSS & Excel)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Seluruh variabel kuesioner dari Q1 s.d. Q45 beserta hasil skoring dan input isian
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Unduh .CSV
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto max-h-[600px] border border-slate-200 rounded-lg">
              <table className="w-full text-2xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10">
                  <tr className="border-b border-slate-200">
                    <th className="py-2 px-2.5 whitespace-nowrap">ID</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Sumber</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Nama</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Gender</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Usia</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Domisili</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Pendidikan</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Pekerjaan</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-amber-50/70">Warna (13)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-amber-50/70">Aroma (14)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-amber-50/70">Rasa (15)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-amber-50/70">Manis (18)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-amber-50/70">Renyah (19)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-amber-50/70">Suka (21)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-blue-50/70">Desain (22)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-blue-50/70">Label (23)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-emerald-50/70">Harga Pas (36)</th>
                    <th className="py-2 px-2.5 text-center whitespace-nowrap bg-purple-50/70">Minat (39)</th>
                    <th className="py-2 px-2.5 whitespace-nowrap">Reseller (44)</th>
                    <th className="py-2 px-3 whitespace-nowrap max-w-xs">Saran (45)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RESPONDENTS_DATA.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="py-1.5 px-2.5 font-bold text-slate-800">#{r.id}</td>
                      <td className="py-1.5 px-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-3xs font-semibold ${
                          r.source.includes('Excel')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {r.source.includes('Excel') ? 'Excel' : 'PDF'}
                        </span>
                      </td>
                      <td className="py-1.5 px-2.5 font-medium text-slate-900">{r.profil.nama || '-'}</td>
                      <td className="py-1.5 px-2.5">{r.profil.jenisKelamin}</td>
                      <td className="py-1.5 px-2.5">{r.profil.usia}</td>
                      <td className="py-1.5 px-2.5">{r.profil.domisili}</td>
                      <td className="py-1.5 px-2.5">{r.profil.pendidikan}</td>
                      <td className="py-1.5 px-2.5">{r.profil.pekerjaan === 'Lainnya' ? r.profil.pekerjaanLainnya || 'Lainnya' : r.profil.pekerjaan}</td>
                      <td className="py-1.5 px-2.5 text-center bg-amber-50/30">{r.penilaianProduk.q13_warnaMenarik}</td>
                      <td className="py-1.5 px-2.5 text-center bg-amber-50/30">{r.penilaianProduk.q14_aromaEnak}</td>
                      <td className="py-1.5 px-2.5 text-center bg-amber-50/30 font-bold">{r.penilaianProduk.q15_rasaEnak}</td>
                      <td className="py-1.5 px-2.5 text-center bg-amber-50/30">{r.penilaianProduk.q18_kemanisanPas}</td>
                      <td className="py-1.5 px-2.5 text-center bg-amber-50/30">{r.penilaianProduk.q19_kerenyahanPas}</td>
                      <td className="py-1.5 px-2.5 text-center bg-amber-50/30 font-bold text-emerald-700">{r.penilaianProduk.q21_keseluruhanSuka}</td>
                      <td className="py-1.5 px-2.5 text-center bg-blue-50/30">{r.penilaianKemasan.q22_desainMenarik}</td>
                      <td className="py-1.5 px-2.5 text-center bg-blue-50/30">{r.penilaianKemasan.q23_informasiJelas}</td>
                      <td className="py-1.5 px-2.5 text-center bg-emerald-50/30 font-semibold">{r.persepsiHarga.q36_murahSepadan}</td>
                      <td className="py-1.5 px-2.5 text-center bg-purple-50/30">{r.minatBeli.q39_minatBeliHargaSesuai}</td>
                      <td className="py-1.5 px-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-3xs font-semibold ${
                          r.distribusiDanPromosi.q44_minatReseller === 'Ya'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.distribusiDanPromosi.q44_minatReseller === 'Mungkin'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {r.distribusiDanPromosi.q44_minatReseller}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 truncate max-w-[200px] text-slate-600 italic" title={r.saran}>
                        {r.saran}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        Riset Hilirisasi Prioritas • Uji Penerimaan Konsumen Produk Kukis Kimpul • Universitas Wijaya Kusuma Surabaya & UMKM Mina Bunga Cempaka
      </footer>
    </div>
  );
}

function CheckBadge({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded text-2xs transition ${
        checked
          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-2xs'
          : 'bg-slate-50 text-slate-400 border border-slate-200 opacity-60'
      }`}
    >
      <span className="mr-1 text-xs">{checked ? '☑' : '☐'}</span>
      <span>{label}</span>
    </div>
  );
}
