from django.db import models

class Product(models.Model):
	id = models.AutoField(primary_key=True)
	build_type = models.CharField(max_length=50)
	address = models.CharField(max_length=1000)
	nanbang = models.CharField(max_length=50)
	elevator = models.IntegerField(default=0)
	deposit = models.CharField(max_length=50)
	rent = models.IntegerField(default=0)
	premium = models.CharField(max_length=50)
	parking = models.CharField(max_length=50)
	maintenance = models.IntegerField(default=0)
	toilet_place = models.CharField(max_length=50)
	toilet_sex = models.CharField(max_length=50)
	floor = models.CharField(max_length=50)
	area_g = models.IntegerField(default=0)
	area_j = models.IntegerField(default=0)
	move_day = models.CharField(max_length=100)
	business = models.CharField(max_length=200)
	completion = models.CharField(max_length=50, blank=True)
	comment = models.CharField(max_length=200, blank=True)
	rank = models.IntegerField(default=0)

	def __str__(self):
		return str(self.id) + "__" + self.address
class AreaManager(models.Manager):
	def create_area(self, address):
		area = self.create(address = address, rank = 1)
		return area

class Area(models.Model):
	id = models.AutoField(primary_key=True)
	address = models.CharField(max_length=1000)
	rank = models.IntegerField(default=0)
	objects = AreaManager() 

