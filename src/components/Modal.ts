import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement, cloneTemplate } from '../utils/utils';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement | HTMLTemplateElement, protected events: IEvents) {
		// If a template is passed, clone it first
		let element: HTMLElement;
		
		if (container instanceof HTMLTemplateElement) {
			// Use cloneTemplate for HTMLTemplateElement
			element = cloneTemplate(container);
		} else {
			// Use the container directly if it's an HTMLElement
			element = container;
		}
		
		super(element);
		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
		this._content = ensureElement<HTMLElement>('.modal__content', this.container);
		
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.onClick.bind(this));
		
		// Add active class on creation
		// Добавляем класс active при создании
		this.toggleClass(this.container, 'modal_active', false);
	}

	// Вызывается при клике на область модального окна
	onClick(event: MouseEvent): void {
		// Проверяем, был ли клик на область вне модального контента
		if (event.target === this.container) {
			this.close();
		}
		// Не закрываем модальное окно при клике на контент
		if (this._content.contains(event.target as Node)) {
			event.stopPropagation();
		}
	}

	// Открыть модальное окно
	open(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit('modal:open');
	}

	// Закрыть модальное окно
	close(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.events.emit('modal:close');
	}

	// Установить содержимое модального окна
	set content(value: HTMLElement) {
		this.clear(this._content);
		this._content.appendChild(value);
	}

	// Отрисовать модальное окно
	render(data: IModalData): HTMLElement {
		super.render(data);
		this.content = data.content;
		this.open();
		return this.container;
	}
}
