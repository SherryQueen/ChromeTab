(function () {
  'use strict';

  function beautify() {
    const style = document.createElement('style');
    let text: Text | null = null;
    if (location.host === 'zhuanlan.zhihu.com') {
      text = document.createTextNode(`#root .TitleImage {width: 80vw !important}
    #root .Post-SideActions {left: 10px !important}
    #root .Post-NormalMain .Post-Header, #root .Post-NormalMain>div, .Post-NormalSub>div {width: 80vw !important}`);
    } else if (location.host === 'www.zhihu.com') {
      text = document.createTextNode(`
      #root .ContentLayout,#root .Topstory-container,#root .Question-main {width:80vw !important}
      #root .ContentLayout-mainColumn,#root .Question-mainColumn,#root .Topstory-mainColumn {width:calc(80vw - 310px) !important}
      #root .QuestionHeader .QuestionHeader-content {padding: 0 10vw;width:80vw;max-width:80vw}
      #root .QuestionHeader .QuestionHeader-content .QuestionHeader-main {width:calc(100% - 300px)}
      `);
    }
    if (text) style.appendChild(text);

    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }

  beautify();
})();
