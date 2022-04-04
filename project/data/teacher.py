import random
import names
import hashlib

with open("data_teacher.csv", "w") as f:
    for i in range(1001, 1051):
        e = [i]
        e.append(names.get_first_name())
        e.append(names.get_last_name())
        dt = "{}/{}/{}".format(f"{random.randint(1,28)}", f"{random.randint(1,12):02}", random.randint(1960,1990))
        e.append(dt)
        e.append(e[1][:5]+str(random.randint(100,999)))
        pswd = hashlib.md5((e[1]+e[3]).encode()).hexdigest()
        e.append(pswd)
        e = ['\''+str(x)+'\'' for x in e]
        f.write(", ".join(map(str, e)))
        f.write('\n')

with open("data_student.csv", "w") as f:
    for i in range(20001, 20999):
        e = [i]
        e.append(names.get_first_name())
        e.append(names.get_last_name())
        dt = "{}/{}/{}".format(f"{random.randint(1,28)}", f"{random.randint(1,12):02}", random.randint(1995,2003))
        e.append(dt)
        e.append(e[1][:5]+e[2][:5]+str(random.randint(1000,9999)))
        pswd = hashlib.md5((e[1]+e[3]).encode()).hexdigest()
        e.append(pswd)
        e.append(random.randint(0,3))
        e.append(random.randint(1,100))
        e.append(random.randint(1001,1050))
        e = ['\''+str(x)+'\'' for x in e]
        f.write(", ".join(map(str, e)))
        f.write('\n')

clgs = []
with open('clg.csv', 'r') as f:
    for line in f.readlines():
        clgs.append([x.strip() for x in line.split(',')])

with open('data_institute.csv', 'w') as f:
    i=1
    for c in clgs:
        e = [i, c[0],c[2]]
        i+=1
        e = ['\''+str(x)+'\'' for x in e]
        f.write(", ".join(map(str, e)))
        f.write('\n')


        

