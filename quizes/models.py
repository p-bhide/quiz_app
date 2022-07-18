from pyexpat import model
from statistics import mode
from tabnanny import verbose
from django.db import models
from django.urls import reverse
import random

# Create your models here.

DIFFICULTY = (
    ('easy', 'easy'),
    ('medium', 'medium'),
    ('hard', 'hard')
)

class Quiz(models.Model):
    name = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    number_of_questions = models.PositiveIntegerField()
    time = models.IntegerField(help_text="Quiz duration in minutes")
    passing_score = models.PositiveIntegerField(help_text="Minimum required % to pass")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY)

    class Meta:
        verbose_name_plural = 'Quizes'

    def __str__(self):
        return f"{self.name} - {self.topic}"

    def get_questions(self):
        questions = list(self.question_set.all())
        random.shuffle(questions)
        return questions[:self.number_of_questions]

    def get_absolute_url(self):
        return reverse("quizes:quiz-detail", kwargs={"pk": self.pk})
    