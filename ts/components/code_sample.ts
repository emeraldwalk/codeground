namespace Emeraldwalk.CodePlayground.Components {
	@component(codePlaygroundModule, 'ewCodeSample', {
		scope: {
			styleUrls: '=?',
			jsUrls: '=?',
			cssContent: '=?',
			jsContent: '=?',
			htmlContent: '=?',
		},
		template: `<div></div>`
	})
	@inject('$scope', '$element', '$compile')
	export class CodeSample {
		private _$scope: ng.IScope;
		private _iframeElement: JQuery;
		private _$compile: ng.ICompileService;

		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$compile: ng.ICompileService) {

			this.styleUrls = [];
			this.jsUrls = [];

			this._$scope = $scope;
			this._iframeElement = $('<iframe></iframe>').appendTo($element);
			this._$compile = $compile;

			$scope.$watchGroup([
				() => this.cssContent,
				() => this.jsContent,
				() => this.htmlContent
			], () => this._rebuild());
		}

		private _rebuild(): void {
			this._buildHead();
			this._buildBody();
		}

		private _buildHead(): void {
			var headElement = this._iframeElement.contents().find('head').empty();
			var iframeElementRaw: HTMLIFrameElement = <HTMLIFrameElement>this._iframeElement.get(0);

			// clone page styles to iframe
			$("link[type='text/css']").clone().appendTo(headElement);
			$("style").clone().appendTo(headElement);

			this.styleUrls.forEach(url => {
				// var link = iframeElementRaw.contentWindow.document.createElement('link');
				// link.rel = url.match(/\.less$/) ? 'stylesheet/less' : 'stylesheet';
				// link.type = 'text/css';
				// link.href = url;
				// iframeElementRaw.contentWindow.document.head.appendChild(link);
				headElement.append(`<link rel="${url.match(/\.less$/) ? 'stylesheet/less' : 'stylesheet'}" type="text/css" href="${url}">`);
			});

			if (this.cssContent) {
				headElement.append(`<style type="text/less">${this.cssContent}</style>`);
			}

			var jsUrls = this.jsUrls.slice(0);

			// If less.js or less.min.js is in parent, copy the url
			$('head').find('script').each((i, elem: HTMLScriptElement) => {
				if (elem.src && elem.src.match(/(less|less\.min)\.js$/)) {
					jsUrls.push(elem.src);
					return false;
				}
			});

			jsUrls.forEach(url => {
				var script = iframeElementRaw.contentWindow.document.createElement('script');
				script.type = "text/javascript";
				script.src = url;
				iframeElementRaw.contentWindow.document.head.appendChild(script);
			});

			if (this.jsContent) {
				headElement.append(`<script type="text/javascript">${this.jsContent}</script>`);
			}
		}

		private _buildBody(): void {
			var bodyElement = this._iframeElement.contents().find('body').empty();

			try {
				var templateFn = this._$compile(this.htmlContent);
				var html = templateFn(this._$scope);
				bodyElement.append(html);
			}
			catch (e) {
				console.log(e);
			}
		}

		public styleUrls: Array<string>;
		public jsUrls: Array<string>;
		public cssContent: string;
		public jsContent: string;
		public htmlContent: string;
	}
}