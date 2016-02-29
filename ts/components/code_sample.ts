namespace Emeraldwalk.CodePlayground.Components {
	@component(codePlaygroundModule, 'ewCodeSample', {
		scope: {
			htmlContent: '=',
			jsContent: '='
		},
		template: `<div></div>`
	})
	@inject('$scope', '$element', '$timeout', '$compile')
	export class CodeSample {
		private _$scope: ng.IScope;
		private _iframeElement: JQuery;
		private _$timeout: ng.ITimeoutService;
		private _$compile: ng.ICompileService;

		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$timeout: ng.ITimeoutService,
			$compile: ng.ICompileService) {

			this._$scope = $scope;
			this._iframeElement = $('<iframe></iframe>').appendTo($element);
			this._$timeout = $timeout;
			this._$compile = $compile;

			$scope.$watch(() => this.htmlContent, () => this._buildBody());
			$scope.$watch(() => this.jsContent, () => this._buildHead());
		}

		private _buildHead(): void {
			var headElement = this._iframeElement.contents().find('head');
			headElement.append(`<script type="text/javascript">${this.jsContent}</script>`);
		}

		private _buildBody(): void {
			this._$timeout(() => {
				var bodyElement = this._iframeElement.contents().find('body').empty();

				try {
					var templateFn = this._$compile(this.htmlContent);
					var html = templateFn(this._$scope);
					bodyElement.append(html);
				}
				catch(e) {}
			});
		}

		public htmlContent: string;
		public jsContent: string;
	}
}