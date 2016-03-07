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
				<ew-less-editor on-compile="vm.lessOutput = value"></ew-less-editor>
			</div>
			<div class="split-editor">
				<ew-ts-editor on-compile="vm.tsOutput = value"></ew-ts-editor>
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
		public htmlOutput: string;
		public lessOutput: string;
		public tsOutput: string;
	}
}