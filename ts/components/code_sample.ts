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
	@inject('$scope', '$element', '$compile')
	export class CodeSample {
		private static _lastId: number = 0;
		private _id: number;
		private get id(): string {
			return `code-sample-${this._id}`;
		}

		private _$scope: ng.IScope;
		private _iframeElement: JQuery;
		private _$compile: ng.ICompileService;

		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$compile: ng.ICompileService) {

			this._id = ++CodeSample._lastId;
			$element.attr('id', this.id);
			$element.append(`<header>Code Sample (${this.moduleName} module)</header>`);

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

		private _moduleName: string;
		public get moduleName(): string {
			return this._moduleName || 'codeSampleModule';
		}
		public set moduleName(value: string) {
			this._moduleName = value;
		}

		public moduleDependencies: Array<string>;

		private _getModuleCreationString(): string {
			var moduleName = this.moduleName;

			var dependencyStr: string = this.moduleDependencies && this.moduleDependencies.length > 0
				? `'${this.moduleDependencies.join("', '")}'`
				: '';

			return `var ${moduleName} = angular.module('${moduleName}', [${dependencyStr}]);`;
		}

		private _rebuild(): void {
			var iHeadElement = this._iframeElement.contents().find('head').empty();
			var iBodyElement = this._iframeElement.contents().find('body').empty();

			this._buildHead(iHeadElement);

			// adding a sub element that can be removed and re-bootstrapped
			var appWrapperElement = $('<div class="app-wrapper"></div>');
			appWrapperElement.appendTo(iBodyElement);
			appWrapperElement.append(this.htmlContent);

			angular.bootstrap(appWrapperElement.get(0), [this.moduleName]);
		}

		private _buildHead(iHeadElement: JQuery): void {

			var iElementRaw: HTMLIFrameElement = <HTMLIFrameElement>this._iframeElement.get(0);

			// clone page styles to iframe head
			$("head link[type='text/css']").clone().appendTo(iHeadElement);
			$("head style").clone().appendTo(iHeadElement);

			// create links for style urls
			this.styleUrls.forEach(url => {
				iHeadElement.append(`<link rel="${url.match(/\.less$/) ? 'stylesheet/less' : 'stylesheet'}" type="text/css" href="${url}">`);
			});

			// create style tag for raw css
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
			// includes a codeSampleModule declaration + any jsContent provided to the directive
			var jsContent = this._getModuleCreationString();
			if(this.jsContent) {
				jsContent = `${jsContent} ${this.jsContent}`;
			}
			iHeadElement.append(`<script type="text/javascript">${jsContent}</script>`);
		}
	}
}