
from django.urls import path,include
from . import views

urlpatterns = [
    path('register/', views.register,name='register'),
    path('userinformation/', views.current_user,name='userinformation'), 
    path('profile/', views.get_update_profile, name='user_profile'),
    path('education/', views.add_education, name='add_education'),
    path('education/<int:pk>/', views.update_delete_education, name='update_delete_education'),
    path('Jobs/<int:job_id>/apply/', views.apply_for_job, name='apply-for-job'),
     path('allJobs', views.jobs, name='alljobs'),
# Add this to your urlpatterns list
   path('logout/', views.logout,name='logout'),
   path('my-applications/', views.my_applications, name='my_applications'),
    path('my-applications/<str:state>/', views.my_applications_by_status, name='my_applications_by_status'),
    path('application/<int:pk>/', views.application_detail, name='application_detail'),
    
]
