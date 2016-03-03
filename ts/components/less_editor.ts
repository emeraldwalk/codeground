declare var less: {refresh()};

namespace Emeraldwalk.Codeground.Components {
	@component(codegroundModule, 'ewLessEditor', {
		scope: {
			source: '=?',
			onCompileExpression: '&onCompile'
		},
		template: `<div><h2>{{vm.mode}}</h2><div></div></div>`
	})
	@inject('$scope', '$element', '$timeout', 'lessService')
	export class LessEditorComponent extends AceEditorComponent {
		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$timeout: ng.ITimeoutService,
			lessService: Services.LessService) {

			super($scope, $element, $timeout);

			this.mode = 'less';

			$scope.$watch(() => this.source, () => {
				if (this.source !== undefined) {
					var css = lessService.compile(this.source);
					this.onCompileExpression({ value: css });
				}
			});
		}

		/** Parent $scope expression */
		public onCompileExpression: (config: {value: string}) => any;
	}
}