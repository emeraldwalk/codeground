namespace Emeraldwalk.Codeground.Services {
	@service(ewCodegroundModule, 'lessService')
	export class LessService {
		/** Compile less to css using a temporary <style> tag and less compiler. */
		public compile(lessStr: string): string {
			var style = $(`<style id="less-service-tmp" type="text/less">${lessStr}</style>`);
			style.appendTo('body');

			// clear any less errors and recompile
			$('.less-error-message').remove();
			less.refresh();

			var result = style.text();

			style.remove();

			return result;
		}
	}
}