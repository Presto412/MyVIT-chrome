/**
 * Created by Vineeth on 29-05-2017.
 */
let courseObserver;
function detectCourse() {
    courseObserver = new MutationObserver(function(e) {
        console.log(e);
        coursePage();
        courseObserver.disconnect();
    });
    courseObserver.observe(document.getElementById('page-wrapper'),{childList:true});
}
let coursePort = chrome.runtime.connect({name: "MyVIT-coursePage"});
coursePort.onMessage.addListener(function (message) {
    if(message.request==="observe")
    {
        detectCourse();
    }
    console.log(message);
});

function coursePage() {
    function handleButton(){
        if ($('.link input:checked').length) {
            $('#download').addClass('pulse').parent().removeClass('scale-out');
            setTimeout(function () {
                $('#download').removeClass('pulse');
            },1000);
        }
        else {
            $('#download').parent().addClass('scale-out');
        }
    }
    function inject() {
        let $t=$('table');
        let $t1=$t.eq(0);
        $t1.find('tr').eq(1).children('td').eq(0).addClass('courseCode').end().eq(1).addClass('courseName').end().eq(2).addClass('courseType').end().eq(4).addClass('courseSlot').end().eq(5).addClass('courseFaculty');
        $('#page-wrapper').prepend(`<div class="fixed-action-button scale-transition scale-out" style="position: fixed;bottom: 5px;right: 5px;">
    <ul style="margin-left:8px;">
        <li><a id="zip" class="button-floating waves-effect waves-light blue tooltipped" data-position="left"
               data-delay="50" data-tooltip="Download selected as zip"><i class="fa fa-file-archive-o"></i></a></li>
    </ul>
    <a
        id="download" class="button-floating button-large waves-effect waves-light teal tooltipped" data-position="left"
        data-delay="50" data-tooltip="Download selected"><i style="font-size: 2.0rem" class="material-icons">file_download</i></a>
    
</div>`);
        let $t3=$t.eq(2);
        $t3.find('tr').eq(0).children('td:nth-child(5)').attr('width','230').children('b').addClass('left').after('<p class="right tooltipped" data-position="right" data-delay="50" data-tooltip="Select All" style="margin:0;"> <input type="checkbox" class="filled-in" id="selectAll"/> <label class="right" for="selectAll"></label> </p>').end().children('td:nth-child(2)').attr('width','130');
        $('p .btn.btn-link').parent().addClass('link');
        $t3.find('tr').each(function (index) {
            if(index!==0){
                let t=$(this).find('.link');
                let cl=0,slno=$(this).children('td').eq(0).text();
                t.each(function () {
                    // console.log($(this).find('font').text());
                    if(($(this).find('span').text()).search("Reference")===-1)
                        $(this).removeClass('link').addClass('noLink');
                    else {
                        $(this).attr('data-fileName',`slno.${slno}.File.${cl+1}`);
                        cl++;
                    }

                });
            }
        });
        let i=0;
        $('.link').each(function () {
            $(this).append(`<p class="right" style="margin:0;"><input type="checkbox" id="item${i}" /><label for="item${i++}"></label></p>`);
        });
        $('.link input:checkbox').change(handleButton);
        $('#selectAll').change(function () {
            if($(this).is(':checked'))
                $('.link input:checkbox').prop('checked',true);
            else
                $('.link input:checkbox').prop('checked',false);
            handleButton();
        });
        $('.tooltipped').tooltip({delay: 50});
    }
    inject();
    let requests=[],xhrs=[],links=[],zipfile,count=0,errormsg=false;
    function collectLinks() {
        $('.link input:checked').each(function () {
            links.push($(this).parent().parent());
        });
        $('.link input:checkbox,#selectAll').prop('checked',false);
        handleButton();
        downloadView();
    }
    function reset() {
        $('#dwnCancel').remove();
        totalBytes=[];
        $sizeTotal=undefined;
        requests=[];
        links=[];
        xhrs=[];
        count=0;
        setTimeout(function () {
            $('.downWrap').fadeOut(500,function () {
                $(this).remove();
            })
        },5000);
        if(errormsg){
            Materialize.toast($(`<h6><i class="fa fa-times" style="margin-right: 10px;"></i>Some files couldn't be downloaded and are marked in red color.</h6>`),5000,"red darken-1")
            errormsg=false;
        }
        console.log('download completed !');
    }
    $('#download').click(function () {
        collectLinks();
        for(let i=0;i<links.length;i++)
        {
            requests.push(downloadController((links[i]).find('a').attr('href'),i,0,(links[i]).attr('data-fileName')))
        }
        $.when.apply(this,requests).then(function () {
            reset();
            // console.log('xhrs -',xhrs);
        }).catch(function () {
            reset();
        });
        // console.log(links);
    });
    $('#zip').click(function () {
        zip.useWebWorkers=false;
        zip.createWriter(new zip.BlobWriter("application/zip"), function(writer) {
            zipfile=writer;
            collectLinks();
            for(let i=0;i<links.length;i++)
                requests.push(downloadController((links[i]).find('a').attr('href'),i,1,(links[i]).attr('data-fileName')));
            $.when.apply(this,requests).then(function () {
                // console.log('appended !!');
                zipfile.close(function(blob) {
                    $('#dwnStatusIcon').removeClass('fa-cog fa-spin').addClass('fa-download');
                    $('#dwnStatus').text('Download completed !').css('font-size','1.4rem');
                    download(blob,`${$('.courseCode').text()}.MyVit-${new Date().getTime()}.zip`);
                    reset();
                });
            }).catch(function () {
                reset();
            });
        });
    });
    let zipStatus=false,zipJob=[];
    function zipHandler(b,n,r)
    {
        if(zipStatus==false&&zipJob.length==0)
        {
            addToZip(b,n,r);
        }
        else
        {
            let t=[b,n,r];
            zipJob.push(t);
        }
    }
    function addToZip(blob,name,resolve){
        zipStatus=true;
        // console.log('zip job started !');
        zipfile.add(name, new zip.BlobReader(blob), function() {
            // console.log('file added !');
            resolve(true);
            if(zipJob.length>0)
            {
                let t=zipJob.pop();
                addToZip(t[0],t[1],t[2]);
            }
            else
            {
                zipStatus=false;
            }
        });
    }
    function downloadView() {
        if($('#downloads').length)
            return;
        let $d=`
<div class="downWrap" style="width:365px;position: fixed;bottom: 50px;right: 25px;z-index: 10;">
    <ul class="collapsible animated slideInRight" style="border: none;" data-collapsible="accordion">
        <li>
            <div class="collapsible-header white-text active" style="background-color: rgba(0, 0, 0, 0.87);border: none;position: relative;">Downloading files - (<span id="count">0</span>/${links.length}) { <span id="sizeTotal"></span> } <i id="dwnCancel" style="position: absolute;right: 5px;top:11px;" class="material-icons tooltipped pull-right" data-position="bottom" data-delay="50" data-tooltip="Cancel downloads" aria-hidden="true">close</i></div>
            <div id="downloads" class="collapsible-body" style="background-color: white;border: none;max-height: 40vh;overflow-y: scroll;overflow-x: hidden;">
            </div>
        </li>
    </ul>
</div>
        `;
        $('body').append($($d));
        $('.collapsible').collapsible();
        $('.tooltipped').tooltip({delay: 50});
        $sizeTotal=$('#sizeTotal');
        $('#dwnCancel').click(function (e) {
            e.stopPropagation();
            $(this).tooltip('remove');
            for(xmlhttp of xhrs)xmlhttp.abort();
        });
    }
    function viewInject(i,name) {
        let str=`<div class="pWrap" id='loader_${i}' style="background-color: rgba(0,0,0,0.1);">
                    <div class="progress">
                        <div class="indeterminate"></div>
                    </div>
                    <div class="details">
                        <p style="font-size: 10px;margin: 0;">File : <span class="name">${name}</span></p>
                        <p style="font-size: 10px;margin: 0;">Size : <span class="size"></span></p>
                    </div>
                </div>`;
        $('#downloads').append($(str));
        $('.pwrap').hover(function () {
            $(this).children('.details').removeClass('hide');
        },function () {
            $(this).children('.details').addClass('hide');
        })
    }
    let $sizeTotal,totalBytes=[];
    function updateSize(i,x){
        totalBytes[i]=x;
        $sizeTotal.text(filesize(totalBytes.reduce((a,c)=>a+c)));
    }
    function downloadController(url,i,mode,name) {
        function getExt(x) {
            return x.substr(x.lastIndexOf('.'));
        }
        viewInject(i,name);
        return new Promise(function(resolve, reject) {
            function skipFile(){
                $('#count').text(++count);
                if(count==links.length)
                    $('#downloads').empty().append($(`<div style="pointer-events: none; opacity: 0.4;"><h4 class="center-align"><i id="dwnStatusIcon" class="fa fa-download left" aria-hidden="true"></i><span id="dwnStatus" style="margin-left: 15px;font-size: 1.4rem;" class="left">Download completed !</span></h4> </div>`));
                $(`#loader_${i}`).fadeOut(500,function () {
                    $(this).remove();
                });
                $(`a[href="${url}"]`).find('span').css('color','red');
                errormsg=true;
                resolve('Download failed !');
                xhrs = xhrs.filter(e => e !==xhr);
            }
            function progressUpdate(e) {
                $(`#loader_${i}`).find(`.size`).text(filesize(e.loaded));
                updateSize(i,e.loaded);
            }
            let xhr = new XMLHttpRequest();
            xhr.open('GET',url,true);
            xhr.responseType = "blob";
            xhr.onprogress=progressUpdate;
            xhr.onload = () => {
                // count++;
                $('#count').text(++count);
                $(`#loader_${i}`).fadeOut(500,function () {
                    $(this).remove();
                });
                if(mode==1)
                {
                    if(count==links.length)
                        $('#downloads').empty().append($(`<div style="pointer-events: none; opacity: 0.4;"><h4 class="center-align"><i id="dwnStatusIcon" class="fa fa-cog fa-spin left" aria-hidden="true"></i><span style="margin-left: 15px;" id="dwnStatus" class="left">Zipping ...</span></h4> </div>`));
                    zipHandler(xhr.response,`${$('.courseCode').text()}.${name+getExt(xhr.getResponseHeader("Content-Disposition"))}`,resolve);
                }
                else
                {
                    if(count==links.length)
                        $('#downloads').empty().append($(`<div style="pointer-events: none; opacity: 0.4;"><h4 class="center-align"><i id="dwnStatusIcon" class="fa fa-download left" aria-hidden="true"></i><span id="dwnStatus" style="margin-left: 15px;font-size: 1.4rem;" class="left">Download completed !</span></h4> </div>`));
                    resolve(true);
                    download(xhr.response,`${$('.courseCode').text()}.${name+getExt(xhr.getResponseHeader("Content-Disposition"))}`);
                }
                // console.log('xhrs -',xhrs);
                xhrs = xhrs.filter(e => e !==xhr);
                if(count==links.length)
                    count = 0;
                // console.log('headers - ',xhr.getAllResponseHeaders());
            };

            xhr.onerror =skipFile;
            xhr.onabort=skipFile;
            xhrs.push(xhr);
            xhr.send();
            // console.log(`request ${i} sent !`);
        });
    }
}