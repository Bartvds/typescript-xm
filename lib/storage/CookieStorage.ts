/// <reference path="../KeyValueMap.ts" />

module xm {
	/*
	 CookieStore - store data in cookies, with JSON serialising and namespace prefix

	 RegExpr stuff butchered from https://developer.mozilla.org/en-US/docs/DOM/document.cookie
	 */
	//end in seconds
	export class CookieStore implements IKeyValueMap {

		_prefix:string;
		_path:string;
		_end:any;
		_secure:bool;
		_domain:string;

		constructor(prefix:string, path:string = '', end = null, secure:bool = false) {
			this._prefix = (prefix ? '_' + prefix + '__' : '');
			this._path = path;
			this._end = end || 14 * 24 * 60 * 60;
			this._secure = secure || false;
			this._domain = null;
		}

		public has(id:string):bool {
			id = this._prefix + id;
			//lol go deeper.. regexpception (see note)
			return (new RegExp("(?:^|;\\s*)" + escape(id).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		}

		public get(id:string, alt?:any = undefined):any {
			if (!id || !this.has(id)) {
				return alt;
			}

			id = this._prefix + id;
			//lol go deeper.. regexpception (see note)
			return this.decode(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(id).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		}

		public set(id:string, value:any) {
			id = this._prefix + id;
			this._setCookie(id, value, this._end, this._path, this._domain, this._secure);
		}

		//TODO specc end type
		_setCookie(id:string, value:any, end:any, path:string, domain:String, secure:bool) {
			if (!id || /^(?:expires|max\-age|path|domain|secure)$/i.test(id)) {
				return;
			}

			var expires = "";
			if (end) {
				switch (end.constructor) {
					case Number:
						//max-age fix attempt from http://mrcoles.com/blog/cookies-max-age-vs-expires/
						var d:Date = new Date();
						d.setTime(d.getTime() + end * 1000); // in milliseconds
						expires = end === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; expires=" + d.toUTCString();
						expires += "; max-age=" + end;
						//expires = end === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + end;
						break;
					case String:
						expires = "; expires=" + end;
						break;
					case Date:
						expires = "; expires=" + end.toUTCString();
						break;
				}
			}
			document.cookie = escape(id) + "=" + this.encode(value) + expires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (secure ? "; secure" : "");
		}

		public remove(id:string) {
			if (!id || !this.has(id)) {
				return;
			}
			var path = (arguments.length > 1) ? arguments[1] : this._path;
			id = this._prefix + id;
			document.cookie = escape(id) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (path ? "; path=" + path : "");
		}

		public keys():string[] {
			var ret = [];
			var len = this._prefix.length;
			// (see note)
			var keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
			for (var i = 0, ii = keys.length; i < ii; i++) {
				var key = unescape(keys[i]);
				if (key !== '') {
					ret.push(name.substr(len));
				}
			}
			return ret;
		}

		public encode(value:any):string {
			return escape(JSON.stringify(value));
		}

		public decode(value:string):any {
			value =
				unescape(value);
			try {
				return JSON.parse(value);
			}
			catch (e) {
			}
			return value;
		}

		public clear(keep?) {
			var keys = this.keys();
			for (var i = 0, ii = keys.length; i < ii; i++) {
				var id = keys[i];
				if (!keep || keep.indexOf(id) > -1) {
					this.remove(id);
				}
			}
		}
	}
}