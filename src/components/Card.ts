import { ICardActions } from '../types';
import { categories } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component, IComponentState } from './base/Component';
import { IEvents } from './base/events';

/**
 * Состояние карточки
 */
export interface ICardState extends IComponentState {
	isSelected: boolean;
}

/**
 * Данные карточки
 */
export interface ICard {
	id: string;
	category: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
	selected: boolean;
	buttonText: string;
}

/**
 * Базовая карточка
 */
export abstract class BaseCard extends Component<ICard, ICardState> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, events?: IEvents) {
		super(container, events);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._price = ensureElement<HTMLElement>(`.card__price`, container);
		this._button = container.querySelector(`.card__button`);

		this.state = {
			...this.state,
			isSelected: false
		};
	}

	/**
	 * Установить заголовок карточки
	 */
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	/**
	 * Установить цену
	 */
	set price(value: number | null) {
		if (value === null) {
			if (this._button) {
				this.setDisabled(this._button, true);
				this.setText(this._button, 'Нельзя купить');
			}
			this.setText(this._price, 'Бесценно');
		} else {
			if (this._button) {
				this.setDisabled(this._button, false);
			}
			this.setText(this._price, `${value} синапсов`);
		}
	}

	/**
	 * Установить текст кнопки
	 */
	set buttonText(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	/**
	 * Отрисовать карточку
	 */
	render(data?: Partial<ICard>): HTMLElement {
		if (data) {
			this.title = data.title ?? this.title;
			this.price = data.price ?? null;
			if (data.buttonText && this._button) {
				this.buttonText = data.buttonText;
			}
			
			if (data.selected !== undefined) {
				this.setState({
					...this.state,
					isSelected: data.selected
				});
			}
		}
		return this.container;
	}
}

/**
 * Карточка в каталоге
 */
export class Card extends BaseCard {
	protected _category: HTMLElement;
	protected _image: HTMLElement;
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._category = ensureElement<HTMLElement>(`.card__category`, container);
		this._image = ensureElement<HTMLElement>(`.card__image`, container);
		this._description = container.querySelector(`.card__text`);

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	/**
	 * Установить идентификатор карточки
	 */
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	/**
	 * Установить изображение карточки
	 */
	set image(value: string) {
		const imgElement = this._image.querySelector('img');
		if (imgElement instanceof HTMLImageElement) {
			this.setImage(imgElement, value, this.title);
		}
	}

	/**
	 * Установить описание карточки
	 */
	set description(value: string) {
		this.setText(this._description, value);
	}

	get description(): string {
		return this._description?.textContent || '';
	}

	/**
	 * Установить категорию карточки
	 */
	set category(value: string) {
		this.setText(this._category, value);
		// Сначала убираем все возможные классы категорий
		categories.forEach((categoryClass) => {
			this.toggleClass(this._category, categoryClass, false);
		});
		// Затем добавляем нужный класс
		const categoryClass = categories.get(value);
		if (categoryClass) {
			this.toggleClass(this._category, categoryClass, true);
		}
	}

	get category(): string {
		return this._category.textContent || '';
	}

	/**
	 * Отрисовать карточку
	 */
	render(data?: Partial<ICard>): HTMLElement {
		if (data) {
			this.id = data.id ?? this.id;
			this.category = data.category ?? this.category;
			this.image = data.image ?? '';
			this.description = data.description ?? '';
		}
		return super.render(data);
	}
}

/**
 * Карточка в корзине
 */
export class BasketCard extends BaseCard {
	protected _index: HTMLElement;
	protected _deleteButton: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._deleteButton = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);

		if (actions?.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		}
	}

	/**
	 * Установить индекс карточки в корзине
	 */
	set index(value: number) {
		this.setText(this._index, value);
	}

	/**
	 * Отрисовать карточку
	 */
	render(data?: Partial<ICard & { index?: number }>): HTMLElement {
		if (data?.index !== undefined) {
			this.index = data.index;
		}
		return super.render(data);
	}
}
