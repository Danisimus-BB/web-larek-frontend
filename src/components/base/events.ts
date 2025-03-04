/**
 * Типы для системы событий
 */
export type EventName = string | RegExp;
export type EventCallback<T = any> = (data: T) => void;
export type EventSubscriber = Set<EventCallback>;
export type EventMap = Map<EventName, EventSubscriber>;

export interface IEmitterEvent<T = any> {
	eventName: string;
	data: T;
}

/**
 * Интерфейс для системы событий
 */
export interface IEvents {
	on<T extends object>(event: EventName, callback: EventCallback<T>): void;
	off(event: EventName, callback: EventCallback): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(event: string, context?: Partial<T>): EventCallback<T>;
	onAll<T>(callback: (event: IEmitterEvent<T>) => void): void;
	offAll(): void;
}

/**
 * Брокер событий
 */
export class EventEmitter implements IEvents {
	private readonly _events: EventMap;

	constructor() {
		this._events = new Map();
	}

	/**
	 * Установить обработчик на событие
	 */
	public on<T extends object>(eventName: EventName, callback: EventCallback<T>): void {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set());
		}
		this._events.get(eventName)?.add(callback);
	}

	/**
	 * Снять обработчик с события
	 */
	public off(eventName: EventName, callback: EventCallback): void {
		const subscribers = this._events.get(eventName);
		if (subscribers) {
			subscribers.delete(callback);
			if (subscribers.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	/**
	 * Инициировать событие с данными
	 */
	public emit<T extends object>(eventName: string, data?: T): void {
		this._events.forEach((subscribers, name) => {
			if (this.isEventMatch(name, eventName)) {
				subscribers.forEach(callback => callback(data));
			}
		});
	}

	/**
	 * Слушать все события
	 */
	public onAll<T>(callback: (event: IEmitterEvent<T>) => void): void {
		this.on('*', callback);
	}

	/**
	 * Сбросить все обработчики
	 */
	public offAll(): void {
		this._events.clear();
	}

	/**
	 * Создать триггер события
	 */
	public trigger<T extends object>(eventName: string, context?: Partial<T>): EventCallback<T> {
		return (data: T = {} as T) => {
			this.emit(eventName, {
				...data,
				...context
			});
		};
	}

	/**
	 * Проверить соответствие имени события паттерну
	 */
	private isEventMatch(pattern: EventName, eventName: string): boolean {
		return (pattern instanceof RegExp && pattern.test(eventName)) || pattern === eventName;
	}
}
