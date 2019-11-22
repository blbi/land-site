from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name="index"),
	path('test', views.test, name="test"),
	path('prod', views.prod, name="prod"),
	path('<int:product_id>/', views.detail, name='detail'),
	path('test2', views.test2, name="test2"),
]