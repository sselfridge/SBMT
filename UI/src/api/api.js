import axios from "axios";

const Api = axios.create({ baseURL: "/", timeout: 1500 });

export default Api;
