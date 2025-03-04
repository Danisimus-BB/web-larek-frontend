import { IApi } from '../../types';

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type ApiResponse<T> = {
	success: boolean;
	data: T;
	error?: string;
};

export class Api implements IApi {
	readonly baseUrl: string;
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		};
	}

	protected async handleResponse<T>(response: Response): Promise<T> {
		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.message || response.statusText);
		}
		const data = await response.json();
		return data;
	}

	async get<T>(endpoint: string): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				...this.options,
				method: 'GET',
			});
			return await this.handleResponse<T>(response);
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	}

	async post<T>(endpoint: string, data: any): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				...this.options,
				method: 'POST',
				body: JSON.stringify(data),
			});
			return await this.handleResponse<T>(response);
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	}
}
