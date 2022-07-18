from django.urls import path
from .views import ResultView

app_name = 'results'

urlpatterns = [
    path('', ResultView.as_view(), name='res'),
    
]