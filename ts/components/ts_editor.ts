namespace Emeraldwalk.Codeground.Components {
	@component(codegroundModule, 'ewTsEditor', {
		scope: {
			source: '=?',
			onCompileExpression: '&onCompile'
		},
		template: `<div><h2>{{vm.mode}}</h2><div></div></div>`
	})
	@inject('$scope', '$element', '$timeout')
	export class TsEditorComponent extends AceEditorComponent {
		constructor($scope: ng.IScope, $element: ng.IRootElementService, $timeout: ng.ITimeoutService) {
			super($scope, $element, $timeout);

			this.mode = 'typescript';

			$scope.$watch(() => this.source, () => {
				if (this.source !== undefined) {
					var out = ts.transpile(this.source);
					this.onCompileExpression({ value: out });
				}
			});
		}

		/** Parent $scope expression */
		public onCompileExpression: (config: {value: string}) => any;
	}
}