/// <reference path="../KeyValueMap.ts" />

module xm {
	/*
	 LocalStore - store data in localStorage, with JSON serialising and namespace prefix
	 */
	export class LocalStore extends KeyValueMap {

		_supports:bool;

		constructor(prefix:string) {
			super();
			this._prefix = (prefix ? '_' + prefix + '__' : '');
			this._supports = false;

			try {
				if ('localStorage' in window && window['localStorage'] !== null) {
					this._store = window.localStorage;
					this._supports = true;
					console && console.log('has support for localStorage');
				}
			}
			catch (e) {
				//keep hash store
				console && console.log('no support for localStorage');
				this._supports = false;
			}
		}

		public encode(value:any):string {
			return JSON.stringify(value);
		}

		public decode(value:string):any {
			try {
				return JSON.parse(value);
			}
			catch (e) {
			}
			return null;
		}

		public remove(id:string) {
			if (this._supports) {
				this._store.removeItem(id);
			}
			else {
				super.remove.call(this, id);
			}
		}

		public clear(keep?) {
			if (this._supports) {
				this._store.clear();
			}
			else {
				super.clear.call(this);
			}
		}
	}
}