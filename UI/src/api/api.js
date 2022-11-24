import axios from "axios";
import { deepFreeze } from "utils/helperFuncs";

const Api = axios.create({
  baseURL: "/",
  // timeout: 1500
});
export let rateLimit = -1;

Api.interceptors.response.use(
  function (response) {
    rateLimit = response.headers["x-usage-15"];

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
 *
 * @param {string} url
 * @param {func} setValue
 * @param {bool} setOnError
 * @param {any} onError
 */
export const ApiGet = (url, setValue, onError, setErrorUndefined) => {
  Api.get(url)
    .then((response) => {
      if (response.status === 200) setValue(deepFreeze(response.data));
    })
    .catch((err) => {
      if (onError !== undefined || setErrorUndefined) setValue(onError);
      console.error(err);
    });
};

export const ApiDelete = (
  url,
  setValue,
  onSuccess,
  setOnError = false,
  onError
) => {
  Api.delete(url)
    .then((response) => {
      setValue(onSuccess);
    })
    .catch((err) => {
      if (setOnError) setValue(onError);
      console.error(err);
    });
};

export const ApiPost = (url, body, setValue, onError, setErrorUndefined) => {
  Api.post(url, body)
    .then((response) => {
      if (response.status === 201) setValue(deepFreeze(response.data));
    })
    .catch((err) => {
      if (onError !== undefined || setErrorUndefined) setValue(onError);
      console.error(err);
    });
};

export default Api;
