// src/ui/ProductListUI.ts
import { ApiClient } from '../api/ApiClient';
import { CartManager } from '../cart/CartManager';
import { Product } from '../utils/mockData';

export class ProductListUI {
    private products: Product[] = [];
    private modalContainer: HTMLElement | null = null;
    
    constructor(
        private apiClient: ApiClient,
        private cartManager: CartManager,
        private container: HTMLElement
    ) {
        this.init();
    }

    private async init(): Promise<void> {
        // Создаем модальный контейнер
        this.createModalContainer();
        
        // Загружаем продукты
        try {
            console.log('Начинаем загрузку продуктов...');
            this.products = await this.apiClient.getProducts();
            console.log('Продукты загружены:', this.products);
            this.renderProducts();
            this.setupCartCounter();
        } catch (error) {
            console.error('Failed to load products', error);
            this.container.innerHTML = '<p class="error">Не удалось загрузить товары. Пожалуйста, попробуйте позже.</p>';
        }
    }

    private createModalContainer(): void {
        this.modalContainer = document.createElement('div');
        this.modalContainer.className = 'modal';
        this.modalContainer.addEventListener('click', (e) => {
            if (e.target === this.modalContainer) {
                this.closeModal();
            }
        });
        document.body.appendChild(this.modalContainer);
    }

    private renderProducts(): void {
        const gridElement = document.createElement('div');
        gridElement.className = 'grid grid--3-cols';

        this.products.forEach(product => {
            const card = this.createProductCard(product);
            gridElement.appendChild(card);
        });

        this.container.innerHTML = '';
        this.container.appendChild(gridElement);
    }

    private createProductCard(product: Product): HTMLElement {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Определяем класс категории
        let categoryClass = '';
        if (product.category === 'софт-скил') {
            categoryClass = 'category-soft-skill';
        } else if (product.category === 'хард-скил') {
            categoryClass = 'category-hard-skill';
        } else if (product.category === 'дополнительное') {
            categoryClass = 'category-additional';
        } else if (product.category === 'другое') {
            categoryClass = 'category-other';
        }
        
        card.innerHTML = `
            <img class="product-card__image" src="${product.image}" alt="${product.title}">
            <span class="product-card__category ${categoryClass}">${product.category}</span>
            <h3 class="product-card__title">${product.title}</h3>
            <div class="product-card__price">${this.formatPrice(product.price)}</div>
        `;

        // Удаляем кнопку и добавляем обработчик на всю карточку
        card.addEventListener('click', () => {
            this.showProductModal(product);
        });

        return card;
    }

    private showProductModal(product: Product): void {
        if (!this.modalContainer) return;

        const isInCart = this.cartManager.getItems().some(item => item.product.id === product.id);
        
        // Определяем класс категории
        let categoryClass = '';
        if (product.category === 'софт-скил') {
            categoryClass = 'category-soft-skill';
        } else if (product.category === 'хард-скил') {
            categoryClass = 'category-hard-skill';
        } else if (product.category === 'дополнительное') {
            categoryClass = 'category-additional';
        } else if (product.category === 'другое') {
            categoryClass = 'category-other';
        }
        
        this.modalContainer.innerHTML = `
            <div class="modal__content">
                <button class="modal__close">&times;</button>
                <div class="product-detail">
                    <div class="product-detail__image-container">
                        <img class="product-detail__image" src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-detail__info">
                        <span class="product-detail__category ${categoryClass}">${product.category}</span>
                        <h2 class="product-detail__title">${product.title}</h2>
                        <p class="product-detail__description">${product.description}</p>
                        <div class="product-detail__price">${this.formatPrice(product.price)}</div>
                        <button class="button ${isInCart ? 'button--secondary' : 'button--primary'}" id="product-action-btn">
                            ${isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        const closeButton = this.modalContainer.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }

        const actionButton = this.modalContainer.querySelector('#product-action-btn');
        if (actionButton) {
            actionButton.addEventListener('click', () => {
                if (isInCart) {
                    this.cartManager.removeItem(product.id);
                    actionButton.textContent = 'Добавить в корзину';
                    actionButton.className = 'button button--primary';
                } else {
                    this.cartManager.addItem(product);
                    actionButton.textContent = 'Удалить из корзины';
                    actionButton.className = 'button button--secondary';
                }
            });
        }

        this.modalContainer.classList.add('modal--active');
    }

    private closeModal(): void {
        this.modalContainer?.classList.remove('modal--active');
    }

    private setupCartCounter(): void {
        const cartCounter = document.getElementById('cart-counter');
        if (cartCounter) {
            const updateCounter = () => {
                const count = this.cartManager.getItemCount();
                cartCounter.textContent = count > 0 ? count.toString() : '';
                cartCounter.style.display = count > 0 ? 'block' : 'none';
            };

            // Initialize counter
            updateCounter();

            // Listen for cart changes
            this.cartManager.addChangeListener(updateCounter);
        }

        // Setup cart button
        const cartButton = document.getElementById('cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', () => {
                this.showCartModal();
            });
        }
    }

    private showCartModal(): void {
        if (!this.modalContainer) return;

        const cartItems = this.cartManager.getItems();
        const totalPrice = this.cartManager.getTotalPrice();

        if (cartItems.length === 0) {
            this.modalContainer.innerHTML = `
                <div class="modal__content">
                    <button class="modal__close">&times;</button>
                    <div class="cart">
                        <h2 class="cart__title">Корзина</h2>
                        <div class="cart__empty">Ваша корзина пуста</div>
                    </div>
                </div>
            `;
        } else {
            this.modalContainer.innerHTML = `
                <div class="modal__content">
                    <button class="modal__close">&times;</button>
                    <div class="cart">
                        <h2 class="cart__title">Корзина</h2>
                        <div class="cart__items">
                            ${cartItems.map(item => `
                                <div class="cart__item" data-id="${item.product.id}">
                                    <div class="cart__item-info">
                                        <img class="cart__item-image" src="${item.product.image}" alt="${item.product.title}">
                                        <div class="cart__item-details">
                                            <div class="cart__item-title">${item.product.title}</div>
                                            <div class="cart__item-price">${this.formatPrice(item.product.price)}</div>
                                        </div>
                                    </div>
                                    <div class="cart__item-actions">
                                        <div class="cart__item-quantity">
                                            <button class="cart__quantity-btn cart__quantity-minus">-</button>
                                            <span class="cart__quantity-value">${item.quantity}</span>
                                            <button class="cart__quantity-btn cart__quantity-plus">+</button>
                                        </div>
                                        <button class="cart__item-remove">&times;</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="cart__summary">
                            <div class="cart__total">
                                <span>Итого:</span>
                                <span>${this.formatPrice(totalPrice)}</span>
                            </div>
                            <button class="button button--primary cart__checkout">Оформить заказ</button>
                        </div>
                    </div>
                </div>
            `;
        }

        const closeButton = this.modalContainer.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }

        // Обработчики для кнопок удаления
        const removeButtons = this.modalContainer.querySelectorAll('.cart__item-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const item = (e.target as HTMLElement).closest('.cart__item');
                if (item) {
                    const productId = item.getAttribute('data-id');
                    if (productId) {
                        this.cartManager.removeItem(productId);
                        this.showCartModal(); // Перерисовываем корзину
                    }
                }
            });
        });

        // Обработчики для кнопок изменения количества
        const quantityMinusButtons = this.modalContainer.querySelectorAll('.cart__quantity-minus');
        const quantityPlusButtons = this.modalContainer.querySelectorAll('.cart__quantity-plus');

        quantityMinusButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const item = (e.target as HTMLElement).closest('.cart__item');
                if (item) {
                    const productId = item.getAttribute('data-id');
                    if (productId) {
                        const cartItem = this.cartManager.getItems().find(item => item.product.id === productId);
                        if (cartItem && cartItem.quantity > 1) {
                            this.cartManager.updateItemQuantity(productId, cartItem.quantity - 1);
                            this.showCartModal(); // Перерисовываем корзину
                        }
                    }
                }
            });
        });

        quantityPlusButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const item = (e.target as HTMLElement).closest('.cart__item');
                if (item) {
                    const productId = item.getAttribute('data-id');
                    if (productId) {
                        const cartItem = this.cartManager.getItems().find(item => item.product.id === productId);
                        if (cartItem) {
                            this.cartManager.updateItemQuantity(productId, cartItem.quantity + 1);
                            this.showCartModal(); // Перерисовываем корзину
                        }
                    }
                }
            });
        });

        // Обработчик для кнопки оформления заказа
        const checkoutButton = this.modalContainer.querySelector('.cart__checkout');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                this.showOrderForm();
            });
        }

        this.modalContainer.classList.add('modal--active');
    }

    private showOrderForm(): void {
        if (!this.modalContainer) return;

        this.modalContainer.innerHTML = `
            <div class="modal__content">
                <button class="modal__close">&times;</button>
                <div class="order-form">
                    <h2 class="order-form__title">Оформление заказа</h2>
                    
                    <div class="order-form__step" id="step-1">
                        <h3>Шаг 1: Способ оплаты и адрес доставки</h3>
                        <form id="payment-form" class="form">
                            <div class="form__group">
                                <label class="form__label">Способ оплаты</label>
                                <div class="form__radio-group">
                                    <label class="form__radio-label">
                                        <input type="radio" name="paymentMethod" value="card" checked>
                                        <span>Банковская карта</span>
                                    </label>
                                    <label class="form__radio-label">
                                        <input type="radio" name="paymentMethod" value="cash">
                                        <span>Наличные при получении</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div class="form__group">
                                <label class="form__label" for="address">Адрес доставки</label>
                                <input type="text" id="address" name="address" class="form__input" required>
                                <div class="form__error" id="address-error"></div>
                            </div>
                            
                            <button type="submit" class="button button--primary form__submit">Продолжить</button>
                        </form>
                    </div>
                    
                    <div class="order-form__step" id="step-2" style="display: none;">
                        <h3>Шаг 2: Контактная информация</h3>
                        <form id="contact-form" class="form">
                            <div class="form__group">
                                <label class="form__label" for="email">Email</label>
                                <input type="email" id="email" name="email" class="form__input" required>
                                <div class="form__error" id="email-error"></div>
                            </div>
                            
                            <div class="form__group">
                                <label class="form__label" for="phone">Телефон</label>
                                <input type="tel" id="phone" name="phone" class="form__input" required>
                                <div class="form__error" id="phone-error"></div>
                            </div>
                            
                            <div class="form__buttons">
                                <button type="button" id="back-button" class="button button--outline">Назад</button>
                                <button type="submit" class="button button--primary form__submit">Оформить заказ</button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="order-form__step" id="step-success" style="display: none;">
                        <div class="order-success">
                            <div class="order-success__icon">✓</div>
                            <h3 class="order-success__title">Заказ успешно оформлен!</h3>
                            <p class="order-success__message">Ваш заказ <span id="order-id"></span> успешно оформлен. Мы свяжемся с вами в ближайшее время.</p>
                            <button id="continue-shopping" class="button button--primary">Продолжить покупки</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const closeButton = this.modalContainer.querySelector('.modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal());
        }

        // Обработчик для формы шага 1
        const paymentForm = document.getElementById('payment-form') as HTMLFormElement;
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const addressInput = document.getElementById('address') as HTMLInputElement;
                const addressError = document.getElementById('address-error');
                
                // Валидация адреса
                if (!addressInput.value.trim()) {
                    if (addressError) addressError.textContent = 'Пожалуйста, укажите адрес доставки';
                    addressInput.classList.add('form__input--invalid');
                    return;
                }
                
                // Переход к шагу 2
                document.getElementById('step-1')?.setAttribute('style', 'display: none;');
                document.getElementById('step-2')?.removeAttribute('style');
            });
        }

        // Обработчик для кнопки "Назад"
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                document.getElementById('step-2')?.setAttribute('style', 'display: none;');
                document.getElementById('step-1')?.removeAttribute('style');
            });
        }

        // Обработчик для формы шага 2
        const contactForm = document.getElementById('contact-form') as HTMLFormElement;
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const emailInput = document.getElementById('email') as HTMLInputElement;
                const phoneInput = document.getElementById('phone') as HTMLInputElement;
                const emailError = document.getElementById('email-error');
                const phoneError = document.getElementById('phone-error');
                
                let isValid = true;
                
                // Валидация email
                if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                    if (emailError) emailError.textContent = 'Пожалуйста, укажите корректный email';
                    emailInput.classList.add('form__input--invalid');
                    isValid = false;
                } else {
                    if (emailError) emailError.textContent = '';
                    emailInput.classList.remove('form__input--invalid');
                }
                
                // Валидация телефона
                if (!phoneInput.value.trim() || !/^\+?[0-9\s\-\(\)]{10,20}$/.test(phoneInput.value)) {
                    if (phoneError) phoneError.textContent = 'Пожалуйста, укажите корректный номер телефона';
                    phoneInput.classList.add('form__input--invalid');
                    isValid = false;
                } else {
                    if (phoneError) phoneError.textContent = '';
                    phoneInput.classList.remove('form__input--invalid');
                }
                
                if (!isValid) return;
                
                // Сбор данных из обеих форм
                const paymentMethodRadio = document.querySelector('input[name="paymentMethod"]:checked') as HTMLInputElement;
                const addressInput = document.getElementById('address') as HTMLInputElement;
                
                const orderData = {
                    paymentMethod: paymentMethodRadio?.value || 'card',
                    address: addressInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                    items: this.cartManager.getItems(),
                    totalPrice: this.cartManager.getTotalPrice()
                };
                
                try {
                    const response = await this.apiClient.submitOrder(orderData);
                    if (response.success) {
                        // Показываем успешное оформление заказа
                        document.getElementById('step-2')?.setAttribute('style', 'display: none;');
                        document.getElementById('step-success')?.removeAttribute('style');
                        
                        if (response.orderId) {
                            const orderIdElement = document.getElementById('order-id');
                            if (orderIdElement) orderIdElement.textContent = `#${response.orderId}`;
                        }
                        
                        // Очищаем корзину
                        this.cartManager.clearCart();
                        
                        // Обработчик для кнопки "Продолжить покупки"
                        const continueButton = document.getElementById('continue-shopping');
                        if (continueButton) {
                            continueButton.addEventListener('click', () => {
                                this.closeModal();
                            });
                        }
                    }
                } catch (error) {
                    console.error('Failed to submit order', error);
                    alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
                }
            });
        }

        this.modalContainer.classList.add('modal--active');
    }

    private formatPrice(price: number | null | undefined): string {
        if (price == null) {
            price = 0; // Устанавливаем цену по умолчанию
        }
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
}
