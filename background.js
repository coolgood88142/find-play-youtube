chrome.contextMenus.create( {  
    "id": "showVideoInfo",
    "title": "ShowVideoInfo",
    "contexts": ["all"] 
  })
    
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
      if (info.menuItemId === "showVideoInfo") { 
        console.log(info)
        // send a message from the extension to content script of current tab
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { getUrl: true })
        })
  
        // chrome.scripting.insertCSS({
        //   target: {tabId: tab.id},
        //   file: 'css/content.css'
        // })
      }else{
        return
      }
  })
  
  // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  //   if(request.playVideo){
  //     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  //       chrome.tabs.sendMessage(tabs[0].id, { playVideo: request.playVideo })
  //     })
  //   }
  // })