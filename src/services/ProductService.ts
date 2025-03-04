import { Api } from '../components/base/api';
import { IProduct } from '../types';
import { getBaseURL, API_ENDPOINTS } from '../config';

export class ProductService {
    private readonly api: Api;

    constructor() {
        this.api = new Api(getBaseURL());
    }

    async getProducts(): Promise<IProduct[]> {
        try {
            const data = await this.api.get<{ items: IProduct[] }>(API_ENDPOINTS.products);
            return data.items || [];
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProduct(id: string): Promise<IProduct> {
        try {
            return await this.api.get<IProduct>(`${API_ENDPOINTS.products}/${id}`);
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    }
} 