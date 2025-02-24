let audio;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'play') {
    if (!audio) {
      audio = new Audio(chrome.runtime.getURL('assets/Raining.mp3'));
      audio.loop = true;
    }
    audio.play();
  } else if (message.action === 'pause') {
    if (audio) {
      audio.pause();
    }
  }
});

// 监听离屏文档关闭事件
window.addEventListener('beforeunload', () => {
  chrome.runtime.sendMessage({ action: "closed" }); // 通知 Service Worker 离屏文档已关闭
});
