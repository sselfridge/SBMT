import axios from "axios";
import { deepFreeze } from "utils/helperFuncs";

const Api = axios.create({ baseURL: "/", timeout: 1500 });

export const ApiGet = (url, setValue, setOnError, onError) => {
  Api.get(url)
    .then((response) => {
      if (response.status === 200) setValue(deepFreeze(response.data));
    })
    .catch((err) => {
      if (setOnError) setValue(onError);
      console.error(err);
    });
};

export default Api;
