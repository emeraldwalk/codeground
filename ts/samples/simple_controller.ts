var simpleSampleModule = angular.module('simpleSampleModule', ['emeraldwalk.code-playground']);

namespace Emeraldwalk.Codeground.Samples {
	// expose decorators on global namespace
	exposeDecorators(window);

	// setup controller and service functions for lazy loading
	Services.lazyLoad(simpleSampleModule)
		.controller()
		.service();

	@controller(codegroundModule, 'SimpleController')
	export class SimpleController {
		public tsOutput: string;
	}
}