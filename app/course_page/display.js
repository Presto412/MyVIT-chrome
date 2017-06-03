/**
 * Created by Vineeth on 29-05-2017.
 */
$(function () {
    zip.useWebWorkers=false;
    $('body').prepend(`<div id="root" class="container" style="width:85%"></div> <div class="fixed-action-btn scale-transition scale-out" style="position: fixed;bottom: 5px;right: 5px;"> <a id="download" class="btn-floating btn-large waves-effect waves-light teal tooltipped" data-position="left" data-delay="50" data-tooltip="Download selected"><i class="material-icons">file_download</i></a> <ul> <li><a id="zip" class="btn-floating waves-effect waves-light blue tooltipped" data-position="left" data-delay="50" data-tooltip="Download selected as zip"><i class="fa fa-file-archive-o"></i></a></li> </ul> `);
    let $root=$('#root');
   $('#content table').each(function () {
       $(this).wrap('<div class="row"></div>');
       let $t= $(this).parent().detach();
       $root.append($t);
   });
   $('#content').remove();
   $root.find('table').eq(0).find('tr').eq(0).addClass('listHead');
   $root.find('table').eq(0).find('tr').eq(1).addClass('wbg');
   $root.find('table').wrap('<div class="card-panel" style="padding: 0;"></div>');
   let $t2=$root.find('table').eq(1);
   $t2.find('td[bgcolor="#5A768D"]').addClass('listHead');
   $t2.find('td[bgcolor="#EDEADE"]').addClass('wbg');
   $t2.find('a').addClass('btn btn-flat').css('height','100%');
   $t2.find('tr').eq(0).remove();
   $t2.find('tr').eq(-1).remove();
   $t2.find('input[name="sybcmd"]').addClass('btn btn-flat');
   $t2.find('tr').each(function () {
       if($(this).children('td').eq(-1).text()=='')$(this).remove();
       else{
           let $txt=$(this).children('td').eq(-1).find('font');
           $txt.text($txt.text().replace(/_/g,"-"));
       }
   });
   let $t3=$root.find('table').eq(2);
   $t3.find('tr').eq(0).addClass('listHead').children('td:nth-child(5)').attr('width','230').append('<p class="right tooltipped" data-position="left" data-delay="50" data-tooltip="Select All" style="margin:0;"> <input type="checkbox" class="filled-in" id="selectAll"/> <label for="selectAll"></label> </p>').end().children('td:nth-child(2)').attr('width','130');
   $t3.find('tr[bgcolor="#EDEADE"]').addClass('list').css('cursor','default').each(function () {
       $(this).children('td').eq(-1).addClass('rm').find('a').wrap('<div class="link" style="margin: 15px 0;"></div>').end().find('br').remove().end();
       let t=$(this).find('.link');
       t.each(function () {
           console.log($(this).find('font').text());
           if(($(this).find('font').text()).search("Reference")==-1)
               $(this).removeClass('link').addClass('noLink');
       });
   });
   let i=0;
   $('.link').each(function () {
       $(this).append(`<p class="right" style="margin:0;"><input type="checkbox" id="item${i}" /><label for="item${i++}"></label></p>`);
   });
   $('.rm').each(function () {
       let $l=$(this).find('.link,.noLink').detach();
       $(this).empty().append($l);
   });
   $('.tooltipped').tooltip({delay: 50});
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
   $('.link input:checkbox').change(handleButton);
   $('#selectAll').change(function () {
       if($(this).is(':checked'))
           $('.link input:checkbox').prop('checked',true);
       else
           $('.link input:checkbox').prop('checked',false);
       handleButton();
   });
   let requests=[],links=[],zipfile,count=0;
    function collectLinks() {
        $('.link input:checked').each(function () {
            console.log($(this));
            let $a=$(this).parent().siblings('a');
            links.push($a.attr('href'));
        });
        $('.link input:checkbox,#selectAll').prop('checked',false);
        handleButton();
        downloadView();
    }
    $('#download').click(function () {
        collectLinks();
        for(let i=0;i<links.length;i++)
        {
            requests.push(downloadController(links[i],i,0))
        }
        $.when.apply(this,requests).then(function () {
            requests=[];
            links=[];
            setTimeout(function () {
                $('.downWrap').fadeOut(500,function () {
                    $(this).remove();
                })
            },5000);
            console.log('download completed !')
        });
        console.log(links);
    });
    $('#zip').click(function () {
        zipfile=undefined;
        zip.createWriter(new zip.BlobWriter("application/zip"), function(writer) {
           zipfile=writer;
            collectLinks();
            for(let i=0;i<links.length;i++)
                requests.push(downloadController(links[i],i,1));
            $.when.apply(this,requests).then(function () {
                console.log('appended !!');
                zipfile.close(function(blob) {
                    $('#dwnStatusIcon').removeClass('fa-cog fa-spin').addClass('fa-download');
                    $('#dwnStatus').text('Your download is ready !').css('font-size','1.4rem');
                    download(blob,`File.zip`);
                    requests=[];
                    links=[];
                    setTimeout(function () {
                        $('.downWrap').fadeOut(500,function () {
                            $(this).remove();
                        })
                    },5000);
                    console.log('download completed !');
                });
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
        console.log('zip job started !');
        zipfile.add(name, new zip.BlobReader(blob), function() {
            console.log('file added !');
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
            <div class="collapsible-header white-text active" style="background-color: rgba(0, 0, 0, 0.87);border: none;">Downloading files - (<span id="count">1</span>/${links.length})<i id="dwnCancel" class="material-icons tooltipped right" data-position="bottom" data-delay="50" data-tooltip="Cancel downloads" aria-hidden="true">close</i></div>
            <div id="downloads" class="collapsible-body" style="background-color: white;border: none;max-height: 40vh;overflow-y: scroll;overflow-x: hidden;">
            </div>
        </li>
    </ul>
</div>
        `;
        $('body').append($($d));
        $('.collapsible').collapsible();
        $('.tooltipped').tooltip({delay: 50});
    }
    function viewInject(i) {
        let str=`<div class="pWrap" id='loader_${i}' style="background-color: rgba(0,0,0,0.1);">
                    <div class="progress">
                        <div class="determinate" style="width:0%"></div>
                    </div>
                    <div class="details hide">
                        <p style="font-size: 10px;margin: 0;">File : <span class="name"></span></p>
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
    function downloadController(url,i,mode) {
        function getExt(x) {
            return x.substr(x.lastIndexOf('.'));
        }
        function progressUpdate(e) {
            if (e.lengthComputable) {
                let percentComplete = e.loaded / e.total;
                $(`#loader_${i}`).find(`.determinate`).css('width',Math.round(percentComplete * 100) + "%");
            }
        }
        viewInject(i);
        return new Promise(function(resolve, reject) {

            // $('#root').append($('<div class="progress"><div id="dbar" class="determinate" style="width: 0%"></div></div><a id="dInit" class="hide"></a>'));
            let xhr = new XMLHttpRequest();
            xhr.open('GET',url,true);
            xhr.responseType = "blob";
            xhr.onprogress=progressUpdate;
            xhr.onreadystatechange = function() {
                if(this.readyState == this.HEADERS_RECEIVED) {
                    console.log('size - ',filesize(xhr.getResponseHeader("Content-Length")));
                    console.log('Type - ',getExt(xhr.getResponseHeader("Content-Disposition")));
                }
            };
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
                    zipHandler(xhr.response,`File.${i}${getExt(xhr.getResponseHeader("Content-Disposition"))}`,resolve);
                }
                else
                {
                    if(count==links.length)
                        $('#downloads').empty().append($(`<div style="pointer-events: none; opacity: 0.4;"><h4 class="center-align"><i id="dwnStatusIcon" class="fa fa-download left" aria-hidden="true"></i><span id="dwnStatus" style="margin-left: 15px;font-size: 1.4rem;" class="left">Your download is ready !</span></h4> </div>`));
                    resolve(true);
                    download(xhr.response,`File.${i}${getExt(xhr.getResponseHeader("Content-Disposition"))}`);
                }

                if(count==links.length)
                    count = 0;
                console.log('headers - ',xhr.getAllResponseHeaders());
            };
            xhr.onerror = () => {
                reject('Download failed !');
            };
            xhr.send();
            console.log(`request ${i} sent !`);
        });
    }
});