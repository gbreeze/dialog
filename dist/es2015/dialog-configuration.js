import { Renderer } from './renderer';
import { DefaultDialogSettings } from './dialog-settings';
import { DialogRenderer } from './dialog-renderer';
import { DOM, PLATFORM } from 'aurelia-pal';
const defaultRenderer = DialogRenderer;
const resources = {
    'ux-dialog': PLATFORM.moduleName('./ux-dialog'),
    'ux-dialog-header': PLATFORM.moduleName('./ux-dialog-header'),
    'ux-dialog-body': PLATFORM.moduleName('./ux-dialog-body'),
    'ux-dialog-footer': PLATFORM.moduleName('./ux-dialog-footer'),
    'attach-focus': PLATFORM.moduleName('./attach-focus')
};
// Style changes from the 'input.less' file must also be adapt here.
// compile less: http://less2css.org/
// minify css: https://cssminifier.com/
// tslint:disable-next-line:max-line-length
const defaultCSSText = `ux-dialog-container,ux-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ux-dialog-overlay{opacity:0}ux-dialog-overlay.active{opacity:1}ux-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ux-dialog-container.active{opacity:1}ux-dialog-container>div{padding:30px}ux-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ux-dialog-container,ux-dialog-container>div,ux-dialog-container>div>div{outline:0}ux-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ux-dialog>ux-dialog-body,ux-dialog>ux-dialog-header{padding:16px;display:block}ux-dialog>ux-dialog-header{border-bottom:1px solid #e5e5e5}ux-dialog>ux-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}`;
/**
 * A configuration builder for the dialog plugin.
 */
export class DialogConfiguration {
    constructor(frameworkConfiguration, applySetter) {
        this.renderer = defaultRenderer;
        this.cssText = defaultCSSText;
        this.resources = [];
        this.fwConfig = frameworkConfiguration;
        this.settings = this.fwConfig.container.get(DefaultDialogSettings);
        applySetter(() => this._apply());
    }
    _apply() {
        this.fwConfig.transient(Renderer, this.renderer);
        this.resources.forEach(resourceName => this.fwConfig.globalResources(resources[resourceName]));
        if (this.cssText) {
            DOM.injectStyles(this.cssText);
        }
    }
    /**
     * Selects the Aurelia conventional defaults for the dialog plugin.
     * @return This instance.
     */
    useDefaults() {
        return this.useRenderer(defaultRenderer)
            .useCSS(defaultCSSText)
            .useStandardResources();
    }
    /**
     * Exports the standard set of dialog behaviors to Aurelia's global resources.
     * @return This instance.
     */
    useStandardResources() {
        return this.useResource('ux-dialog')
            .useResource('ux-dialog-header')
            .useResource('ux-dialog-body')
            .useResource('ux-dialog-footer')
            .useResource('attach-focus');
    }
    /**
     * Exports the chosen dialog element or view to Aurelia's global resources.
     * @param resourceName The name of the dialog resource to export.
     * @return This instance.
     */
    useResource(resourceName) {
        this.resources.push(resourceName);
        return this;
    }
    /**
     * Configures the plugin to use a specific dialog renderer.
     * @param renderer A type that implements the Renderer interface.
     * @param settings Global settings for the renderer.
     * @return This instance.
     */
    useRenderer(renderer, settings) {
        this.renderer = renderer;
        if (settings) {
            Object.assign(this.settings, settings);
        }
        return this;
    }
    /**
     * Configures the plugin to use specific css. You can pass an empty string to clear any set css.
     * @param cssText The css to use in place of the default styles.
     * @return This instance.
     */
    useCSS(cssText) {
        this.cssText = cssText;
        return this;
    }
}
