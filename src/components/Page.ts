import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._counter, value);
		this._counter.classList.add('header__basket-counter_visible');
	}

	set catalog(items: HTMLElement[]) {
		const list = document.createElement('ul');
		list.classList.add('gallery__list');
		items.forEach(item => {
			const listItem = document.createElement('li');
			listItem.append(item);
			list.append(listItem);
		});
		this.clear(this._catalog);
		this._catalog.append(list);
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}

	addGalleryListener(eventName: string, callback: (evt: Event) => void): void {
		this._catalog.addEventListener(eventName, callback);
	}

	setPageScroll(isEnabled: boolean): void {
		this.toggleClass(document.body, 'body_lock-scroll', !isEnabled);
	}
}
