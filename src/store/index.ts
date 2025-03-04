import { IAppState, IProduct } from '../types';
import { ProductService } from '../services/ProductService';

export class Store {
    private state: IAppState;
    private listeners: Array<() => void>;
    private productService: ProductService;

    constructor() {
        this.state = {
            products: [],
            cart: {},
            loading: false,
            order: null
        };
        this.listeners = [];
        this.productService = new ProductService();
    }

    getState(): IAppState {
        return this.state;
    }

    private setState(newState: Partial<IAppState>) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(listener => listener());
    }

    async loadProducts() {
        try {
            this.setState({ loading: true });
            const products = await this.productService.getProducts();
            this.setState({ products, loading: false });
        } catch (error) {
            console.error('Error loading products:', error);
            this.setState({ loading: false });
        }
    }

    addToCart(productId: string) {
        const currentQuantity = this.state.cart[productId] || 0;
        this.setState({
            cart: {
                ...this.state.cart,
                [productId]: currentQuantity + 1
            }
        });
    }

    removeFromCart(productId: string) {
        const { [productId]: removed, ...remaining } = this.state.cart;
        this.setState({ cart: remaining });
    }

    clearCart() {
        this.setState({ cart: {} });
    }

    getCartItems(): Array<{ product: IProduct; quantity: number }> {
        return Object.entries(this.state.cart).map(([id, quantity]) => ({
            product: this.state.products.find(p => p.id === id)!,
            quantity
        }));
    }

    getCartTotal(): number {
        return this.getCartItems().reduce((total, { product, quantity }) => {
            return total + product.price * quantity;
        }, 0);
    }
} 