import { Product } from '../utils/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class CartManager {
  private items: CartItem[] = [];
  private listeners: (() => void)[] = [];

  constructor() {
    // Восстановление корзины из localStorage при инициализации
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.items = JSON.parse(savedCart);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  addItem(product: Product, quantity = 1): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }

    this.saveToLocalStorage();
    this.notifyListeners();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  updateItemQuantity(productId: string, quantity: number): void {
    const item = this.items.find(item => item.product.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.saveToLocalStorage();
      this.notifyListeners();
    }
  }

  clearCart(): void {
    this.items = [];
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
        // Убедимся, что цена и количество - числа
        const price = Number(item.product.price) || 0;
        const quantity = Number(item.quantity) || 0;
        
        // Используем toFixed(2) для округления до 2 знаков после запятой и преобразуем обратно в число
        return total + Number((price * quantity).toFixed(2));
    }, 0);
  }

  addChangeListener(listener: () => void): void {
    this.listeners.push(listener);
  }

  removeChangeListener(listener: () => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }
} 