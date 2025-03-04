import { IEvents } from './events';

/**
 * Интерфейс для моделей
 */
export interface IModel<T extends object> {
	getData(): T;
	update(data: Partial<T>): void;
	validate(): boolean;
}

/**
 * Гарда для проверки на модель
 */
export const isModel = <T extends object>(obj: unknown): obj is Model<T> => {
	return obj instanceof Model;
};

/**
 * Базовая модель
 * @template T - тип данных модели
 */
export abstract class Model<T extends object> implements IModel<T> {
	protected data: T;

	constructor(initialData: Partial<T>, protected events: IEvents) {
		this.data = {} as T;
		this.update(initialData);
	}

	/**
	 * Получить данные модели
	 */
	public getData(): T {
		return { ...this.data };
	}

	/**
	 * Обновить данные модели
	 */
	public update(data: Partial<T>): void {
		this.data = { ...this.data, ...data };
		this.emitChanges('model:updated', this.data);
	}

	/**
	 * Очистить данные модели
	 */
	public clear(): void {
		this.data = {} as T;
		this.emitChanges('model:cleared');
	}

	/**
	 * Проверить валидность модели
	 */
	public abstract validate(): boolean;

	/**
	 * Отправить событие об изменении модели
	 */
	protected emitChanges(event: string, payload?: object): void {
		this.events.emit(event, payload ?? this.data);
	}

	// далее можно добавить общие методы для моделей
}
