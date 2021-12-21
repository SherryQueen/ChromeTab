(function () {
  'use strict';

  function beautify() {
    const style = document.createElement('style');
    const text = `
  #juejin .main-container { max-width: 80vw !important}
  #juejin .main-container .main-area { width: calc(100% - 20rem - 16px)}
  #juejin .main-container .main-area .article-hero { max-width: 500px }
  `;
    style.appendChild(document.createTextNode(text));

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
    console.info('insert style');

    const dom = document.querySelector('.extension');
    if (dom) dom.parentElement.removeChild(dom);
  }
  beautify();
})();
