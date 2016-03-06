namespace Emeraldwalk.Codeground.Services {
	/**
	 * Helper to instantiate a LazyLoadChain.
	 */
	export function lazyLoad(module: ng.IModule): LazyLoadChain {
		return new LazyLoadChain(module);
	}

	/**
	 * Registering angular services, controllers, etc. can usually only be done pre-bootstrapping.
	 * The underlying registration code is available at config time via various providers.
	 * This class can swap out the standard registration methods with ones that can be used for
	 * registering providers after bootstrapping occurs.
	 */
	export class LazyLoadChain {
		private _module: ng.IModule;

		constructor(module: ng.IModule) {
			this._module = module;
		}

		/*
		 * Replacing controller function with a version that will stick around for lazy loading.
		 */
		public controller(): LazyLoadChain {
			var module = this._module;
			module.config(['$controllerProvider', function($controllerProvider: ng.IControllerProvider) {
				module.controller = <any>function(name: string, controllerConstructor: Function): ng.IModule {
					$controllerProvider.register(name, controllerConstructor);
					return this;
				};
			}]);

			return this;
		}

		/*
		 * Replacing service function with a version that will stick around for lazy loading.
		 */
		public service(): LazyLoadChain {
			var module = this._module;
			module.config(['$provide', function($provide: ng.auto.IProvideService) {
				module.service = <any>function(name: string, serviceConstructor: Function): ng.IModule {
					$provide.service(name, serviceConstructor);
					return this;
				}
			}]);

			return this;
		}
	}
}