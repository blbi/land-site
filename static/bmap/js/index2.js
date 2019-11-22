	
var container = document.getElementById('map');
var options = {
	center: new daum.maps.LatLng(37.498265, 127.027638),
	level: 2
};

var map = new daum.maps.Map(container, options);
var geocoder = new daum.maps.services.Geocoder();
var info_list = new Object();

map.addOverlayMapTypeId(daum.maps.MapTypeId.USE_DISTRICT);    

//map.removeOverlayMapTypeId(daum.maps.MapTypeId.TERRAIN);  

var pin_marker = new daum.maps.Marker({
	map: map
});


function searchInputAddr(){
	var addrInputData = $("#sendsearch").serialize();

	var addr_result_div = document.getElementById('addr-result');
	var search_box_input_addr = $('input#search-box-input').val(); 
	addr_result_div.innerHTML = search_box_input_addr;

	geocoder.addressSearch(search_box_input_addr, function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === daum.maps.services.Status.OK) {

        var coords = new daum.maps.LatLng(result[0].y, result[0].x);
        map.panTo(coords);

        pin_marker.setPosition(coords);
    } 
	});    

	




	$.ajax({
        url:'/bmap/',
		type:'POST',
		data : addrInputData,
		success : function(response){
			document.getElementById('develop-info').style.display = "block";
			document.getElementById('develop-display-box').style.display = "block";
			document.getElementById('building-info').style.display = "block";
			document.getElementById('rank-box').style.display = "block";
			
			document.getElementById('rank-box').innerHTML = set_rank(response.rank);
			console.log("here");

			
			info_list = response;
			console.log(info_list);



			if (response.errormsg != "no xml struct data"){
					document.getElementById('develop-result').innerHTML = 
					"<div class='base-info-type'>지역</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.jiyukCdNm) + "</div>" +
					"<div class='base-info-type'>구역</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.guyukCdNm) + "</div>" +
					"<div class='base-info-type'>지구</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.jiguCdNm) + "</div>" +
					"<div class='base-info-type'>주용도</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.mainPurpsCdNm) + "</div>" +
					"<div class='base-info-type'>건폐율</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.real_gun) + "</div>" +
					"<div class='base-info-type'>용적률</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.real_yong) + "</div>" +
					"<div class='base-info-type'>사용승인일</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.useAprDay) + "</div>" +
					"<div class='base-info-type'>건축구분</div>" +
					"<div class='base-info-value'>" + replace_undefine(response.archGbCd) + "</div>";
			/*		
				document.getElementById('develop-result').innerHTML = 
				"위치 : " + replace_undefine(response.location) + "</br>" +
				"구역 : " + replace_undefine(response.guyukCdNm) + "</br>" +
				"지목 : " + replace_undefine(response.jimokCdNm) + "</br>" +
				"지역 : " + replace_undefine(response.jiyukCdNm) + "</br>" +
				"지구 : " + replace_undefine(response.jiguCdNm) + "</br>" +
				"주용도 : " + replace_undefine(response.mainPurpsCdNm) + "</br>" +
				"건축구분 : " + replace_undefine(response.archGbCd) + "</br>" +
				"사용승인일 : " + replace_undefine(response.useAprDay) + "</br>" +
				"건폐율 : " + replace_undefine(response.gun) + "</br>" +
				"용적률 : " + replace_undefine(response.yong) + "</br>";
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
				if (diff < 0){
					document.getElementById('diff').style.display = "none";
				}
				else{
					document.getElementById('diff').style.display = "block";
					document.getElementById('diff-display').innerHTML = (diff+'').split(".")[0]+"m<sup>2</sup>";
					document.getElementById('diff').style.left = (wdth[0]+6)+"px";
					document.getElementById('diff').style.width = (wdth[1]-wdth[0])+"px";							
				}


				if (response.errormsg != "no xml dong data"){
					document.getElementById('building-info-content').innerHTML = 
					"주용도 : " + replace_undefine(response.mainPurpsCdNm) + "</br>" +
					"구조 : " + replace_undefine(response.strctCdNm) + "</br>" +
					"건물명 : " + replace_undefine(response.bldNm) + "</br>" +
					"세대수 : " + replace_undefine(response.hhldCnt) + "</br>" +
					"가구수 : " + replace_undefine(response.fmlyCnt) + "</br>" +
					"호수 : " + replace_undefine(response.hoCnt) + "</br>" +
					"건축면적 : " + replace_undefine(response.archArea) + "</br>";

					if (response.errormsg != "no xml gongsijiga data"){
						document.getElementById('building-info-content').innerHTML +=
						"지목 : " + replace_undefine(response.lndcgrCodeNm) + "</br>" +
						"용도지역명1 : " + replace_undefine(response.prposAreaNm1) + "</br>" +
						"용도지역명2 : " + replace_undefine(response.prposAreaNm2) + "</br>" +
						"용도지구명1 : " + replace_undefine(response.prposDstrcNm1) + "</br>" +
						"용도지구명2 : " + replace_undefine(response.prposDstrcNm2) + "</br>" +
						"공시지가 : " + replace_undefine(response.pblntfPclnd) + "</br>";
					}
					else{
						document.getElementById('building-info-content').innerHTML +=
						"ERROR : 공시지가 데이터 오류";
					}
				}
				else{
					document.getElementById('building-info-content').innerHTML +=
					"ERROR : 건축물 데이터 오류";
				}
			}
			else{
				document.getElementById('develop-result').innerHTML = 	
				"위치 : " + response.location + "</br>" +
				"지역 : " + response.jiyukCdNm + "</br>" +
				"ERROR : 건축인허가 데이터 오류";
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

			//var coords = new daum.maps.LatLng(mouseEvent.latLng);
			map.panTo(latlng);
			pin_marker.setPosition(latlng);


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
					document.getElementById('rank-box').style.display = "block";
					console.log(response.rank);
					document.getElementById('rank-box').innerHTML = set_rank(response.rank);
					
					
					info_list = response;


					if (response.errormsg != "no xml struct data"){
						document.getElementById('develop-result').innerHTML = 
						"<div class='base-info-type'>지역</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.jiyukCdNm) + "</div>" +
						"<div class='base-info-type'>구역</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.guyukCdNm) + "</div>" +
						"<div class='base-info-type'>지구</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.jiguCdNm) + "</div>" +
						"<div class='base-info-type'>주용도</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.mainPurpsCdNm) + "</div>" +
						"<div class='base-info-type'>건폐율</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.real_gun) + "</div>" +
						"<div class='base-info-type'>용적률</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.real_yong) + "</div>" +
						"<div class='base-info-type'>사용승인일</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.useAprDay) + "</div>" +
						"<div class='base-info-type'>건축구분</div>" +
						"<div class='base-info-value'>" + replace_undefine(response.archGbCd) + "</div>";
/*
						"위치 : " + replace_undefine(response.location) + "</br>" +
						"구역 : " + replace_undefine(response.guyukCdNm) + "</br>" +
						"지목 : " + replace_undefine(response.jimokCdNm) + "</br>" +
						"지역 : " + replace_undefine(response.jiyukCdNm) + "</br>" +
						"지구 : " + replace_undefine(response.jiguCdNm) + "</br>" +
						"주용도 : " + replace_undefine(response.mainPurpsCdNm) + "</br>" +
						"건축구분 : " + replace_undefine(response.archGbCd) + "</br>" +
						"사용승인일 : " + replace_undefine(response.useAprDay) + "</br>" +
						"건폐율 : " + replace_undefine(response.gun) + "</br>" +
						"용적률 : " + replace_undefine(response.yong) + "</br>";
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
						if (diff < 0){
							document.getElementById('diff').style.display = "none";
						}
						else{
							document.getElementById('diff').style.display = "block";
							document.getElementById('diff-display').innerHTML = (diff+'').split(".")[0]+"m<sup>2</sup>";
							document.getElementById('diff').style.left = (wdth[0]+6)+"px";
							document.getElementById('diff').style.width = (wdth[1]-wdth[0])+"px";							
						}

			

						if (response.errormsg != "no xml dong data"){
							document.getElementById('building-info-content').innerHTML = 
							"mainPurpsCdNm : " + replace_undefine(response.mainPurpsCdNm) + "</br>" +
							"strctCdNm : " + replace_undefine(response.strctCdNm) + "</br>" +
							"bldNm : " + replace_undefine(response.bldNm) + "</br>" +
							"hhldCnt : " + replace_undefine(response.hhldCnt) + "</br>" +
							"fmlyCnt : " + replace_undefine(response.fmlyCnt) + "</br>" +
							"hoCnt : " + replace_undefine(response.hoCnt) + "</br>" +
							"archArea : " + replace_undefine(response.archArea) + "</br>";

							if (response.errormsg != "no xml gongsijiga data"){
								document.getElementById('building-info-content').innerHTML +=
								"lndcgrCodeNm : " + replace_undefine(response.lndcgrCodeNm) + "</br>" +
								"prposAreaNm1 : " + replace_undefine(response.prposAreaNm1) + "</br>" +
								"prposAreaNm2 : " + replace_undefine(response.prposAreaNm2) + "</br>" +
								"prposDstrcNm1 : " + replace_undefine(response.prposDstrcNm1) + "</br>" +
								"prposDstrcNm2 : " + replace_undefine(response.prposDstrcNm2) + "</br>" +
								"pblntfPclnd : " + replace_undefine(response.pblntfPclnd) + "</br>";
							}
							else{
								document.getElementById('building-info-content').innerHTML +=
								"ERROR : 공시지가 데이터 오류";
							}
						}
						else{
							document.getElementById('building-info-content').innerHTML +=
							"ERROR : 건축물 데이터 오류";
						}
					}
					else{
						document.getElementById('develop-result').innerHTML = 	
						"위치 : " + response.location + "</br>" +
						"지역 : " + response.jiyukCdNm + "</br>" +
						"ERROR : 건축인허가 데이터 오류";
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

function set_rank(rank){
	if (rank<5){
		return "E"
	}
	else if(rank<10){
		return "D"
	}
	else if(rank<15){
		return "C"
	}
	else if(rank<20){
		return "B"
	}
	else{
		return "A"
	}
}

function replace_undefine(str){
	if(str === undefined){
		return "해당없음"
	}
	return str
}

function show_building_info(){
	document.getElementById('detail-info-table').style.display = "block";
	document.getElementById('detail-area-info').innerHTML =
	"<div class='info-category'>구역</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.guyukCdNm) + "</div>" +
	"<div class='info-category'>지목</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.jimokCdNm) + "</div>" +
	"<div class='info-category'>지구</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.jiguCdNm) + "</div>" +
	"<div class='info-category'>주용도</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.mainPurpsCdNm_std) + "</div>" +
	"<div class='info-category'>지역</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.jiyukCdNm) + "</div>" +
	"<div class='info-category'>건폐율</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.gun) + "</div>" +
	"<div class='info-category'>용적률</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.yong) + "</div>" +
	"<div class='info-category'>토지면적</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.platArea) + "</div>";

	document.getElementById('detail-building-info').innerHTML =
	"<div class='info-category'>건물명</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.bldNm) + "</div>" +
	"<div class='info-category'>사용승인일</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.useAprDay) + "</div>" +
	"<div class='info-category'>주용도</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.mainPurpsCdNm_dong) + "</div>" +
	"<div class='info-category'>건축 구분</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.archGbCd) + "</div>" +
	"<div class='info-category'>세대수</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.hhldCnt) + "</div>" +
	"<div class='info-category'>가구수</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.fmlyCnt) + "</div>" +
	"<div class='info-category'>건폐율</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.real_gun) + "</div>" +
	"<div class='info-category'>용적률</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.real_yong) + "</div>" +
	"<div class='info-category'>건축면적</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.archArea) + "</div>";

	document.getElementById('detail-price-info').innerHTML = 
	"<div class='info-category'>용도지역명1</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.prposAreaNm1) + "</div>" +	
	"<div class='info-category'>용도지역명2</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.prposAreaNm2) + "</div>" +
	"<div class='info-category'>용도지구명1</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.prposDstrcNm1) + "</div>" +
	"<div class='info-category'>용도지구명2</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.prposDstrcNm2) + "</div>" +
	"<div class='info-category'>공시지가</div>" +
	"<div class='info-value'>" + replace_undefine(info_list.pblntfPclnd) + "</div>";
}

function hide_detail(){
	document.getElementById('detail-info-table').style.display="none";
}