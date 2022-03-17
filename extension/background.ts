(function () {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
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
      }
      chrome.tabs.remove(tabId);
    }
  });
})();
