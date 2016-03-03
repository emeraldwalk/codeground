declare var less: {refresh()};

namespace Emeraldwalk.CodePlayground.Components {
	@component(codePlaygroundModule, 'ewLessEditor', {
		scope: {
			source: '=?',
			onCompileExpression: '&onCompile'
		},
		template: `<div><h2>{{vm.mode}}</h2><div></div></div>`
	})
	@inject('$scope', '$element', '$timeout')
	export class LessEditorComponent extends AceEditorComponent {
		constructor($scope: ng.IScope, $element: ng.IRootElementService, $timeout: ng.ITimeoutService) {
			super($scope, $element, $timeout);

			this.mode = 'less';

			$scope.$watch(() => this.source, () => {
				if (this.source !== undefined) {
					$element.find('style').remove();

					var style = $(`<style type="text/less">${this.source}</style>`)
						.appendTo($element);

					// clear any less errors and recompile
					$('.less-error-message').remove();
					less.refresh();

					this.onCompileExpression({ value: style.text() });
				}
			});
		}

		/** Parent $scope expression */
		public onCompileExpression: (config: {value: string}) => any;
	}
}