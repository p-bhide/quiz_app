from django.shortcuts import render
from .models import Result
from django.views.generic import ListView
# Create your views here.

class ResultView(ListView):
    model = Result
    ordering = ['-score']
    paginate_by = 10