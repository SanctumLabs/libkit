import {AxiosInstance} from 'axios';

export type BaseClientConfigure = (
  instance: AxiosInstance,
  originalConfigure?: BaseClientConfigure,
) => void;

export type BaseClientOptions = {
  baseURL: string;
  configure?: BaseClientConfigure;
};
