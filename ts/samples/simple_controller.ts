var simpleSampleModule = angular.module('simpleSampleModule', ['emeraldwalk.code-playground']);

namespace Emeraldwalk.CodePlayground.Samples {
	@controller(codePlaygroundModule, 'SimpleController')
	@inject('$scope')
	export class SimpleController {
		constructor($scope: ng.IScope) {
			$scope.$watch(() => this.tsOutput, () => {
				console.log(this.tsOutput);
			});
		}

		public tsOutput: string;
	}
}