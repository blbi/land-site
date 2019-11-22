
from bmap.models import *
prod_list = Product.objects.all()
for prod in prod_list:
	if "평" in prod.area_g:
		prod.area_g=prod.area_g[:-1]
	if "평" in prod.area_j:
		prod.area_j=prod.area_j[:-1]
	prod.save()
		