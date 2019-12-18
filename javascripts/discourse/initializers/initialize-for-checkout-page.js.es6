import { iconHTML } from "discourse-common/lib/icon-library";
import { withPluginApi } from "discourse/lib/plugin-api";
import loadScript from "discourse/lib/load-script";

export default {
  name: "checkout-page",
  initialize() {
    withPluginApi("0.8.7", api => {
      // checkout [wrap] selector
      const selector = "[data-wrap='checkout']";
      // checkout button icon
      const buttonIcon = iconHTML("shopping-cart");
      // we load this here since it adds a click event listner and there's
      // no point adding one for every post.
      loadScript("https://checkoutpage.co/js/overlay.js");
      // decorate posts that contain a checkout button
      api.decorateCooked(
        post => {
          // do we have wraps?
          const postElem = post[0];
          const checkoutWraps = postElem.querySelectorAll(selector);
          // no, bail.
          if (!checkoutWraps.length) return;
          // yes, loop through them
          for (let i = 0; i < checkoutWraps.length; ++i) {
            const wrap = checkoutWraps[i];
            const button = document.createElement("button");

            // give it some classes. cp-button is required by checkoutpage
            button.classList.add("btn", "btn-primary", "cp-button");
            // inherit some properties from the wrap
            button.dataset.checkout = wrap.dataset.checkout;
            button.dataset.seller = wrap.dataset.seller;

            // set the button contents
            button.innerHTML = buttonIcon + wrap.textContent.trim();

            // replace the wrap with the button
            postElem.replaceChild(button, wrap);
          }
        },
        { id: "discourse-checkout" } // give the decorator an id
      );
    });
  }
};
