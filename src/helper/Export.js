import { alignment, defaultDataType } from 'export-xlsx';

// Export settings
export const rekap_jp = {
    // Table settings
    fileName: 'Rekap JP',
    workSheets: [
        {
            sheetName: 'Rekap',
            startingRowNumber: 1,
            // gapBetweenTwoTables: 1,
            tableSettings: {
                tabel_rekap_jp: {
                    tableTitle: "Rekap Jam Pelajaran",
                    headerDefinition: [
                        {
                            name: '#',
                            key: 'number',
                        },
                        {
                            name: 'Nama',
                            key: 'nama',
                        },
                        {
                            name: 'Jenis Kepegawaian',
                            key: 'jenis_kepegawaian',
                        },
                        {
                            name: 'Jabatan',
                            key: 'jabatan',
                        },
                        {
                            name: 'Penempatan',
                            key: 'penempatan',
                        },
                        {
                            name: 'Jumlah JP',
                            key: 'jumlah_jp',
                        },
                        {
                            name: 'Keterangan',
                            key: 'keterangan',
                        },
                    ],
                }
            }
        },
    ],
};

export const rekap_kegiatan = {
    // Table settings
    fileName: 'Rekap Kegiatan',
    workSheets: [
        {
            sheetName: 'Rekap',
            startingRowNumber: 1,
            // gapBetweenTwoTables: 1,
            tableSettings: {
                tabel_rekap_kegiatan: {
                    tableTitle: "Rekap Kegiatan",
                    headerDefinition: [
                        {
                            name: '#',
                            key: 'number',
                        },
                        {
                            name: 'Nama Kegiatan',
                            key: 'nama_pelatihan',
                        },
                        {
                            name: 'Penyelenggara',
                            key: 'nama_penyelenggara',
                        },
                        {
                            name: 'Kompetensi',
                            key: 'kompetensi',
                        },
                        {
                            name: 'Sub Kompetensi',
                            key: 'sub_kompetensi',
                        },
                        {
                            name: 'Metode Pelatihan',
                            key: 'metode_pelatihan',
                        },
                        {
                            name: 'Jalur Pelatihan',
                            key: 'jalur_pelatihan',
                        },
                        {
                            name: 'Status Kegiatan',
                            key: 'status_kegiatan_fix',
                        },
                        {
                            name: 'Status Administrasi',
                            key: 'status_administrasi_fix',
                        },
                        {
                            name: 'Jumlah JP',
                            key: 'jml_jp',
                        },
                        {
                            name: 'Tanggal Mulai',
                            key: 'tgl_mulai',
                        },
                        {
                            name: 'Tanggal Selesai',
                            key: 'tgl_selesai',
                        },
                        {
                            name: 'Jenis Dokumen',
                            key: 'jenis_dokumen_fix',
                        },
                        {
                            name: 'File Surat',
                            key: 'file_original_fix',
                        },
                    ],
                }
            }
        },
    ],
};