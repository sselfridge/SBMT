export declare const ApiGet: (
  url: string,
  setValue: (data: any) => void,
  onError?: any,
  setErrorUndefined?: boolean,
) => void;

export declare const ApiDelete: (
  url: string,
  setValue: (data: any) => void,
  onSuccess?: any,
  setOnError?: boolean,
  onError?: any,
) => void;

export declare const ApiPost: (
  url: string,
  body: unknown,
  setValue?: (data: any) => void,
  onError?: (err: unknown) => void,
) => void;

export declare const ApiPut: (
  url: string,
  body: unknown,
  setValue?: (data: any) => void,
  onError?: (err: unknown) => void,
) => void;

export declare const ApiPostCb: (
  url: string,
  body: unknown,
  onSuccess?: (response: unknown) => void,
  onError?: (err: unknown) => void,
) => void;

export declare const ApiPatch: (
  url: string,
  body: unknown,
  setValue?: (data: any) => void,
  onError?: (err: unknown) => void,
) => void;

export declare let rateLimit: number;
