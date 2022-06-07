import _ from "lodash"

export const longText = (text) => {
    return _.isString(text) ? text.length > 40 ? text.substring(0, 33) + "..." : text : '-';
}

export const capitalize = (str) => {
    const lower = str.toLowerCase();
    return str.charAt(0).toUpperCase() + lower.slice(1);
}

export const listJenisDokumen = [
    { value: null, label: 'Tidak Mencantumkan Dokumen' },
    { value: 1, label: 'Surat Tugas' },
    { value: 2, label: 'Brosur' },
    { value: 3, label: 'Undangan' },
    //{ value: 4, label: 'Daftar Hadir' },
    { value: 5, label: 'Daftar Hadir Peserta' }
]