import axios from 'axios'
const token = localStorage.getItem("remember_me") ? JSON.parse(localStorage.getItem("remember_me")).access_token : sessionStorage.getItem("remember_me") ? JSON.parse(sessionStorage.getItem("remember_me")).access_token : '';
const apiURL = process.env.REACT_APP_BASE_API;
const apiClient = axios.create({
    baseURL: apiURL,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        Authorization: "Bearer " + token
    }
})


//V3 Cara Fikr
// export default {
//     getListPegawai(param){
//         return apiClient.post(`/refresh`);
//     },
// }

//V2 Cara Alternatif Amed
class ServiceApi {
    authUsers(data) {
        return axios.post(`${apiURL}/login`, data);
    };

    getSelect(data) {
        return apiClient.post(`/data/select-option/default`, data);
    }

    getListPegawai() {
        return apiClient.get(`/master/pegawai/getData?page=&length=&search=`);
    }

    getPangkat(param) {
        return apiClient.get(`/master/golongan-pangkat/getData?${param}`)
    }

    addPangkat(data) {
        return apiClient.post(`/master/golongan-pangkat/create`, data)
    }

    editPangkat(data) {
        return apiClient.post(`/master/golongan-pangkat/update`, data)
    }

    deletePangkat(data) {
        return apiClient.post(`/master/golongan-pangkat/delete`, data)
    }

    getJabatan(param) {
        return apiClient.get(`/master/jabatan/getData?${param}`)
    }

    getDetailJabatan(id) {
        return apiClient.get(`/master/jabatan/detail/${id}`)
    }

    addJabatan(data) {
        return apiClient.post(`/master/jabatan/create`, data)
    }

    editJabatan(data) {
        return apiClient.post(`/master/jabatan/update`, data)
    }

    deleteJabatan(data) {
        return apiClient.post(`/master/jabatan/delete`, data)
    }
    
    getKlasifikasi(param) {
        return apiClient.get(`/master/klasifikasi-jabatan/getData?${param}`)
    }

    getDetailKlasifikasi(id) {
        return apiClient.get(`/master/klasifikasi-jabatan/detail/${id}`)
    }

    addKlasifikasi(data) {
        return apiClient.post(`/master/klasifikasi-jabatan/create`, data)
    }

    editKlasifikasi(data) {
        return apiClient.post(`/master/klasifikasi-jabatan/update`, data)
    }

    deleteKlasifikasi(data) {
        return apiClient.post(`/master/klasifikasi-jabatan/delete`, data)
    }

    getKategori(param) {
        return apiClient.get(`/master/kategori-jabatan/getData?${param}`)
    }

    addKategori(data) {
        return apiClient.post(`/master/kategori-jabatan/create`, data)
    }

    editKategori(data) {
        return apiClient.post(`/master/kategori-jabatan/update`, data)
    }

    deleteKategori(data) {
        return apiClient.post(`/master/kategori-jabatan/delete`, data)
    }

    getListUnit(param) {
        return apiClient.get(`/master/unit-kerja/getData?${param}`)
    }

    addUnitKerja(data) {
        return apiClient.post(`/master/unit-kerja/create`, data)
    }

    editUnitKerja(data) {
        return apiClient.post(`/master/unit-kerja/update`, data)
    }

    deleteUnitKerja(data) {
        return apiClient.post(`/master/unit-kerja/delete`, data)
    }

    getPenempatan(param) {
        return apiClient.get(`/master/penempatan/getData?${param}`)
    }

    addPenempatan(data) {
        return apiClient.post(`/master/penempatan/create`, data)
    }

    editPenempatan(data) {
        return apiClient.post(`/master/penempatan/update`, data)
    }

    deletePenempatan(data) {
        return apiClient.post(`/master/penempatan/delete`, data)
    }

    getManajemenUser(param) {
        return apiClient.get(`/master/user/getData?${param}`)
    }
}
export default ServiceApi;

//V1
// export {
//     authUsers
// };

// const apiURL = process.env.REACT_APP_BASE_API;

// function authUsers(data) {
//     return axios.post(`${apiURL}/login`, data);
// }

// export default axios.create({
//     baseURL:`${process.env.REACT_APP_BASE_API}`
// })