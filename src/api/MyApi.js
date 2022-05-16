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
    authUsers(data){
        return axios.post(`${apiURL}/login`, data);
    };

    getListPegawai(){
        return apiClient.get(`/master/pegawai/getData?page=&length=&search=`);
    }

    getListUnit(param){
        return apiClient.get(`/master/unit-kerja/getData?${param}`)
    }

    addUnitKerja(data){
        return apiClient.post(`/master/unit-kerja/create`, data)
    }

    editUnitKerja(data){
        return apiClient.post(`/master/unit-kerja/update`, data)
    }

    deleteUnitKerja(data){
        return apiClient.post(`/master/unit-kerja/delete`, data)
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