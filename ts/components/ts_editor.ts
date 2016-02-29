namespace Emeraldwalk.CodePlayground.Components {
	@component(codePlaygroundModule, 'ewTsEditor', {
		scope: {
			source: '=?',
			outputExpression: '&output'
		},
		template: `<div></div>`
	})
	@inject('$scope', '$element', '$timeout')
	export class TsEditorComponent extends AceEditorComponent {
		constructor($scope: ng.IScope, $element: ng.IRootElementService, $timeout: ng.ITimeoutService) {
			super($scope, $element, $timeout);

			this.mode = 'typescript';

			$scope.$watch(() => this.source, () => {
				if (this.source !== undefined) {
					var out = ts.transpile(this.source);
					this.outputExpression({ value: out });
				}
			});

			// this._session.on('change', (e) => {
			// 	var out = ts.transpile(this._session.getValue());

			// 	$timeout(() => {
			// 		this.outputExpression({value: out});
			// 	});
			// });
		}

		public outputExpression: (config: Object) => any;
	}
}