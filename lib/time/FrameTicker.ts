/// <reference path="../event/EventDispatcherAlt.ts" />

module xm {
	export class FrameTicker extends xm.EventDispatcherAlt {

		public id:string = 'x';

		public start:() => void;
		public stop:() => void;

		constructor(element, fpsFixed?) {
			super();
			fpsFixed = fpsFixed || 0;

			//hide yer privates
			var running = false;
			var last = 0.0;
			var maxDelta = 1000 / 20;
			var animationRequestID = -1;
			var nextFrameCall, stopCall;
			//that var
			var that:FrameTicker = this;

			var requestAnim = window['requestAnimationFrame'];

			var handleTick = function () {
				if (!running) {
					return;
				}
				//TODO swap in performance.now
				var t = new Date().getTime();
				var delta = Math.min(t - last, maxDelta);
				last = t;

				that.dispatchEvent('tick', delta * 0.001);

				//not stopped
				if (running) {
					nextFrameCall();
				}
			};
			//conditionally defined
			if (fpsFixed > 0) {
				nextFrameCall = function () {
					animationRequestID = setTimeout(handleTick, 1000 / fpsFixed);
				};
				stopCall = function () {
					clearTimeout(animationRequestID);
					animationRequestID = -1;
				};
			}
			else {
				nextFrameCall = function () {
					animationRequestID = requestAnim(handleTick, element);
				};
				stopCall = function () {
					window.cancelAnimationFrame(animationRequestID);
					animationRequestID = -1;
				};
			}
			//public exposure
			this.start = function () {
				if (running) {
					return;
				}
				running = true;
				last = new Date().getTime();
				nextFrameCall();
				that.dispatchEvent('start');
			};
			this.stop = function () {
				if (!running) {
					return;
				}
				running = false;
				stopCall();
				that.dispatchEvent('stop');
			}
		}
	}
}