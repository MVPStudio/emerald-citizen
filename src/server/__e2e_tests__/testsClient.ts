import { ApiClient } from 'shared/ApiClient';
import axios, { AxiosRequestConfig } from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { logger } from 'server/logger';

export const createTestClient = () => {
	const jar = new CookieJar();
	const axiosClient = axios.create({
		baseURL: 'http://localhost:8080',
		withCredentials: true,
		jar
	} as AxiosRequestConfig);

	axiosClient.interceptors.request.use((request) => {
		const { method, url, data, headers } = request;
		logger.debug('Starting Request', method, url, data)
		return request;
	});

	axiosClient.interceptors.response.use((response) => {
		const { status, data } = response;
		logger.debug('Response:', status, data)
		return response;
	});

	return new ApiClient(axiosCookieJarSupport(axiosClient));
};

export const loginAsAdmin = (client: ApiClient) => client.auth.login({ username: 'admin', password: 'admin' });
export const loginAsReporter = (client: ApiClient) => client.auth.login({ username: 'reporter', password: 'reporter' });
export const loginAsAnalyst = (client: ApiClient) => client.auth.login({ username: 'analyst', password: 'analyst' });