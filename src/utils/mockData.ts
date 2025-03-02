// src/mockData.ts
import { IProduct } from "../types/index";

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number;
}

export interface OrderFormData {
  paymentMethod: 'card' | 'cash';
  address: string;
  email: string;
  phone: string;
}

export const mockProducts: Product[] = [
    {
      id: '854cef69-976d-4c2a-a18c-2aa45046c390',
      title: '+1 час в сутках',
      category: 'софт-скил',
      description: 'Если планируете решать задачи в тренажёре, берите два.',
      image: 'https://via.placeholder.com/300x200?text=5_Dots',
      price: 750
    },
    {
      id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
      title: 'HEX-леденец',
      category: 'другое',
      description: 'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
      image: 'https://via.placeholder.com/300x200?text=Shell',
      price: 1450
    },
    {
      id: 'b06cde61-912f-4663-9751-09956c0eed67',
      title: 'Мамка-таймер',
      category: 'софт-скил',
      description: 'Будет стоять над душой и не давать прокрастинировать.',
      image: 'https://via.placeholder.com/300x200?text=Asterisk_2',
      price: 0
    },
    {
      id: '412bcf81-7e75-4e70-bdb9-d3c73c9803b7',
      title: 'Фреймворк куки судьбы',
      category: 'дополнительное',
      description: 'Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.',
      image: 'https://via.placeholder.com/300x200?text=Soft_Flower',
      price: 2500
    },
    {
      id: '1c521d84-c48d-48fa-8cfb-9d911fa515fd',
      title: 'Кнопка «Замьютить кота»',
      category: 'кнопка',
      description: 'Если орёт кот, нажмите кнопку.',
      image: 'https://via.placeholder.com/300x200?text=mute-cat',
      price: 2000
    },
    {
      id: 'f3867296-45c7-4603-bd34-29cea3a061d5',
      title: 'БЭМ-пилюлька',
      category: 'другое',
      description: 'Чтобы научиться правильно называть модификаторы, без этого не обойтись.',
      image: 'https://via.placeholder.com/300x200?text=Pill',
      price: 1500
    },
    {
      id: '54df7dcb-1213-4b3c-ab61-92ed5f845535',
      title: 'Портативный телепорт',
      category: 'другое',
      description: 'Измените локацию для поиска работы.',
      image: 'https://via.placeholder.com/300x200?text=Polygon',
      price: 100000
    },
    {
      id: '6a834fb8-350a-440c-ab55-d0e9b959b6e3',
      title: 'Микровселенная в кармане',
      category: 'другое',
      description: 'Даст время для изучения React, ООП и бэкенда.',
      image: 'https://via.placeholder.com/300x200?text=Butterfly',
      price: 750
    },
    {
      id: '48e86fc0-ca99-4e13-b164-b98d65928b53',
      title: 'UI/UX-карандаш',
      category: 'хард-скил',
      description: 'Очень полезный навык для фронтендера. Без шуток.',
      image: 'https://via.placeholder.com/300x200?text=Leaf',
      price: 10000
    },
    {
      id: '90973ae5-285c-4b6f-a6d0-65d1d760b102',
      title: 'Бэкенд-антистресс',
      category: 'другое',
      description: 'Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.',
      image: 'https://via.placeholder.com/300x200?text=Mithosis',
      price: 1000
    }
  ];
  
