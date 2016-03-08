namespace Emeraldwalk.Codeground.Samples {
	@component(ewCodegroundModule, 'ewBasicTsNgSample', {
		template:
`<div>
	<h1>Codeground Sample</h1>
	<p>This sample shows .less and .ts compilation components with angular.js support.</p>
	<div class="clearfix">
		<div class="pull-left">
			<div class="split-editor">
				<ew-ace-editor source="vm.htmlOutput"></ew-ace-editor>
				<ew-less-editor source="vm.lessSource" on-compile="vm.lessOutput = value"></ew-less-editor>
			</div>
			<div class="split-editor">
				<ew-ts-editor source="vm.tsSource" on-compile="vm.tsOutput = value"></ew-ts-editor>
				<ew-js-editor source="vm.tsOutput"></ew-js-editor>
			</div>
		</div>
		<div class="pull-left output">
			<ew-code-sample module-name="codeSampleModule"
							module-dependencies="['ewCodegroundModule']"
							css-content="vm.lessOutput"
							js-content="vm.tsOutput"
							html-content="vm.htmlOutput"></ew-code-sample>
		</div>
	</div>
</div>`
	})
	export class BasicTsNgSample {
		constructor() {
			this.htmlOutput = '<div ng-controller="MyController as vm">{{vm.message}}</div>';
			this.lessSource =
`body {
	padding: 10px;
	background: green;
	color: white;

	div {
		height: 400px;
	}
}`;
			this.tsSource =
`@controller(codeSampleModule, 'MyController')
class MyController {
	public message: string = 'Hello';
}`;
		}

		public htmlOutput: string;
		public lessSource: string;
		public lessOutput: string;
		public tsSource: string;
		public tsOutput: string;
	}
}