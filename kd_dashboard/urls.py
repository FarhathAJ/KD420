from django.contrib import admin
from django.urls import path , include
from kd_dashboard import views

urlpatterns = [
    path('dashboard/<str:station_name>', views.main_page),
    path('ajax/<str:station_name>', views.ajax_call),
   ]
