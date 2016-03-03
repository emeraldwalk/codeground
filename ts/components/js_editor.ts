namespace Emeraldwalk.Codeground.Components {
	@component(codegroundModule, 'ewJsEditor', {
		scope: {
			source: '=?'
		},
		template: `<div><h2>{{vm.mode}}</h2><div></div></div>`
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