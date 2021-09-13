import { getOriginalMethod, isObject, isScrollBehaviorSupported, markPolyfill, modifyPrototypes } from "./common.js";
import type { IScrollConfig } from "./scroll-step";
import { elementScrollIntoView } from "./scrollIntoView.js";

export const elementScrollIntoViewPolyfill = (config?: IScrollConfig): void => {
    if (isScrollBehaviorSupported()) {
        return;
    }

    const originalFunc = getOriginalMethod(window.HTMLElement.prototype, "scrollIntoView");

    modifyPrototypes((prototype) => {
        prototype.scrollIntoView = function scrollIntoView(): void {
            const args = arguments;
            const options = args[0] as unknown;

            if (args.length === 1 && isObject(options)) {
                elementScrollIntoView(this, options as ScrollIntoViewOptions, config);
                return;
            }

            originalFunc.apply(this, args as any);
        };

        // eslint-disable-next-line @typescript-eslint/unbound-method
        markPolyfill(prototype.scrollIntoView);
    });
};