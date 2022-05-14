import axios from 'axios'

export {
    authUsers
};

const apiURL = process.env.REACT_APP_BASE_API;

function authUsers(data) {
    return axios.post(`${apiURL}/login`, data);
}

// export default axios.create({
//     baseURL:`${process.env.REACT_APP_BASE_API}`
// })