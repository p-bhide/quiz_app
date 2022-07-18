from django.urls import path
from .views import QuizListView, QuizDetailView, quiz_data, save_quiz, update_session

app_name = 'quizes'

urlpatterns = [
    path('', QuizListView.as_view(), name='home'),
    path('<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('<int:pk>/data/', quiz_data, name='quiz-detail-data'),
    path('<int:pk>/save/', save_quiz, name='quiz-detail-save'),
    path('update_session/', update_session, name='update_session'),
]