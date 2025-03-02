// Возвращаемся к CSS
import './css/neon-styles.css';
// import './scss/neon-theme.scss'; // закомментируем импорт SCSS
import './types/index';
import { ApiClient } from './api/ApiClient';
import { CartManager } from './cart/CartManager';
import { ProductListUI } from './ui/ProductListUI';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  const apiClient = new ApiClient();
  const cartManager = new CartManager();
  const productListElement = document.getElementById('product-list');
  
  if (productListElement) {
    new ProductListUI(apiClient, cartManager, productListElement);
  }
});
