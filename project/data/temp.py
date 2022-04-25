import random
import os
random.seed(0)

i = 1
t = 0
c=1
tags = []
record = [[] for _ in range(15)]
def getdiff(qid):
    t = qid%11
    return t*100 + 1000
with open ("questions.csv", "r") as f:
    for line in f.readlines():
        l = [x.strip() for x in line.split(',')]
        l[1] = ", ".join(l[1:])
        l[1] = l[1].replace("\'", " ")
        l[1] = l[1].replace("\"", " ")
        l[1] = l[1].replace(",", " ")
        l = l[:2]
        if l[0] not in tags:
            tags.append(l[0])
            c=1
            t+=1

        elem = [i]
        i+=1
        elem.append(l[1])
        elem.append(getdiff(i-1))
        elem.append("./sol/{}/{}.cpp".format(t if t>9 else "0"+str(t), c if c>9 else "0"+str(c)))
        os.system("mkdir -p ./testcases/{}".format(t if t>9 else "0"+str(t)))
        os.system("mkdir -p ./testcases/{}/{}".format(t if t>9 else "0"+str(t),c if c>9 else "0"+str(c)))
        nl = random.randint(5,10)
        
        no = [random.randint(1,5) for _ in range(nl)]
        
        for tc in range(5):
            tcd = [[] for _ in range(nl)]
            for j in range(nl):
                for p in range(no[j]):
                    tcd[j].append(random.randint(1,100))
            #os.system("touch )
            with open("./testcases/{}/{}/{}.txt".format(t if t>9 else "0"+str(t),c if c>9 else "0"+str(c), tc), "w") as f:
                for j in tcd:
                    f.write(" ".join(map(str,j)))
                    f.write("\n")
        elem.append("./testcases/{}/{}/".format(t if t>9 else "0"+str(t), c if c>9 else "0"+str(c)))
        elem.append("public")
        elem.append(random.randint(1001,1050))
        record[t-1].append(elem)
        c+=1



with open ("data_question.csv", "w") as f:
    for r in record:
        for e in r:
            e = ['\''+str(x)+'\'' for x in e]
            f.write(", ".join(map(str, e)))
            f.write('\n')

with open("tag.txt", "w") as f:
    for i in range(len(record)):
        for e in record[i]:
           # print(e)

            f.write("\'{}\',\'{}\'\n".format(e[0], i))
        


        