import os
import sys

# q1 = {}
# q2 = {}
l1 = []
l2 = []
# for i in range(100):
#     q1[i+40000] = []
#     q2[i+40000] = []

with open("data_exam_question.csv", "r") as f:
    for line in f:
        line = [x.strip('\'') for x in line.strip().split(',')]
        l1.append((int(line[1]), int(line[2])))

with open("data_student_exam_ques_stat.csv", "r") as f:
    for line in f:
        line = [x.strip().strip('\'') for x in line.strip().split(',')]
        # q2[int(line[3])].append(int(line[2]))
        c = l1.count((int(line[3]), int(line[2])))
        if c!=1:
            print((int(line[3]), int(line[2])))

# for i in range(100):
#     q2[i+40000] = list(set(q2[i+40000]))
#     if sorted(q1[i+40000]) != sorted(q2[i+40000]):
#         print(i+40000)
#         print(q1[i+40000])
#         print(q2[i+40000])
#         print()
