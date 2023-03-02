(function () {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    // 拦截重复 url
    if (!changeInfo.url) return;
    let targetUrl = changeInfo.url;

    // cSpell: ignore newtab
    if (['chrome://newtab/', 'edge://newtab/'].includes(targetUrl)) return;
    if (targetUrl.includes('#')) targetUrl = targetUrl.slice(0, targetUrl.indexOf('#'));
    const tabs = await chrome.tabs.query({ url: targetUrl, active: false });
    if ((changeInfo.status === 'loading' && tabs.length === 1) || tabs.length > 1) {
      const targetTab = tabs.find((t) => t.id !== tabId);
      if (targetTab?.id) {
        await chrome.windows.update(targetTab.windowId, { focused: true });
        await chrome.tabs.update(targetTab.id, { active: true, highlighted: true });
        chrome.tabs.remove(tabId);
      }
    }
  });

  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    // 重定向必应
    if (details.url.includes('bing.com/')) {
      const newHostname = 'global.bing.com';
      const obj = new URL(details.url);

      const search = new URLSearchParams(obj.search ?? '');
      search.set('setlang', 'en-us');
      search.set('setmkt', 'en-us');
      const newURL = 'https://' + newHostname + obj.pathname + '?' + search.toString();
      chrome.tabs.update(details.tabId, { url: newURL });
      return;
    }
  });
})();
