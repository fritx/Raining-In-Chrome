let offscreenPromise;
let hasOffscreen = false;
let isPlaying = false;

chrome.action.onClicked.addListener(async () => {
  if (!isPlaying) {
    if (!hasOffscreen) {
      // 创建离屏文档
      await ensureOffscreen();
      hasOffscreen = true;
    }
    // 发送消息给离屏文档开始播放
    await chrome.runtime.sendMessage({ action: 'play' });
    isPlaying = true;
    chrome.action.setIcon({ path: 'assets/rain.png' });
    chrome.action.setTitle({ title: "Listen it's raining!" });
  } else {
    // 发送消息给离屏文档停止播放
    await chrome.runtime.sendMessage({ action: 'pause' });
    isPlaying = false;
    chrome.action.setIcon({ path: 'assets/sun.png' });
    chrome.action.setTitle({ title: 'Raining makes everything better!' });
  }
});

// 监听离屏文档关闭的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'closed') {
    hasOffscreen = false;
    isPlaying = false;
    chrome.action.setIcon({ path: 'assets/sun.png' });
    chrome.action.setTitle({ title: 'Raining makes everything better!' });
  }
});

// fix: Error: Only a single offscreen document may be created.
async function ensureOffscreen() {
  if (offscreenPromise) {
    return await offscreenPromise;
  }
  offscreenPromise = chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'Play rain sound'
  });
  try {
    await offscreenPromise;
  } finally {
    offscreenPromise = null;
  }
}
