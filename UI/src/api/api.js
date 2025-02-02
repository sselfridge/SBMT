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
 * @param {any} onError - Value to set on GET error
 * @param {bool} setErrorUndefined - set true if error state needs to be 'undefined'
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

export const ApiPost = (url, body, setValue = () => {}, onError = () => {}) => {
  Api.post(url, body)
    .then((response) => {
      setValue(deepFreeze(response.data));
    })
    .catch((err) => {
      onError(err);
      console.error(err);
    });
};
export const ApiPut = (url, body, setValue = () => {}, onError = () => {}) => {
  Api.put(url, body)
    .then((response) => {
      setValue(deepFreeze(response.data));
    })
    .catch((err) => {
      onError(err);
      console.error(err);
    });
};

export const ApiPostCb = (
  url,
  body,
  onSuccess = () => {},
  onError = () => {}
) => {
  Api.post(url, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((err) => {
      onError(err);
    });
};

export const ApiPatch = (
  url,
  body,
  setValue = () => {},
  onError = () => {}
) => {
  Api.patch(url, body)
    .then((response) => {
      setValue(deepFreeze(response.data));
    })
    .catch((err) => {
      onError(err);
      console.error(err);
    });
};

export default Api;
