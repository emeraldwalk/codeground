namespace Emeraldwalk.CodePlayground.Components {
	@component(codePlaygroundModule, 'ewAceEditor', {
		scope: {
			mode: '@',
			source: '=?'
		},
		template: `<div></div>`
	})
	@inject('$scope', '$element', '$timeout')
	export class AceEditorComponent {
		protected _session: AceAjax.IEditSession;

		constructor(
			$scope: ng.IScope,
			$element: ng.IRootElementService,
			$timeout: ng.ITimeoutService) {

			$element.addClass('ew-ace-editor');

			var sourceEditor = ace.edit($element.get(0));
			sourceEditor.$blockScrolling = Infinity;
			sourceEditor.setTheme('ace/theme/monokai');
			this._session = sourceEditor.getSession();

			$scope.$watch(() => this.mode, () => {
				this._session.setMode(`ace/mode/${this.mode || 'html'}`);
			});

			$scope.$watch(() => this.source, () => {
				console.log('source:', this.source);
				var value = this._session.getValue();
				var source = this.source || '';

				if(source !== value) {
					this._session.setValue(source);
				}
			});

			this._session.on('change', (e) => {
				$timeout(() => {
					var value = this._session.getValue();
					console.log('value:', value);
					if(this.source !== value) {
						this.source = value;
					}
				});
			});
		}

		public mode: string;
		public source: string;
	}
}