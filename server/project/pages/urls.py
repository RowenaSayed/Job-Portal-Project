from django.urls import path
from . import views
from . import views
from .models import *
urlpatterns= [
path('Employer',views.register,name='Employer'),
path('logout',views.logout,name='logout'),
path('emp_profile',views.profile,name='profile'),
path('edit/profile',views.edit_profile,name='edit/profile'),
path('post-job',views.add_Job,name='post-job'),
path('jobs',views.jobs,name='jobs'),
path('job-details/<str:pk>/', views.job_details,name='job-details'),
path('update-job/<str:pk>/', views.update_job,name='update-job'), 
path('delete-job/<str:pk>/', views.delete_job,name='delete-job'),
path('reset_password', views.reset_password,name='reset_password'),
# =======================================================================================================
path('app_for_jobs',views.app_for_jobs,name='apapp_for_jobs'),
path('all_apps',views.all_app,name='all_apps'),
path('app/<str:pk>/',views.app,name='app'),
path('delete-app/<str:pk>/', views.delete_app,name='delete-app'),
path('application/<int:pk>/update-status/', views.update_application_status, name='update_application_status'),
path('job/<int:job_id>/applications/', views.list_application_by_status, name='list_applications'),
path('job/<int:job_id>/applications/<str:state>/', views.list_application_by_status, name='list_applications_by_status'),
]