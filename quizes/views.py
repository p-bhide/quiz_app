import imp
from urllib import request
from django.http import JsonResponse
from django.shortcuts import render
from .models import Quiz
from django.views.generic import ListView, DetailView
from django.db.models import Q
from questions.models import Question
from results.models import Result

# Create your views here.

class QuizListView(ListView):
    model = Quiz

    def get_queryset(self):
        q = self.request.GET.get('q') if self.request.GET.get('q') != None else ''
        qs = Quiz.objects.filter(Q(name__icontains=q) | Q(topic__icontains=q))
        return qs


class QuizDetailView(DetailView):
    model = Quiz


def quiz_data(self, pk):
    quiz = Quiz.objects.get(pk=pk)
    questions = []
    for q in quiz.get_questions():
        answers = []
        for a in q.get_answers():
            answers.append(a.text)
        questions.append({str(q):answers})

    return JsonResponse({
        'data':questions,
        'time':quiz.time,
    })

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

def save_quiz(request, pk):
    if is_ajax(request):
        questions = []
        data = request.POST
        data = data.dict()
        data.pop('csrfmiddlewaretoken')

        for k in data.keys():
            question = Question.objects.get(text=k)
            questions.append(question)

        user = request.session['name']
        quiz = Quiz.objects.get(pk=pk)

        score = 0
        results = []
        correct_answer = None
        
        for q in questions:
            selected_a = request.POST.get(q.text)
            correct_a = q.get_answers().get(correct=True).text
            if selected_a == correct_a:
                score += 1
            correct_answer = correct_a
            results.append( {str(q.text) : { 
                'correct' : correct_a,
                'selected' : selected_a,
             }})
        
        score = round((score/len(questions)*100),2)
        
        Result.objects.create(quiz=quiz, user=user, score=score )

        if score >= quiz.passing_score:
            return JsonResponse({'test':results, 'pass':True, 'score':score})
        else:
            return JsonResponse({'test':results, 'pass':False, 'score':score})


def update_session(request):
    request.session['name'] = request.POST.get('name')
    return JsonResponse({})