(function () {
  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
    if (changeInfo.status !== 'loading' || !changeInfo.url) return;

    let targetUrl = changeInfo.url;
    if (targetUrl.includes('#')) targetUrl = targetUrl.slice(0, targetUrl.indexOf('#'));
    const tabs = await chrome.tabs.query({ url: targetUrl });
    if (tabs.length > 1) {
      const targetTab = tabs.find((t) => t.id !== tabId);
      if (targetTab?.id) chrome.tabs.update(targetTab.id, { active: true });
      chrome.tabs.remove(tabId);
    }
  });
})();
