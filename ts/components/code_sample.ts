namespace Emeraldwalk.CodePlayground.Components {
	@component(codePlaygroundModule, 'ewCodeSample', {
		scope: {
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

			if(this.cssContent) {
				headElement.append(`<style>${this.cssContent}</style>`);
			}

			if(this.jsContent) {
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

		public cssContent: string;
		public jsContent: string;
		public htmlContent: string;
	}
}