    # Проектная работа "Веб-ларек"
    Стек технологий

        HTML

        SCSS

        TypeScript (TS)

        Webpack

    Структура проекта
    - src/ — исходные файлы проекта
    - src/components/ — папка с JS компонентами
    - src/components/base/ — папка с базовым кодом

    Важные файлы:

    - src/pages/index.html — HTML-файл главной страницы
    - src/types/index.ts — файл с типами
    - src/index.ts — точка входа приложения
    - src/scss/styles.scss — корневой файл стилей
    - src/utils/constants.ts — файл с константами
    - src/utils/utils.ts — файл с утилитами


    ## Установка и запуск

    Для установки зависимостей и запуска проекта выполните следующие команды:

    bash
    npm install
    npm run dev

    или

    bash
    yarn install
    yarn start

    ## Сборка

    Для сборки проекта используйте команды:

    bash
    npm run build

    или

    bash
    yarn build

    ## Описание данных
    Все перечисленные ниже интерфейсы и типы объявлены в файле src/types/index.ts.
    
    Интерфейс товара

    typescript
    interface IProduct {
    id: string;
    details?: string;
    imageUrl: string;
    name: string;
    category: string;
    cost: number;
    }

    Интерфейс для коллекции товаров

    typescript
    interface IProductsCollection {
    items: IProduct[];
    }

    Интерфейс для корзины

    typescript
    interface ICartItem {
    productId: string;
    name: string;
    cost: number; 
    quantity: number; 
    }

    Интерфейс для модели корзины

    typescript
    interface IShoppingCart {
    items: ICartItem[];
    }

    Интерфейс для формы контактных данных пользователя

    typescript
    interface IUserContactForm {
    emailAddress: string;
    phoneNumber: string;
    }

    Интерфейс для формы выбора метода оплаты и ввода адреса

    typescript
    interface IPaymentDetails {
    method: TPaymentMethod;
    deliveryAddress: string;
    }
    
    Интерфейс заказа для отправки на сервер

    typescript
    interface IOrder {
    items: ICartItem[];
    contactInfo: IUserContactForm;
    paymentDetails: IPaymentDetails;
    totalAmount: number;
}

    Тип, описывающий возможные методы оплаты

    typescript
    export type TPaymentMethod = 'creditCard' | 'cash' | undefined;

    ## Архитектура приложения

    Код приложения организован по принципу MVP (Model-View-Presenter):

    - Слой представления - отвечает за отображение информации на странице.

    - Слой данных - управляет хранением и изменением данных.

    - Презентер - связывает представление и данные.

    ### Базовый код
    #### Класс ApiService

    Класс для взаимодействия с API, поддерживающий запросы GET и POST (включая PUT и DELETE).

    Свойства:

    - **`baseApiUrl`**: Базовый URL для запросов.

    - **`requestOptions`**: Опции запроса, включая заголовки.

    Методы:

    - **`constructor(baseApiUrl: string, requestOptions: RequestInit = {})`**: Инициализация с базовым URL.

    - **`processResponse(response: Response)`**: Обработка ответа от сервера.

    - **`fetchData(uri: string)`**: Выполнение GET-запроса.

    - **`sendData(uri: string, payload: object, method: ApiRequestMethods = 'POST')`**: Выполнение POST-запроса.

    Типы:

    - **`ApiResponse<Type>**`: Ответ с количеством элементов и данными.

    - **`ApiRequestMethods**`: Типы HTTP-методов: 'POST', 'PUT', 'DELETE'.

    Класс EventBus

    Реализация системы событий, позволяющая подписываться на события и управлять обработчиками.

    Свойства:

    - **`_eventMap`**: Хранит события и подписчиков в виде карты.

    Методы:

    - subscribe<T extends object>(eventName: EventIdentifier, callback: (eventData: T) => void): Подписка на событие.

    - unsubscribe(eventName: EventIdentifier, callback: SubscriberFunction): Удаление обработчика события.

    - publish<T extends object>(eventName: string, data?: T): Инициация события.

    - subscribeAll(callback: (eventData: EventPayload) => void): Подписка на все события.

    - unsubscribeAll(): Удаление всех обработчиков событий.

    ## Типы событий:
    Типы событий (EventIdentifier, SubscriberFunction, EventPayload) объявлены в src/types/index.ts.

    - **`EventIdentifier**`: Имя события (строка или регулярное выражение).

    - **`SubscriberFunction**`: Функция-подписчик на событие.

    - **`EventPayload**`: Событие с данными.

    ### Слой модели

    #### Класс ProductData

    Класс отвечает за управление данными о товарах.

    Поля класса:

    - _productsList: IProduct[]; - массив товаров.

    Методы:

    - updateProducts(products: IProduct[]): void;
    - getProductsList(): IProduct[]; - возвращает список всех продуктов.

    - findProductById(id: string): IProduct | undefined; - возвращает товар по его id.

    ### Класс CartManager

    Класс отвечает за логику работы с корзиной.

    Поля класса:
    - contactInfo: IUserContactForm | null; - контактные данные пользователя (email и телефон). 
    - _paymentDetails: IPaymentDetails | null; - нформация о методе оплаты и адресе доставки.
    - _cartItems: ICartItem[]; - массив товаров в корзине.

    Методы:

    - addItem(itemId: string): void; - добавляет товар в корзину по идентификатору.

    - removeItem(itemId: string): void; - удаляет товар из корзины по идентификатору.

    - getItems(): IProduct[]; - возвращает массив товаров в корзине.

    - emptyCart(): void; - очищает корзину.
   
    - setContactInfo(contactInfo: IUserContactForm): void — сохраняет контактные данные пользователя.
    
    - setPaymentDetails(paymentDetails: IPaymentDetails): void; - сохраняет метод оплаты и адрес доставки.
    
    - validateContactInfo(): boolean; - проверяет корректность введенных контактных данных (email и телефон).
    
    - validatePaymentDetails(): boolean; - проверяет заполненность метода оплаты и адреса доставки.
    
    - getOrderData(): IOrder | null; - возвращает данные заказа, если все данные валидны, иначе null.

    ### Слой представления

    Все классы представления отвечают за отображение данных внутри контейнера (DOM элемент).

    #### Класс ModalWindow
   
    Назначение EventBus для ModalWindow:
    
    Конструктор: 
    
    typescript
    constructor(selector: string, eventBusInstance: EventBus) 

    Принимает селектор модального окна и экземпляр класса EventBus для инициирования событий.

    Поля класса:
    
    - modalElement: HTMLElement - элемент модального окна.

    - eventBusInstance: EventBus - система событий для взаимодействия с другими компонентами.

    Методы: 

    - open(): void - открывает модальное окно, добавляя CSS-класс 'active' и публикуя событие 'modal.open'.

    - close(): void - закрывает модальное окно, удаляя CSS-класс 'active' и публикуя событие 'modal.close'.

    - setContent(content: HTMLElement): void - заменяет содержимое тела модального окна переданным HTML-элементом.




    #### Класс MainPage

    Отвечает за управление состоянием главной страницы, отображение содержимого корзины и подсчет товаров. Предоставляет методы для блокировки страницы и обновления счетчика товаров в корзине.

    Поля класса:

    - pageWrapperElement: HTMLElement - обертка страницы.

    - cartButtonElement: HTMLButtonElement - кнопка для открытия корзины.

    - itemCounterElement: HTMLSpanElement - счетчик товаров в корзине.

    Методы:

    - set isPageLocked(value: boolean) - блокирует или разблокирует страницу.

    - set itemCounter(value: number) - обновляет счетчик товаров в корзине.

    #### Класс ContactFormHandler

    Реализует работу с формой ввода контактных данных пользователя.

    Поля класса:

    - emailFieldElement: HTMLInputElement - поле для ввода email.

    - phoneFieldElement: HTMLInputElement - поле для ввода номера телефона.

    Методы:

    - set phone(value: string) - устанавливает номер телефона.

    - set email(value: string) - устанавливает email адрес.

    - get phone(): string - возвращает номер телефона.

    - get email(): string - возвращает email адрес.

    #### Класс PaymentFormHandler

    Реализует работу с формой выбора способа оплаты.

    Поля класса:

    - addressFieldElement: HTMLInputElement - поле для ввода адреса доставки.

    - creditCardButtonElement: HTMLButtonElement - кнопка для оплаты картой.

    - cashButtonElement: HTMLButtonElement - кнопка для оплаты наличными.

    Методы:

    - set address(value: string) - устанавливает адрес доставки.

    - set paymentMethod(value: TPaymentMethod) - устанавливает способ оплаты.

    - get address(): string - возвращает адрес доставки.

    - get paymentMethod(): TPaymentMethod - возвращает способ оплаты.

    ### Класс OrderSuccessHandler

    Реализует отображение информации о успешном завершении заказа.

    Поля класса:

    - totalAmountDisplayElement: HTMLParagraphElement - элемент для отображения общей суммы заказа.

    Методы:

    - set totalAmount(value: string) - устанавливает общую сумму заказа.

    ### Слой презентера

    #### Класс ApplicationApiConnector

    Принимает экземпляр класса ApiService в конструкторе и предоставляет методы для взаимодействия с бэкендом сервиса.


    # Взаимодействие компонентов

    Код, описывающий взаимодействие между представлением и данными, находится в файле index.ts, который выполняет роль презентера. Взаимодействие осуществляется через события, генерируемые системой событий и обработчики этих событий, описанные в index.ts.

    В index.ts создаются экземпляры всех необходимых классов, после чего настраивается обработка событий:
    События взаимодействия пользователя:

    - modalWindow.open — открытие модального окна для редактирования или подтверждения действий (например, добавление товара в корзину).

    - modalWindow.close — закрытие модального окна.

    - product.select — выбор товара для просмотра или добавления в корзину (например, класс MainPage).

    - product.addToCart — добавление товара в корзину (инициируется через модальное окно или интерфейс корзины).

    - product.removeFromCart — удаление товара из корзины (инициируется через модальное окно или интерфейс корзины).

    - cart.submitOrder — переход к оформлению заказа с товарами в корзине (классы MainPage или CartManager).

    - payment.validateForm — событие для проверки формы оплаты (класс PaymentFormHandler).

    - contact.validateForm — событие для проверки формы контактных данных покупателя (класс ContactFormHandler).

    - payment.submitForm — подтверждение и сохранение метода оплаты и адреса доставки (класс PaymentFormHandler).

    - contact.submitForm — подтверждение и сохранение контактных данных покупателя (класс ContactFormHandler).

    - order.completeSuccess — успешное завершение заказа и переход к списку товаров (класс OrderSuccessHandler).
