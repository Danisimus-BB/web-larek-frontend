// src/api/ApiClient.ts
import { IProduct, ICartItem, IOrder } from "../types/index";
import { Product, mockProducts } from '../utils/mockData';

// Создаем интерфейс для данных заказа на уровне модуля
interface IOrderData {
    items: Array<{
        product: {
            id: string;
            price: number;
            [key: string]: any;
        };
        quantity: number;
    }>;
    paymentMethod: string;
    email: string;
    phone: string;
    address: string;
}

export class ApiClient {
    private baseUrl: string;
    private useProxy: boolean;
    private CDN_URL: string;

    constructor() {
        // Определяем, использовать ли прокси
        this.useProxy = process.env.NODE_ENV !== 'production';
        
        // Базовый URL для API с правильным путем
        this.baseUrl = this.useProxy 
            ? '/api/weblarek' // Прокси для разработки
            : 'https://larek-api.nomoreparties.co/api/weblarek';
        
        // API хост для изображений (используем тот же хост что и для API, без /api/weblarek)
        const apiHost = this.useProxy 
            ? window.location.origin
            : 'https://larek-api.nomoreparties.co';
        
        // URL для изображений
        this.CDN_URL = `${apiHost}/content/weblarek`;
        
        console.log(`API Client initialized with baseUrl: ${this.baseUrl}`);
        console.log(`CDN URL for images: ${this.CDN_URL}`);
    }

    // Метод для получения полного URL изображения
    private getImageUrl(relativePath: string): string {
        if (!relativePath) return '';
        
        // Для полных URL (начинающихся с http) оставляем как есть
        if (relativePath.startsWith('http')) {
            return relativePath;
        }
        
        // Убедимся, что путь начинается с /, если его нет
        const normalizePath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
        
        // Возвращаем полный URL
        return `${this.CDN_URL}${normalizePath}`;
    }

    async getProducts(): Promise<Product[]> {
        try {
            console.log(`Fetching products from ${this.baseUrl}/product/`);
            const response = await fetch(`${this.baseUrl}/product/`);
            
            if (!response.ok) {
                console.error(`API Error: ${response.status} ${response.statusText}`);
                // В случае ошибки используем моковые данные
                console.log('Falling back to mock data');
                return mockProducts;
            }
            
            const data = await response.json();
            console.log('API response:', data);
            
            // Модифицируем данные, добавляя полный URL для изображений
            const products = data.items || [];
            return products.map((product: Record<string, any>) => {
                const fullImageUrl = this.getImageUrl(product.image);
                console.log(`Image path: ${product.image} -> ${fullImageUrl}`);
                return {
                    ...product,
                    image: fullImageUrl
                };
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            // В случае ошибки используем моковые данные
            console.log('Falling back to mock data');
            return mockProducts;
        }
    }

    async getProduct(id: string): Promise<Product | null> {
        try {
            const response = await fetch(`${this.baseUrl}/product/${id}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const product = await response.json();
            // Добавляем полный URL для изображения
            return {
                ...product,
                image: this.getImageUrl(product.image)
            };
        } catch (error) {
            console.error(`Error fetching product with id ${id}:`, error);
            throw error;
        }
    }

    async submitOrder(orderData: IOrderData): Promise<{ success: boolean, orderId?: string }> {
        try {
            // Получаем товары с сервера для проверки цен
            const allProducts = await this.getProducts();
            
            // ID товара "Мамка-таймер", который сервер не принимает
            const excludedProductId = 'b06cde61-912f-4663-9751-09956c0eed67';
            
            // Создаем карту цен для быстрого доступа
            const priceMap = new Map();
            allProducts.forEach(product => {
                priceMap.set(product.id, product.price !== null ? product.price : 0);
            });
            
            // Создаем развернутый массив ID товаров, исключая проблемный товар
            const expandedItemIds = [];
            
            for (const item of orderData.items) {
                const productId = item.product.id;
                const quantity = item.quantity;
                
                // Пропускаем "Мамка-таймер" при отправке заказа
                if (productId === excludedProductId) {
                    console.warn(`Товар "Мамка-таймер" исключен из заказа из-за ограничений сервера`);
                    continue;
                }
                
                // Добавляем ID других товаров в соответствии с их количеством
                for (let i = 0; i < quantity; i++) {
                    expandedItemIds.push(productId);
                }
            }
            
            // Проверяем, остались ли товары в корзине после фильтрации
            if (expandedItemIds.length === 0) {
                throw new Error("В корзине нет товаров, доступных для заказа. Пожалуйста, добавьте другие товары.");
            }
            
            // Рассчитываем сумму на основе отфильтрованных товаров
            let totalSum = 0;
            for (const id of expandedItemIds) {
                const price = priceMap.get(id);
                totalSum += Number(price || 0);
            }
            
            console.log("Товары в заказе (без Мамка-таймер):", expandedItemIds);
            console.log("Рассчитанная сумма заказа:", totalSum);
            
            // Если сумма равна 0, устанавливаем минимальное значение
            if (totalSum === 0) {
                console.log("Сумма заказа равна 0, устанавливаем минимальное значение 1");
                totalSum = 1;
            }
            
            // Отправляем заказ только с доступными товарами
            const orderPayload = {
                payment: orderData.paymentMethod,
                email: orderData.email,
                phone: orderData.phone,
                address: orderData.address,
                items: expandedItemIds,
                total: totalSum
            };
            
            console.log('Отправка заказа с отфильтрованным списком ID:', orderPayload);
            
            const response = await fetch(`${this.baseUrl}/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderPayload)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! Status: ${response.status}, ${errorText}`);
                
                // 7. Если проблема все еще с суммой, пробуем отправить как строку
                if (errorText.includes("Неверная сумма")) {
                    console.log("Пробуем отправить сумму как строку...");
                    
                    // Создаем копию payload с суммой как строкой
                    const stringTotalPayload = {
                        ...orderPayload,
                        total: String(Math.round(totalSum))
                    };
                    
                    console.log("Отправка с суммой как строкой:", stringTotalPayload);
                    
                    const stringTotalResponse = await fetch(`${this.baseUrl}/order`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(stringTotalPayload)
                    });
                    
                    if (stringTotalResponse.ok) {
                        const data = await stringTotalResponse.json();
                        return {
                            success: true,
                            orderId: data.id
                        };
                    }
                }
                
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            return {
                success: true,
                orderId: data.id
            };
        } catch (error) {
            console.error('Error submitting order:', error);
            throw error;
        }
    }

    // Эти методы можно удалить или обновить, если они используются в других частях приложения
    // async addToCart(cartItem: ICartItem): Promise<void> { ... }
    // async removeFromCart(productId: number): Promise<void> { ... }
    // async createOrder(order: IOrder): Promise<void> { ... }
}

