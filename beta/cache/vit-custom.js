//calling controller method for navigation of view using parameterized urlPattern
function loadmydiv(urlPattern) {

	$.ajax({
		type: "POST",
		url : urlPattern,
		success : function(response) {
			//console.log(response);
			$("#page-wrapper").html(response);			
			$.unblockUI();
		},
		error : function(e) {
			 $("#myModal").modal();
			$.unblockUI();
		}
	});
}



function ajaxCall(urlText,dataText,target) {
	
	
	var success_flag=true;
	
	var findText="___INTERNAL___RESPONSE___";

	if(target==null) {
		target="page-wrapper";
	}
	
	$.ajax({
		type : "POST",
		url : urlText,
		data : dataText,
		success : function(response){
			
			if(response.search(findText)==-1) {
				$("#"+target).html(response);
			}else {
				$(document.body).html(response);
			}
			
		},
		error : function(jqXHR, textStatus, errorMessage) {
			success_flag=false;
			$("#"+target).html(errorMessage);
		}		
		
	});

	return success_flag;
	
}


