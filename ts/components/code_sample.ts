namespace Emeraldwalk.Codeground.Components {
	@component(ewCodegroundModule, 'ewCodeSample', {
		scope: {
			styleUrls: '=?',
			jsUrls: '=?',
			cssContent: '=?',
			jsContent: '=?',
			htmlContent: '=?',
			moduleName: '@',
			moduleDependencies: '=?'
		},
		template: `<div></div>`
	})
	@inject('$scope', '$element', '$compile', '$timeout')
	export class CodeSample {
		private static _lastId: number = 0;
		private _id: number;
		private get id(): string {
			return `code-sample-${this._id}`;
		}

		private _$scope: ng.IScope;
		private _iframeElement: JQuery;
		private _iHeadElement: JQuery;
		private _iBodyElement: JQuery;
		private _$compile: ng.ICompileService;
		private _$timeout: ng.ITimeoutService;

		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$compile: ng.ICompileService,
			$timeout: ng.ITimeoutService) {

			this._id = ++CodeSample._lastId;
			$element.attr('id', this.id);
			$element.append(`<header>Code Sample (${this.moduleName} module)</header>`);

			this.styleUrls = [];
			this.jsUrls = [];

			this._$scope = $scope;
			this._iframeElement = $('<iframe></iframe>').appendTo($element);
			this._$compile = $compile;
			this._$timeout = $timeout;

			$scope.$watchGroup([
				() => $('head style').length, //account for certain styles that appear to be added then removed by .less compiler
				() => this.styleUrls,
				() => this.jsUrls,
				() => this.cssContent,
				() => this.jsContent,
				() => this.htmlContent
			], () => this._rebuild());

			$scope.$watch(() => this._iBodyElement && this._iBodyElement.get(0).offsetHeight, () => {
				this._resizeIframe();
			});
		}

		public styleUrls: Array<string>;
		public jsUrls: Array<string>;
		public cssContent: string;
		public jsContent: string;
		public htmlContent: string;

		private _moduleName: string;
		public get moduleName(): string {
			return this._moduleName || 'codeSampleModule';
		}
		public set moduleName(value: string) {
			this._moduleName = value;
		}

		public moduleDependencies: Array<string>;

		/**
		 * Set height of iframe based on its content.
		 * Using a cancellation mechanism so that only
		 * the last resize call per digest cycle is processed.
		 */
		private _resizeIframePromise: ng.IPromise<any>;
		private _resizeIframe(): void {
			this._$timeout.cancel(this._resizeIframePromise);
			this._resizeIframePromise = this._$timeout(() => {
				var height = this._iBodyElement.get(0).offsetHeight;
				this._iframeElement.height(height);
			});
		}

		private _getModuleCreationString(): string {
			var moduleName = this.moduleName;

			var dependencyStr: string = this.moduleDependencies && this.moduleDependencies.length > 0
				? `'${this.moduleDependencies.join("', '")}'`
				: '';

			return `var ${moduleName} = angular.module('${moduleName}', [${dependencyStr}]);`;
		}

		private _rebuild(): void {
			this._iframeElement.height(0);
			this._iHeadElement = this._iframeElement.contents().find('head').empty();
			this._iBodyElement = this._iframeElement.contents().find('body').empty();

			this._buildHead();

			// adding a sub element that can be removed and re-bootstrapped
			var appWrapperElement = $('<div class="app-wrapper"></div>');
			appWrapperElement.appendTo(this._iBodyElement);
			appWrapperElement.append(this.htmlContent);

			angular.bootstrap(appWrapperElement.get(0), [this.moduleName]);

			this._resizeIframe();
		}

		private _buildHead(): void {

			var iElementRaw: HTMLIFrameElement = <HTMLIFrameElement>this._iframeElement.get(0);

			// clone page styles to iframe head
			$("head link[type='text/css']").clone().appendTo(this._iHeadElement);
			$("head style").clone().appendTo(this._iHeadElement);

			// create links for style urls
			this.styleUrls.forEach(url => {
				this._iHeadElement.append(`<link rel="${url.match(/\.less$/) ? 'stylesheet/less' : 'stylesheet'}" type="text/css" href="${url}">`);
			});

			// create style tag for raw css
			if (this.cssContent) {
				this._iHeadElement.append(`<style type="text/css">${this.cssContent}</style>`);
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
			// includes a codeSampleModule declaration + any jsContent provided to the directive
			var jsContent = this._getModuleCreationString();
			if(this.jsContent) {
				jsContent = `${jsContent} ${this.jsContent}`;
			}
			this._iHeadElement.append(`<script type="text/javascript">${jsContent}</script>`);
		}
	}
}