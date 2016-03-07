namespace Emeraldwalk.Codeground.Components {
	@component(ewCodegroundModule, 'ewAceEditor', {
		scope: {
			mode: '@',
			source: '=?'
		},
		template: `<div><header>{{vm.mode}}</header><div></div></div>`
	})
	@inject('$scope', '$element', '$timeout')
	export class AceEditorComponent {
		private _session: AceAjax.IEditSession;

		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$timeout: ng.ITimeoutService) {

			$element.addClass('ew-ace-editor');

			var sourceEditor = ace.edit($element.find('div').get(0));
			sourceEditor.$blockScrolling = Infinity;
			sourceEditor.setTheme('ace/theme/monokai');
			this._session = sourceEditor.getSession();

			$scope.$watch(() => this.mode, () => {
				this._session.setMode(`ace/mode/${this.mode}`);
			});

			$scope.$watch(() => this.source, () => {
				var source = this.source || '';

				if(source !== this.editorValue) {
					this.editorValue = source;
				}
			});

			// ace editor changes (with a typing delay)
			var timeoutPromise;
			this._session.on('change', (e) => {
				$timeout.cancel(timeoutPromise);
				timeoutPromise = $timeout(() => {
					if(this.source !== this.editorValue) {
						this.source = this.editorValue;
					}
				}, 1000);
			});
		}

		protected get editorValue(): string {
			return this._session.getValue();
		}
		protected set editorValue(value: string) {
			this._session.setValue(value);
		}

		//public mode: string;
		private _mode: string;
		public get mode(): string {
			return this._mode || 'html';
		}
		public set mode(value: string) {
			this._mode = value;
		}

		public source: string;
	}
}