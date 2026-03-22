import axios, { AxiosResponse } from "axios";
import { deepFreeze } from "utils/helperFuncs";

const Api = axios.create({
  baseURL: "/",
  // timeout: 1500
});

export let rateLimit: number = -1;

Api.interceptors.response.use(
  function (response) {
    rateLimit = response.headers["x-usage-15"];

    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const ApiGet = (
  url: string,
  setValue: (data: any) => void,
  onError?: any,
  setErrorUndefined?: boolean,
): void => {
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
  url: string,
  setValue: (data: any) => void,
  onSuccess?: any,
  setOnError: boolean = false,
  onError?: any,
): void => {
  Api.delete(url)
    .then((_response) => {
      setValue(onSuccess);
    })
    .catch((err) => {
      if (setOnError) setValue(onError);
      console.error(err);
    });
};

export const ApiPost = (
  url: string,
  body: unknown,
  setValue: (data: any) => void = () => {},
  onError: (err: unknown) => void = () => {},
): void => {
  Api.post(url, body)
    .then((response) => {
      setValue(deepFreeze(response.data));
    })
    .catch((err) => {
      onError(err);
      console.error(err);
    });
};

export const ApiPut = (
  url: string,
  body: unknown,
  setValue: (data: any) => void = () => {},
  onError: (err: unknown) => void = () => {},
): void => {
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
  url: string,
  body: unknown,
  onSuccess: (response: AxiosResponse) => void = () => {},
  onError: (err: unknown) => void = () => {},
): void => {
  Api.post(url, body)
    .then((response) => {
      onSuccess(response);
    })
    .catch((err) => {
      onError(err);
    });
};

export const ApiPatch = (
  url: string,
  body: unknown,
  setValue: (data: any) => void = () => {},
  onError: (err: unknown) => void = () => {},
): void => {
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
