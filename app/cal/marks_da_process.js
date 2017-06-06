$(function () {
    let $t=$('table table'),columns;
    $t.wrap('<div class="row"><div class="col s10 push-s1 card-panel" style="padding:0"></div></div>');
    $('tr[width="1%"]').remove();
    $t.each(function () {
        let $th=$(this).find('tr[bgcolor="#5A768D"],tr[bgcolor="#616D7E"],td[bgcolor="#5A768D"],td[bgcolor="#616D7E"]');
        if($th.length>1)
            if($th.eq(-1)[0]===$(this).find('tr').eq(-1)[0])
                $th.eq(-1).remove();
        $('input[type="submit"]').addClass('btn');
        $th.addClass('listHead');
        $('tr[bgcolor!="#5A768D"],td[bgcolor="#EDEADE"]').not('tr[bgcolor="#616D7E"]').addClass('wbg');
    });
    $('td').addClass('center-align');
    if($t.eq(0).find('tr').eq(-1).find('td').eq(3).text().search("Theory")!==-1)
        columns=[3,7];
    else if($t.eq(0).find('tr').eq(-1).find('td').eq(3).text().search("Project")!==-1)
        columns=[2,5];
    else
        columns=[2,6];
    let $iter=$t.eq(-1).find('tr');
    let $l=$iter.eq(-1);
    let $sum=$l.clone(),sum=[0,0];
    $sum.find('td').html("").siblings().not('td').remove();
    $l.after($sum);
    for (let j=2;j<$iter.length;j++)
    {
        sum[0]+=+$iter.eq(j).find('td').eq(columns[0]).text();
        sum[1]+=+$iter.eq(j).find('td').eq(columns[1]).text();
    }
    $sum.find('td').eq(1).html('<b>Total :</b>').end().eq(columns[0]).addClass('sum').html(sum[0]).end().eq(columns[1]).addClass('sum').html(sum[1]);
    // $('font[color="white"]').attr('color','black');
});