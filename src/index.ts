import './scss/styles.scss';
export interface IProduct {
    id: string;
    details?: string;
    imageUrl: string;
    name: string;
    category: string;
    cost: number;
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