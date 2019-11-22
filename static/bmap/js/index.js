	
var container = document.getElementById('map');
var options = {
	center: new daum.maps.LatLng(37.498265, 127.027638),
	level: 2
};

var map = new daum.maps.Map(container, options);
var geocoder = new daum.maps.services.Geocoder();

map.addOverlayMapTypeId(daum.maps.MapTypeId.USE_DISTRICT);    

//map.removeOverlayMapTypeId(daum.maps.MapTypeId.TERRAIN);  

function searchInputAddr(){
	var addrInputData = $("#sendsearch").serialize();

	var addr_result_div = document.getElementById('addr-result'); 
	addr_result_div.innerHTML = $('input#search-box-input').val();

	$.ajax({
        url:'/bmap/',
		type:'POST',
		data : addrInputData,
		success : function(response){
			document.getElementById('develop-info').style.display = "block";
			document.getElementById('develop-display-box').style.display = "block";
			document.getElementById('building-info').style.display = "block";
			if (response.errormsg != "no xml struct data"){
				document.getElementById('develop-result').innerHTML = 
				"location : " + response.location + "</br>" +
				"guyukCdNm : " + response.guyukCdNm + "</br>" +
				"jimokCdNm : " + response.jimokCdNm + "</br>" +
				"jiyukCdNm : " + response.jiyukCdNm + "</br>" +
				"jiguCdNm : " + response.jiguCdNm + "</br>" +
				"mainPurpsCdNm : " + response.mainPurpsCdNm + "</br>" +
				"archGbCd : " + response.archGbCd + "</br>" +
				"useAprDay : " + response.useAprDay + "</br>" +
				"건폐율 : " + response.gun + "</br>" +
				"용적률 : " + response.yong + "</br>";
				/*"현재 건폐율 : " + response.real_gun + "</br>" +
				"현재 용적률 : " + response.real_yong + "</br>" +
				"대지면적 : " + response.platArea;
				*/

				var allow_y = response.yong/100 * response.platArea;
				var temp_y = response.real_yong/100 * response.platArea;
				console.log(allow_y);
				console.log(temp_y);
				

				var wdth = getwidth(allow_y, temp_y);
				var diff = allow_y - temp_y;

				document.getElementById('temp').style.width = wdth[0]+"px";
				document.getElementById('allow').style.width = wdth[1]+"px";
				document.getElementById('temp').innerHTML = "<b>"+(temp_y+'').split(".")[0]+"m<sup>2</sup></b>";
				document.getElementById('allow').innerHTML = "<b>"+(allow_y+'').split(".")[0]+"m<sup>2</sup></b>";
				document.getElementById('diff-display').innerHTML = (diff+'').split(".")[0]+"m<sup>2</sup>";
				document.getElementById('diff').style.left = (wdth[0]+6)+"px";
				document.getElementById('diff').style.width = (wdth[1]-wdth[0])+"px";

	

				if (response.errormsg != "no xml dong data"){
					document.getElementById('building-info-content').innerHTML = 
					"mainPurpsCdNm : " + response.mainPurpsCdNm + "</br>" +
					"strctCdNm : " + response.strctCdNm + "</br>" +
					"bldNm : " + response.bldNm + "</br>" +
					"hhldCnt : " + response.hhldCnt + "</br>" +
					"fmlyCnt : " + response.fmlyCnt + "</br>" +
					"hoCnt : " + response.hoCnt + "</br>" +
					"archArea : " + response.archArea + "</br>";

					if (response.errormsg != "no xml gongsijiga data"){
						document.getElementById('building-info-content').innerHTML +=
						"lndcgrCodeNm : " + response.lndcgrCodeNm + "</br>" +
						"prposAreaNm1 : " + response.prposAreaNm1 + "</br>" +
						"prposAreaNm2 : " + response.prposAreaNm2 + "</br>" +
						"prposDstrcNm1 : " + response.prposDstrcNm1 + "</br>" +
						"prposDstrcNm2 : " + response.prposDstrcNm2 + "</br>" +
						"pblntfPclnd : " + response.pblntfPclnd + "</br>";
					}
					else{
						document.getElementById('building-info-content').innerHTML +=
						"ERROR : no gongsijiga data";
					}
				}
				else{
					document.getElementById('building-info-content').innerHTML +=
					"ERROR : no building data";
				}
			}
			else{
				document.getElementById('develop-result').innerHTML = 	
				"location : " + response.location + "</br>" +
				"jiyukCdNm : " + response.jiyukCdNm + "</br>" +
				"ERROR : " + response.errormsg;
			}

			
        },
    });

}
daum.maps.event.addListener(map, 'click', function(mouseEvent) {        
	
	// 클릭한 위도, 경도 정보를 가져옵니다 
	var latlng = mouseEvent.latLng;
	
	var addr_result_div = document.getElementById('addr-result'); 
	
	var jibun;
	var allow_y;
	var temp_y;

	searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
		if (status === daum.maps.services.Status.OK) {
			//var addrdiv = document.createElement("div");
			//addrdiv.id = "addrinfo";
			jibun = result[0].address.address_name;
			addr_result_div.innerHTML = jibun;
			console.log("지번 주소 : " + result[0].address.address_name);
			console.log(addr_result_div);
			//addr_result_div.appendChild(addrdiv);
			//var detailAddr = '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
			$('input#user_jibun').val(jibun); 
			console.log("first here");

			var locdata = $("#sendloc").serialize();

			
			$.ajax({
		        url:'/bmap/',
				type:'POST',
				data : locdata,
				success : function(response){
					document.getElementById('develop-info').style.display = "block";
					document.getElementById('develop-display-box').style.display = "block";
					document.getElementById('building-info').style.display = "block";
					if (response.errormsg != "no xml struct data"){
						document.getElementById('develop-result').innerHTML = 
						"location : " + response.location + "</br>" +
						"guyukCdNm : " + response.guyukCdNm + "</br>" +
						"jimokCdNm : " + response.jimokCdNm + "</br>" +
						"jiyukCdNm : " + response.jiyukCdNm + "</br>" +
						"jiguCdNm : " + response.jiguCdNm + "</br>" +
						"mainPurpsCdNm : " + response.mainPurpsCdNm + "</br>" +
						"archGbCd : " + response.archGbCd + "</br>" +
						"useAprDay : " + response.useAprDay + "</br>" +
						"건폐율 : " + response.gun + "</br>" +
						"용적률 : " + response.yong + "</br>";
						/*"현재 건폐율 : " + response.real_gun + "</br>" +
						"현재 용적률 : " + response.real_yong + "</br>" +
						"대지면적 : " + response.platArea;
						*/

						var allow_y = response.yong/100 * response.platArea;
						var temp_y = response.real_yong/100 * response.platArea;
						console.log(allow_y);
						console.log(temp_y);
						

						var wdth = getwidth(allow_y, temp_y);
						var diff = allow_y - temp_y;

						document.getElementById('temp').style.width = wdth[0]+"px";
						document.getElementById('allow').style.width = wdth[1]+"px";
						document.getElementById('temp').innerHTML = "<b>"+(temp_y+'').split(".")[0]+"m<sup>2</sup></b>";
						document.getElementById('allow').innerHTML = "<b>"+(allow_y+'').split(".")[0]+"m<sup>2</sup></b>";
						document.getElementById('diff-display').innerHTML = (diff+'').split(".")[0]+"m<sup>2</sup>";
						document.getElementById('diff').style.left = (wdth[0]+6)+"px";
						document.getElementById('diff').style.width = (wdth[1]-wdth[0])+"px";

			

						if (response.errormsg != "no xml dong data"){
							document.getElementById('building-info-content').innerHTML = 
							"mainPurpsCdNm : " + response.mainPurpsCdNm + "</br>" +
							"strctCdNm : " + response.strctCdNm + "</br>" +
							"bldNm : " + response.bldNm + "</br>" +
							"hhldCnt : " + response.hhldCnt + "</br>" +
							"fmlyCnt : " + response.fmlyCnt + "</br>" +
							"hoCnt : " + response.hoCnt + "</br>" +
							"archArea : " + response.archArea + "</br>";

							if (response.errormsg != "no xml gongsijiga data"){
								document.getElementById('building-info-content').innerHTML +=
								"lndcgrCodeNm : " + response.lndcgrCodeNm + "</br>" +
								"prposAreaNm1 : " + response.prposAreaNm1 + "</br>" +
								"prposAreaNm2 : " + response.prposAreaNm2 + "</br>" +
								"prposDstrcNm1 : " + response.prposDstrcNm1 + "</br>" +
								"prposDstrcNm2 : " + response.prposDstrcNm2 + "</br>" +
								"pblntfPclnd : " + response.pblntfPclnd + "</br>";
							}
							else{
								document.getElementById('building-info-content').innerHTML +=
								"ERROR : no gongsijiga data";
							}
						}
						else{
							document.getElementById('building-info-content').innerHTML +=
							"ERROR : no building data";
						}
					}
					else{
						document.getElementById('develop-result').innerHTML = 	
						"location : " + response.location + "</br>" +
						"jiyukCdNm : " + response.jiyukCdNm + "</br>" +
						"ERROR : " + response.errormsg;
					}

					
		        },
		    });
		}
	});




	function getCookie(name) {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
		  	for (var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
			 	break;
				}
		  	}
		}
		return cookieValue;
	}

	function csrfSafeMethod(method) {
		// these HTTP methods do not require CSRF protection
		return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
	}

	var csrftoken = getCookie('csrftoken');
	//$.post("/bmap/",{csrfmiddlewaretoken: getCookie('csrftoken'),location : jibun});

	//document.getElementById("user_jibun").value = jibun;
	
	


});

function getwidth(allow_y, temp_y){
	var day, dty;
	if(allow_y>10000){
		day = allow_y/50;
		dty = temp_y/50;
	}
	else if(allow_y>5000){
		console.log("second part");
		day = allow_y/30;
		dty = temp_y/30;
	}
	else{
		day = allow_y/15;
		dty = temp_y/15;
	}
	return [dty,day];
}
function searchDetailAddrFromCoords(coords, callback) {
	// 좌표로 법정동 상세 주소 정보를 요청합니다
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}


