import { IEvents } from './events';

/**
 * Интерфейс для состояния компонента
 */
export interface IComponentState {
	isVisible: boolean;
	isDisabled: boolean;
	[key: string]: any;
}

/**
 * Базовый компонент
 * @template T - тип данных компонента
 * @template S - тип состояния компонента
 */
export abstract class Component<T extends object, S extends IComponentState = IComponentState> {
	protected state: S;

	protected constructor(
		protected readonly container: HTMLElement,
		protected readonly events?: IEvents
	) {
		this.state = {
			isVisible: true,
			isDisabled: false
		} as S;
	}

	/**
	 * Обновить состояние компонента
	 */
	protected setState(newState: Partial<S>): void {
		this.state = { ...this.state, ...newState };
		this.render();
	}

	/**
	 * Получить состояние компонента
	 */
	protected getState(): Readonly<S> {
		return { ...this.state };
	}

	/**
	 * Переключить класс
	 */
	protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
		element?.classList.toggle(className, force);
	}

	/**
	 * Установить текстовое содержимое
	 */
	protected setText(element: HTMLElement, value: unknown): void {
		if (element) {
			element.textContent = String(value);
		}
	}

	/**
	 * Сменить статус блокировки
	 */
	protected setDisabled(element: HTMLElement, state: boolean): void {
		if (element) {
			if (state) {
				element.setAttribute('disabled', 'disabled');
				this.setState({ isDisabled: true } as Partial<S>);
			} else {
				element.removeAttribute('disabled');
				this.setState({ isDisabled: false } as Partial<S>);
			}
		}
	}

	/**
	 * Скрыть элемент
	 */
	protected setHidden(element: HTMLElement): void {
		if (element) {
			element.style.display = 'none';
			this.setState({ isVisible: false } as Partial<S>);
		}
	}

	/**
	 * Показать элемент
	 */
	protected setVisible(element: HTMLElement): void {
		if (element) {
			element.style.removeProperty('display');
			this.setState({ isVisible: true } as Partial<S>);
		}
	}

	/**
	 * Установить изображение
	 */
	protected setImage(element: HTMLImageElement, src: string, alt?: string): void {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	/**
	 * Очистить содержимое элемента
	 */
	protected clear(element: HTMLElement = this.container): void {
		element.innerHTML = '';
	}

	/**
	 * Удалить компонент
	 */
	public destroy(): void {
		this.container.remove();
	}

	/**
	 * Отрисовать компонент
	 */
	public render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.assign(this as object, data);
		}
		return this.container;
	}
}
