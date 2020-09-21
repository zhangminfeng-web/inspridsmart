// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  //这个位置可以访问nodejs的api，可以使用nodejs库。访问数据库和网络在这里实现
  //var $ = require("./jquery.min");
  const $ = require('jquery');
  const appServer = require("./app.js");
  $.app = appServer;//将nodejs库的接口传给web库调用。
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
