namespace Emeraldwalk.Codeground.Components {
	@component(codegroundModule, 'ewJsEditor', {
		scope: {
			source: '=?'
		},
		template: `<div><header>{{vm.mode}}</header><div></div></div>`
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