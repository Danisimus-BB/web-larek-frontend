import { IEvents } from './base/events';
import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface IBasketView {
	items: HTMLElement[];
	price: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._price = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
			this.toggleClass(this._button, 'button_disabled', false);
		} else {
			this.setDisabled(this._button, true);
			this.toggleClass(this._button, 'button_disabled', true);
		}

		this.clear(this._list);
		items.forEach((item) => {
			this._list.appendChild(item);
		});
	}

	set price(price: number) {
		this.setText(this._price, `${price} синапсов`);
	}

	/**
	 * Получить цену корзины
	 */
	get price(): number {
		return parseInt(this._price.textContent || '0');
	}
}
