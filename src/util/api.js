import axios from "axios";

const API = axios.create({
    baseURL: "https://aiko-estagio-proxy.azurewebsites.net/",
    params: {
        token: process.env.TOKEN
    }
});

export default API;
