export function waitForAddedNode(params) {
  new MutationObserver(function(mutations) {
      var el = document.getElementById('dan');
      if (el) {
          this.disconnect();
          params.done(el);
      }
  }).observe(params.parent || document, {
      subtree: !!params.recursive || !params.parent,
      childList: true,
  });
}