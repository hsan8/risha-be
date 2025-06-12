import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

@Injectable()
export class HttpService {
  private readonly logger = new Logger(HttpService.name);
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();

    this.axiosInstance.interceptors.request.use(this.handleRequest);
    this.axiosInstance.interceptors.response.use(this.handleResponse, this.handleErrorResponse);
  }

  private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    return config;
  }

  private handleResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private handleErrorResponse(error: AxiosError): Promise<AxiosError> {
    console.error(`HTTP Error: ${error.message}`, { error });
    throw new InternalServerErrorException('Unable to procced.');
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response;
  }

  async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response;
  }

  async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response;
  }

  async patch<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response;
  }
}
