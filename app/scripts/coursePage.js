$(function () {
   $('body').append(`<div style="margin-top:-200px;max-width: 800px;">
<iframe style="width:100%;" src="${chrome.extension.getURL ('course_page/index.html')}" frameborder="0"></iframe>
</div>`);
});

// let port = chrome.runtime.connect({name: "MyVIT_coursePage"});