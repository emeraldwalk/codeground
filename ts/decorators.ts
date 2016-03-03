namespace Emeraldwalk.Codeground {
	export interface IInjectableConstructor {
		new (...args: Array<any>): any;
		injectAs?: string;
		$inject?: Array<string>;
	}

	export function inject(...injectableKeys: Array<string>) {
		return function(injectableConstructor: IInjectableConstructor) {
			injectableConstructor.$inject = injectableKeys;
		}
	}

	export function injected(...injectables: Array<IInjectableConstructor>) {
		return function(injectableConstructor: IInjectableConstructor) {
			injectableConstructor.$inject = injectables.map(inj => inj.injectAs);
		}
	}

	export function service(ngModule: ng.IModule, injectAs: string) {
		return function(serviceConstructor: IInjectableConstructor) {
			serviceConstructor.injectAs = injectAs;
			ngModule.service(injectAs, serviceConstructor);
		}
	}

	export function decorator(
		ngModule: ng.IModule,
		injectAs: string,
		directiveOverrides?: ng.IDirective) {

		return function(decoratorConstructor: IInjectableConstructor) {

			// tag constructor function with injector key
			decoratorConstructor.injectAs = injectAs;

			// register a directive using decoratorConstructor for controller
			ngModule.directive(injectAs, () => {

				// defaults
				var directive = {
					scope: false,
					controller: decoratorConstructor,
					bindToController: true
				};

				// overrides
				if (directiveOverrides) {
					for (var prop in directiveOverrides) {
						directive[prop] = directiveOverrides[prop];
					}
				}

				return directive;
			});
		};
	}

	export function controller(
		ngModule: ng.IModule,
		injectAs: string) {

		return function(controllerConstructor: IInjectableConstructor) {
			controllerConstructor.injectAs = injectAs;
			ngModule.controller(injectAs, controllerConstructor);
		};
	}

	export function component(
		ngModule: ng.IModule,
		injectAs: string,
		directiveOverrides?: ng.IDirective) {

		return function(componentConstructor: IInjectableConstructor) {

			// tag constructor function with injector key
			componentConstructor.injectAs = injectAs;

			var directiveFactory = () => {

				// defaults
				var directive = {
					scope: {},
					replace: true,
					controllerAs: 'vm',
					controller: componentConstructor,
					bindToController: true,
					link: (scope: ng.IScope, element: JQuery) => {
						element.addClass(injectAs);
					}
				};

				// overrides
				if (directiveOverrides) {
					for (var prop in directiveOverrides) {
						directive[prop] = directiveOverrides[prop];
					}
				}

				return directive;
			};

			// register a directive using componentConstructor for controller
			ngModule.directive(injectAs, directiveFactory);
		};
	}
}