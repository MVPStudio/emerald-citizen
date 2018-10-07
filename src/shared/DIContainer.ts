type NoArgsConstructor<T> = new () => T;
type ThingFactory<T> = () => T;
type ThingCreator<T> = ThingFactory<T> | NoArgsConstructor<T>;

export class DIContainer {
	public static get<T>(Thing: ThingCreator<T>): T {
		const thingName = this.isConstructor(Thing) ? Thing.name : Thing.toString();

		if (!this._instances.has(thingName)) {
			this._instances.set(thingName, this.isConstructor(Thing) ? new Thing() : Thing());
		}

		return this._instances.get(thingName) as T;
	}

	private static _instances = new Map<string, any>();

	private static isConstructor<T>(Thing: ThingCreator<T>): Thing is NoArgsConstructor<T> {
		return Thing.hasOwnProperty('prototype');
	}
}