namespace Emeraldwalk.Codeground.Components {
	@component(ewCodegroundModule, 'ewTsEditor', {
		scope: {
			source: '=?',
			onCompileExpression: '&onCompile'
		},
		template: `<div><header>{{vm.mode}}</header><div></div></div>`
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