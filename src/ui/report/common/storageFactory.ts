class MemoryStorage implements Storage {
	private store = {};
	/**
		* Returns the number of key/value pairs currently present in the list associated with the
		* object.
		*/
	get length(): number {
		return Object.keys(this.store).length;
	};

	/**
	 * Empties the list associated with the object of all key/value pairs, if there are any.
	 */
	clear(): void {
		this.store = {};
	};

	/**
	 * value = storage[key]
	 */
	getItem(key: string): string | null {
		return this.store[key];
	}

	/**
	 * Returns the name of the nth key in the list, or null if n is greater
	 * than or equal to the number of key/value pairs in the object.
	 */
	key(index: number): string | null {
		const key = Object.keys(this.store)[index];
		return key != null ? this.store[key] : null;
	}

	/**
	 * delete storage[key]
	 */
	removeItem(key: string): void {
		delete this.store[key];
	}

	/**
	 * storage[key] = value
	 */
	setItem(key: string, value: string): void {
		this.store[key] = value;
	}
}

let globalStorage = window.localStorage;

try {
	localStorage.setItem('emcit.___test___', '');
	localStorage.removeItem('emcit.___test___');
} catch (e) {
	console.warn('LocalStorage not supported, using in memory storage.');
	globalStorage = new MemoryStorage();
}

export class StorageItem<T> {
	constructor(
		private key: string,
		private storage: Storage,
		private defaultValue?: T
	) { }

	public get(): T {
		const item = this.storage.getItem(this.key);
		return item == null ? this.defaultValue : JSON.parse(item);
	}

	public set(value: T) {
		this.storage.setItem(this.key, JSON.stringify(value));
	}

	public clear() {
		this.storage.removeItem(this.key);
	}
}

export class StorageFactory {
	static create<T>(key: string, defaultValue?: T): StorageItem<T> {
		return new StorageItem<T>(`emcit.${key}`, globalStorage, defaultValue)
	}
}
