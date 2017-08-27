/**
 * Created by Vineeth on 26-08-2017.
 */
let cache;
(function cacheInit() {
    chrome.runtime.getPackageDirectoryEntry(function(root) {
        root.getDirectory("cache", {create: false}, function(localesdir) {
            let reader = localesdir.createReader();
            // Assumes that there are fewer than 100 files; otherwise see DirectoryReader docs
            reader.readEntries(function(results) {
                cache=results.map(function(de){return de.name;}).sort();
            });
        });
    });
})();
function fileExists(fileName) {
    return (_.contains(cache,fileName))?[true,'cache/'+fileName]:[false,fileName];
}
function getFileName(str) {
    return str.substring(str.lastIndexOf('/')+1);
}
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        let fileCheck=fileExists(getFileName(details.url));
        console.log(fileCheck);
        return (fileCheck[0])?{redirectUrl: chrome.extension.getURL(fileCheck[1])}:{};
        // return {cancel:true};
    },
    {urls: ["*://vtopbeta.vit.ac.in/vtop/assets/*"]},
    ["blocking"]);

//---- Fixes for the broken website ----
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (details.url==="https://vtopbeta.vit.ac.in/vtop/"||details.url==="https://vtopbeta.vit.ac.in/vtop/#"||details.url==="https://vtopbeta.vit.ac.in/vtop/processLogout")
        {
            chrome.cookies.getAll({domain: "vtopbeta.vit.ac.in"}, function(cookies) {
                for(let i=0; i<cookies.length;i++) {
                    chrome.cookies.remove({url: "https://vtopbeta.vit.ac.in" + cookies[i].path, name: cookies[i].name},function (c) {
                        console.log('deleted cookie !',c);
                    });
                }
            });
        }
    },
    {urls: ["*://vtopbeta.vit.ac.in/*"]},
    ["blocking"]);