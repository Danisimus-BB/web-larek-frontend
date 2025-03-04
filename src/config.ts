export const API_URL = 'https://larek-api.nomoreparties.co/api/weblarek';
export const API_ENDPOINTS = {
    products: '/product',
    orders: '/order'
};

// Автоматическое определение базового URL
export function getBaseURL(): string {
    // Если API доступен на том же домене
    if (window.location.hostname === 'larek-api.nomoreparties.co') {
        return `${window.location.origin}/api/weblarek`;
    }
    // В противном случае используем дефолтный URL
    return API_URL;
}

// Функция для формирования полного URL эндпоинта
export function getEndpointURL(endpoint: keyof typeof API_ENDPOINTS): string {
    return `${getBaseURL()}${API_ENDPOINTS[endpoint]}`;
} 