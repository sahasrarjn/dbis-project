import random



with open("data_template.csv", 'w') as f:
    r = []
    r.append([0,"./templates/0.py"])
    r.append([1,"./templates/1.py"])
    r.append([2,"./templates/2.cpp"])
    r.append([3,"./templates/3.cpp"])
    for e in r:
        f.write("%d,%s\n" % (e[0],e[1]))

with open("data_template_language.csv", "w") as f:
    r = [
        [0,0,0],
        [1,1,0],
        [2, 2,1],
        [3, 3,1]
    ]

    for e in r:
        f.write("%d,%d,%d\n" % (e[0],e[1], e[2]))
        

with open("data_language.csv", "w") as f:
    r = [[0,"Python"],[1, "C++"]]
    for e in r:
        f.write("%d,%s\n" % (e[0],e[1]))
