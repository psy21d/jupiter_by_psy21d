const LOCAL_CSS_URL = chrome.runtime.getURL("fonts.css");

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log("[Token Helper] Псаева подделка шрифтов на очко демона:", details.url);
    return { redirectUrl: LOCAL_CSS_URL };
  },
  {
    urls: [
      "*://fonts.googleapis.com/css2?family=Inter*",
      "*://fonts.gstatic.com/s/inter*",
      "*://fonts.googleapis.com/css2?family=Poppins*"
    ],
    types: ["stylesheet", "font"]
  },
  ["blocking"]
);