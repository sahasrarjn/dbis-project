import random
types = [
    [0, "State", 30, 2],
    [1, "Educational", 60, 3],
    [2, "Standard", 90, 4],
    [3, "National", 120, 6]
]
with open("data_exam_type.csv", "w") as f:

    for e in types:
        f.write("\'%d\',\'%s\',\'%d\',\'%d\'\n" % (e[0], e[1], e[2], e[3]))

ques = [[] for _ in range(100)]
with open("data_exam.csv", "w") as f:
    for i in range(100):
        e = [i+40000]
        t = random.randint(0,3)
        e.append(types[t][1]+str(random.randint(1000,9999)))
        ques[i] = random.sample(range(1,448), types[t][3])
        e.append(str(random.randint(2015,2021)))
        e.append(t)
        e.append(random.randint(1001,1050))
        e = ['\''+str(x)+'\'' for x in e]
        f.write(", ".join(e))
        f.write('\n')

with open("data_exam_question.csv", "w") as f:
    c=1
    for i in range(100):
        for q in ques[i]:
            f.write("\'%d\',\'%d\',\'%d\'\n" % (c,i+40000, q))
            c+=1

def gettime(sid, qid):
    diff = 5*(qid%11)
    clg = 1+(sid%100)
    p = (diff+clg)/2
    
    y = 16.0*p/149 + 886.0/149 + random.randint(-1,1)
    return round(y)

def getmarks(sid):
    x = 1+(sid%100)
    p = 4.0*x/495 + 91.0/990
    q = random.random()
    if q<p:
        return 0
    return 1
with open("data_student_exam_ques_stat.csv", "w") as f:
    c=1
    for exam in range(100):
        e = exam+40000
        studs = random.sample(range(20001,20999), random.randint(100,300))
        for s in studs:
            for q in ques[exam]:

                rec = [c, s, q, e]
                c+=1
                rec.append(getmarks(s))
                rec.append(gettime(s,q))
                rec.append(100*random.randint(10,20))
                rec.append(random.randint(1,10))
                rec = ['\''+str(x)+'\'' for x in rec]
                f.write(", ".join(map(str, rec)))
                f.write('\n')


