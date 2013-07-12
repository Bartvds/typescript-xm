/// <reference path="../KeyValueMap.ts" />

module xm {
	export class EventDispatcherAlt {

		/*
		 EventDispatcherAlt - a simple EventDispatcher alternative

		 receiving-listener-self-removal-safe but not hardened against freak scenarios
		 */
		_events:IKeyValueMap;

		constructor() {
			this._events = new KeyValueMap();
		}

		addEventListener(type:string, func) {
			if (this._events.has(type)) {
				this._events.get(type).push(func);
			}
			else {
				this._events.set(type, [func]);
			}
		}

		removeEventListener(type:string, func) {
			if (this._events.has(type)) {
				var listeners:any[] = this._events.get(type);
				for (var i = 0, ii = listeners.length; i < ii; i++) {
					if (listeners[i] === func) {
						listeners.splice(i, 1);
						return;
					}
				}
			}
		}

		dispatchEvent(type:string, data?:any) {
			if (this._events.has(type)) {
				data = data || {};
				//data.currentTarget = target;
				var listeners:any[] = this._events.get(type);

				if (listeners.length === 0) return;
				listeners = listeners.slice(0);
				for (var i = 0, ii = listeners.length; i < ii; i++) {
					listeners[i](data);
				}
			}
		}

		removeAll() {
			this._events.clear();
		}
	}
}