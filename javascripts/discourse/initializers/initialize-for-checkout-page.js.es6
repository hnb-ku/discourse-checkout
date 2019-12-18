import { iconHTML } from "discourse-common/lib/icon-library";
import { escapeExpression } from "discourse/lib/utilities";
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
          checkoutWraps.forEach(wrap => {
            // create a button
            const button = document.createElement("button");
            // give it some classes. cp-button is required by checkoutPage
            button.classList.add("btn", "btn-primary", "cp-button");
            // inherit some properties from the wrap
            button.dataset.checkout = escapeExpression(wrap.dataset.checkout);
            button.dataset.seller = escapeExpression(wrap.dataset.seller);
            // set the button contents
            button.innerHTML = buttonIcon + escapeExpression(wrap.textContent);
            // replace the wrap with the button
            postElem.replaceChild(button, wrap);
          });
        },
        { id: "discourse-checkout" } // give the decorator an id
      );
    });
  }
};
