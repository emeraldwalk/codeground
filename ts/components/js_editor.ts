namespace Emeraldwalk.CodePlayground.Components {
	@component(codePlaygroundModule, 'ewJsEditor', {
		scope: {
			source: '=?'
		},
		template: `<div></div>`
	})
	@inject('$scope', '$element', '$timeout')
	export class JsEditorComponent extends AceEditorComponent {
		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$timeout: ng.ITimeoutService) {

			super($scope, $element, $timeout);
			this.mode = 'javascript';
		}
	}
}