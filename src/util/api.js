import axios from "axios";

const API = axios.create({
    baseURL: "https://aiko-estagio-proxy.azurewebsites.net/",
    params: {
        token: process.env.VUE_APP_TOKEN
    }
});

API.get = async function(route, params = {}, repeat = true) {
    try {
        return await axios.get(API.defaults.baseURL + route, params);
    } catch (error) {
        const code = error.response.status;

        if (code === 401 && repeat) {
            await API.post("Login/Autenticar", null, {
                params: {
                    token: process.env.VUE_APP_TOKEN
                }
            });

            return API.get(route, params, false);
        } else {
            throw error;
        }
    }
};

export default API;
