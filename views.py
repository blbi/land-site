from django.shortcuts import render, HttpResponse, get_object_or_404
import simplejson as json
import urllib.request
import xml.etree.ElementTree as ET
import csv
from .models import *
# Create your views here.
#=====bjdong code data -> dictionary=====
codedic={}
with open('bmap/process/bjcodein.txt','r', encoding='utf8') as codef:
    for line in codef:
       (val, key) = line.split("\t")
       codedic[key[:-1]] = val

def index(request):

	if request.method == 'POST':
		location = request.POST.get('user_jibun',False)
		if not location:
			location = request.POST.get('search-box-input',False)
		
		try:
			area = Area.objects.get(address = location)
			rank = area.rank + 1
			area.rank = rank
			area.save()

			print("area update!!")

		except Area.DoesNotExist:
			Area.objects.create_area(location)
			rank = 1
			print("first area create!!")

		

		print(location)
		#=====define parameter(sigungu, bjdong, ji, bun) from user location===== 
		loc_ = " ".join(location.split(' ')[:3])
		print("loc_" , loc_)
		if '-' in location.split(' ')[-1]:
			(bun,ji) = (location.split(' ')[-1]).split('-')
		else:
			bun = location.split(' ')[-1]
			ji = ""

		bjd = codedic[loc_]
		bun=bun.rjust(4,'0')
		if ji != "":
			ji=ji.rjust(4,'0')

		#=====struct data api url=====
		url1 = 'http://apis.data.go.kr/1611000/ArchPmsService/getApBasisOulnInfo'
		url1 += "?serviceKey="
		url1 += "jPM83VRzyw4d9uZd0CijLOkS7P1QnKC5Y4FhY1OFQG%2FSxYPNY0HFyBlgBC7A%2BnrYuduM74f3KTERju5A0Fvrog%3D%3D&"
		url1 += "&sigunguCd="
		url1 += str(bjd[:5])
		url1 += "&bjdongCd="
		url1 += str(bjd[5:])
		url1 += "&platGbCd="
		url1 += ""
		url1 += "&bun="
		url1 += bun
		url1 += "&ji="
		url1 += ji
		url1 += "&numOfRows="
		url1 += "10"
		url1 += "&pageNo="
		url1 += "1"

		#=====dong data api url=====
		url2 = 'http://apis.data.go.kr/1611000/ArchPmsService/getApDongOulnInfo'
		url2 += "?serviceKey="
		url2 += "jPM83VRzyw4d9uZd0CijLOkS7P1QnKC5Y4FhY1OFQG%2FSxYPNY0HFyBlgBC7A%2BnrYuduM74f3KTERju5A0Fvrog%3D%3D&"
		url2 += "&sigunguCd="
		url2 += str(bjd[:5])
		url2 += "&bjdongCd="
		url2 += str(bjd[5:])
		url2 += "&platGbCd="
		url2 += ""
		url2 += "&bun="
		url2 += bun
		url2 += "&ji="
		url2 += ji
		url2 += "&numOfRows="
		url2 += "10"
		url2 += "&pageNo="
		url2 += "1"

		#====gongsijiga data api url========
		url3 = 'http://apis.data.go.kr/1611000/nsdi/ReferLandPriceService/attr/getReferLandPriceAttr'
		url3 += '?ServiceKey='
		url3 += 'jPM83VRzyw4d9uZd0CijLOkS7P1QnKC5Y4FhY1OFQG%2FSxYPNY0HFyBlgBC7A%2BnrYuduM74f3KTERju5A0Fvrog%3D%3D&'
		url3 += '&ldCode='
		url3 += str(bjd)
		url3 += '&stdrYear='
		url3 += '2015'
		url3 += '&format='
		url3 += 'xml'
		url3 += '&numOfRows='
		url3 += '10'
		url3 += '&pageNo='
		url3 += '1'



		
		print(str(bjd[:5]),"	",str(bjd[5:]),"	",bun,"	",ji)
		request = urllib.request.urlopen(url1)
		response = request.read()
		
		#=====parsing api result xml=====
		root = ET.fromstring(response)
		structdic = {}
		errormsg = ""
		try:
			for item in root.find("body").find("items").findall("item"):
				for el in item.iter():
					print("count here")
					structdic[el.tag] = el.text
				if structdic["archArea"] != "0":
					break
			print("=-=====================")
			for s in structdic:
				print(s,"	",structdic[s])
			print("=-=====================")

		########try except is not working, check and delete
		except:
			print("xml error-basic")
			print(url1)
			errormsg = "no xml struct data"
			context = {
				'location' : location, 
				'jiyukCdNm' : '', 
				'jiyukCd': '',
				'rank' : rank, 
				'errormsg' : errormsg
			}
			return HttpResponse(json.dumps(context), content_type="application/json")
		
		########handling error at here with if
		if structdic: 
			guyukCdNm = structdic['guyukCdNm']
			jimokCdNm = structdic['jimokCdNm']
			jiguCdNm = structdic['jiguCdNm']
			mainPurpsCdNm_std = structdic['mainPurpsCdNm']
			archGbCd = structdic['archGbCd']	#건축구분코드명
			useAprDay = structdic['useAprDay']	#사용승인일
			jiyukCdNm = structdic['jiyukCdNm']	#지역코드명
			real_gun = structdic['bcRat']	#실제 건폐율
			real_yong = structdic['vlRat']	#실제 용적률
			platArea = structdic['platArea']	#토지면적
			gu = location.split(' ')[1]
			gun=""
			yong=""	
		
		else:
			print("xml error-basic")
			print(url1)
			errormsg = "no xml struct data"
			context = {
				'location' : location, 
				'jiyukCdNm' : '', 
				'jiyukCd': '',
				'rank' : rank, 
				'errormsg' : errormsg
			}
			return HttpResponse(json.dumps(context), content_type="application/json")

#===========================================
	
		request = urllib.request.urlopen(url2)
		response = request.read()
		root_dong = ET.fromstring(response)
		dongdic = {}
		
		try:
			for el in root_dong.find("body").find("items").find("item").iter():
				dongdic[el.tag] = el.text
			for s in dongdic:
				print(s,"	",dongdic[s])

			mainPurpsCdNm_dong=dongdic['mainPurpsCdNm'] #주용도코드명
			strctCdNm=dongdic['strctCdNm']	#구조코드명
			bldNm=dongdic['bldNm']	#건물명
			hhldCnt=dongdic['hhldCnt']	#세대수
			fmlyCnt=dongdic['fmlyCnt']	#가구수
			hoCnt=dongdic['hoCnt']	#호수
			archArea=dongdic['archArea']	#건축면적

		except:
			print("xml error-dong")
			print(url2)
			mainPurpsCdNm_dong = ""
			strctCdNm = ""
			bldNm = ""
			hhldCnt = ""
			fmlyCnt = ""
			hoCnt = ""
			archArea = ""
			errormsg = "no xml dong data"
			

		
		
#==============================================
		request = urllib.request.urlopen(url3)
		response = request.read()
		root_dong = ET.fromstring(response)
		gongsidic = {}
		
		try:
			for el in root_dong.find("body").find("items").find("item").iter():
				gongsidic[el.tag] = el.text
			for s in gongsidic:
				print(s,"	",gongsidic[s])

			prposAreaNm1 = gongsidic['prposAreaNm1']	#용도지역명1
			prposAreaNm2 = gongsidic['prposAreaNm2']	#용도지역명2
			prposDstrcNm1 = gongsidic['prposDstrcNm1']	#용도지구명1
			prposDstrcNm2 = gongsidic['prposDstrcNm2']	#용도지구명2
			pblntfPclnd = gongsidic['pblntfPclnd']	#공시지가

		except:
			print("xml error-gongsijiga")
			print(url3)
			prposAreaNm1 = ""
			prposAreaNm2 = ""
			prposDstrcNm1 = ""
			prposDstrcNm2 = ""
			pblntfPclnd = ""
			errormsg = "no xml gongsijiga data"
			
		
		


		#지자체조례 파일 파싱
		f = open('C:/Users/sskk1/mysite/bmap/process/data2_1.csv', 'r', encoding='cp949')
		reader = csv.reader(f)
		print("gu : ",gu)
		for line in reader:
			#print(line[0])

			if gu in line[0]:
				print("here find matching gu!!!")
				if "전용주거" in jiyukCdNm:
					if "제1종" in jiyukCdNm:
						gun = line[1]
						yong = line[2]
					elif "제2종" in jiyukCdNm:
						gun = line[3]
						yong = line[4]
					else:
						errormsg = "no jiyuk code name"

				elif "일반주거" in jiyukCdNm:
					if "제1종" in jiyukCdNm:
						gun = line[5]
						yong = line[6]
					elif "제2종" in jiyukCdNm:
						gun = line[7]
						yong = line[8]
					elif "제3종" in jiyukCdNm:
						gun = line[9]
						yong = line[10]
					else:
						errormsg = "no jiyuk code name"

				elif "준주거" in jiyukCdNm:
					gun = line[11]
					yong = line[12]

				elif "중심상업" in jiyukCdNm:
					gun = line[13]
					yong = line[14]

				elif "일반상업" in jiyukCdNm:
					gun = line[15]
					yong = line[16]

				elif "근린상업" in jiyukCdNm:
					gun = line[17]
					yong = line[18]

				elif "유통상업" in jiyukCdNm: 					
					gun = line[19]
					yong = line[20]

				elif "전용공업" in jiyukCdNm:
					gun = line[21]
					yong = line[22]

				elif "일반공업" in jiyukCdNm:
					gun = line[23]
					yong = line[24]

				elif "준공업" in jiyukCdNm: 					
					gun = line[25]
					yong = line[26]

				else:
					errormsg = "no jiyuk code name"

				break
		
		context = {
			'guyukCdNm' : guyukCdNm,
			'jimokCdNm' : jimokCdNm,
			'jiguCdNm' : jiguCdNm,
			'mainPurpsCdNm_std' : mainPurpsCdNm_std,
			'location' : location, 
			'jiyukCdNm' : jiyukCdNm, 
			'gun' : gun,
			'yong' : yong,
			'real_gun' : real_gun,
			'real_yong' : real_yong,
			'platArea' : platArea,
			'useAprDay' : useAprDay,
			'mainPurpsCdNm_dong' : mainPurpsCdNm_dong,
			'strctCdNm' : strctCdNm,
			'bldNm' : bldNm,
			'hhldCnt' : hhldCnt,
			'fmlyCnt' : fmlyCnt,
			'hoCnt' : hoCnt,
			'archArea' : archArea,
			'prposAreaNm1' : prposAreaNm1,
			'prposAreaNm2' : prposAreaNm2,
			'prposDstrcNm1' : prposDstrcNm1,
			'prposDstrcNm2' : prposDstrcNm2,
			'pblntfPcln' : pblntfPclnd,
			'rank' : rank,
			'errormsg' : errormsg
		}


				#====녹지지역, 관리지역 미설정====


		#f = open('data.csv', 'r', encoding='cp949')
		#reader = csv.reader(f)
		#for line in reader:
		#    print(line)
		#f.close() 

		#용적률과 structdic의 용적률 비교
		#비교한 데이터 context에 채워넣기

		#context에 structdic 값 채워넣기
#===============================================


		return HttpResponse(json.dumps(context), content_type="application/json")
	else:
		return render(request, 'bmap/index.html')

def prod(request):

	prod_list = Product.objects.all()
	context = {'prod_list' : prod_list}

	if request.method == 'POST':
		business = request.POST.get("store-type")
		prod_area = request.POST.get("area")
		product_address = request.POST.get("search-box-input",False)

		if business != "default":
			prod_list = Product.objects.filter(business__contains=business)
		if prod_area != "0":
			prod_list = prod_list.filter(area_j__gt=(int(prod_area)-10), area_j__lt=(int(prod_area)+10))
		if product_address:
			prod_list = prod_list.filter(address__contains=product_address)

		prod = Product.objects.filter(address = product_address)
		if prod:
			for p in prod:
				p.rank = p.rank + 1
				p.save()
				print("[*] product rank update")
		context = {'prod_list' : prod_list}
	
		
	return render(request, 'bmap/prod.html', context)


def detail(request, product_id):
	product = get_object_or_404(Product, pk=product_id)

	context = {
		'id' : product.id,
		'build_type' : product.build_type,
		'address' : product.address,
		'nanbang' : product.nanbang,
		'elevator' : product.elevator,
		'deposit' : product.deposit,
		'rent' : product.rent,
		'premium' : product.premium,
		'parking' : product.parking,
		'maintenance' : product.maintenance,
		'toilet_place' : product.toilet_place,
		'toilet_sex' : product.toilet_sex,
		'floor' : product.floor,
		'area_g' : product.area_g,
		'area_j' : product.area_j,
		'move_day' : product.move_day,
		'business' : product.business,
		'completion' : product.completion,
		'comment' : product.comment
	}
	return render(request, 'bmap/detail.html', context)


def test(request):
	location = 'testlocation'
	context={'location' : location}
	return render(request, 'bmap/test.html',context)


def test2(request):
	return render(request, 'bmap/test2.html')

