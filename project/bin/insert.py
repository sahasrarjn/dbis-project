import os
import sys

order = [
    'institute', #
    'language', #
    'template', #
    'template_language', #
    'tags', #
    'tag_child', #
    'teacher', #
    'student', #
    'question', #
    'question_tags', #
    'exam_type', #
    'exam', #
    'exam_question', #
    'student_exam_ques_stat' #
]

for t in order:
    with open('./data/data_{}.csv'.format(t), 'r') as f:
        print('SET datestyle = dmy;\n')
        for l in f.readlines():
            print("INSERT INTO {} VALUES ({});\n".format(t, l.strip()))