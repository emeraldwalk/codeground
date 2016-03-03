namespace Emeraldwalk.Codeground.Components {
	@component(codegroundModule, 'ewCodeSample', {
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
				() => this.styleUrls,
				() => this.jsUrls,
				() => this.cssContent,
				() => this.jsContent,
				() => this.htmlContent
			], () => this._rebuild());
		}

		public styleUrls: Array<string>;
		public jsUrls: Array<string>;
		public cssContent: string;
		public jsContent: string;
		public htmlContent: string;

		private _rebuild(): void {
			this._buildHead();
			this._buildBody();
		}

		private _buildHead(): void {
			var iHeadElement = this._iframeElement.contents().find('head').empty();
			var iElementRaw: HTMLIFrameElement = <HTMLIFrameElement>this._iframeElement.get(0);

			// clone page styles to iframe head
			$("head link[type='text/css']").clone().appendTo(iHeadElement);
			$("head style").clone().appendTo(iHeadElement);

			// create links for style urls
			this.styleUrls.forEach(url => {
				iHeadElement.append(`<link rel="${url.match(/\.less$/) ? 'stylesheet/less' : 'stylesheet'}" type="text/css" href="${url}">`);
			});

			// create style tag for raw css wrapped in a sandboxed context
			if (this.cssContent) {
				iHeadElement.append(`<style type="text/css">${this.cssContent}</style>`);
			}

			// create script tags for all .js urls
			this.jsUrls.forEach(url => {
				// creating script tags via jQuery doesn't load the scripts, so have to use createElement
				var script = iElementRaw.contentWindow.document.createElement('script');
				script.type = "text/javascript";
				script.src = url;
				iElementRaw.contentWindow.document.head.appendChild(script);
			});

			// create script tag for raw .js
			if (this.jsContent) {
				iHeadElement.append(`<script type="text/javascript">${this.jsContent}</script>`);
			}
		}

		private _buildBody(): void {
			var iBodyElement = this._iframeElement.contents().find('body');
			iBodyElement.empty();

			try {
				var templateFn = this._$compile(this.htmlContent);
				var html = templateFn(this._$scope);
				iBodyElement.append(html);
			}
			catch (e) {
				console.log(e);
			}
		}
	}
}