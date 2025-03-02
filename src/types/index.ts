export interface IProduct {
    id: string;
    details?: string;
    imageUrl: string;
    name: string;
    category: string;
    cost: number;
    }

export interface ICartItem {
        productId: string;
        name: string;
        cost: number; 
        quantity: number; 
        }

export interface IShoppingCart {
    items: ICartItem[];
    }
    
export interface IUserContactForm {
    emailAddress: string;
    phoneNumber: string;
    }

export interface IPaymentDetails {
        method: TPaymentMethod;
        deliveryAddress: string;
        }

export interface IOrder {
            items: ICartItem[];
            contactInfo: IUserContactForm;
            paymentDetails: IPaymentDetails;
            totalAmount: number;
            
            }

export type TPaymentMethod = 'creditCard' | 'cash' | undefined;

// Добавляем интерфейс для данных заказа
export interface IOrderData {
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