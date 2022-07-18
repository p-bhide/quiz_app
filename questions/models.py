from django.db import models
from quizes.models import Quiz
# Create your models here.

class Question(models.Model):
    text = models.CharField(max_length=150)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.text}'

    def get_answers(self):
        return  self.answer_set.all()
        '''
        with related name :
        return  self.answers.all()
        '''


class Answer(models.Model):
    text = models.CharField(max_length=150)
    correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    '''
    with related name :
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    '''
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Question - {self.question}. Answer - {self.text}. Correct - {self.correct}'
