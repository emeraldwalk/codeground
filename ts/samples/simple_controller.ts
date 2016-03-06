var simpleSampleModule = angular.module('simpleSampleModule', ['emeraldwalk.code-playground']);

namespace Emeraldwalk.Codeground.Samples {
	// expose decorators on global namespace
	exposeDecorators(window);

	// Deprecated: don't need this anymore since I figured out how
	// to bootstrap a sub app inside of the code sample component.
	// // setup controller and service functions for lazy loading
	// Services.lazyLoad(simpleSampleModule)
	// 	.controller()
	// 	.service();

	@controller(codegroundModule, 'SimpleController')
	export class SimpleController {
		public tsOutput: string;
	}
}