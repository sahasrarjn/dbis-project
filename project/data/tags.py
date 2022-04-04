import random
random.seed(0)

tags = []
with open("questions.csv", "r") as f:
    for line in f.readlines():
        l = [x.strip() for x in line.split(',')]
        if l[0] not in tags:
            tags.append(l[0])

print(tags)

tid = {}

graph ={}
custom = [
    "Math",
    "BFS",
    "DFS",
    "Postorder",
    "Inorder",
    "Preorder",
    "Recursion",
    "Divide and Conquer"
]

tags += custom

for i in range(1, len(tags)+1):
    tid[tags[i-1]] = i

for t in tags:
    graph[t] = []

graph['Array'] += ['Math', 'Greedy', 'Divide and Conquer']
graph['Matrix'] += ['Math', 'Recursion']
graph['String'] += ['Divide and Conquer', 'Dynamic Programming']
graph['Searching & Sorting'] += ['Divide and Conquer', 'Dynamic Programming']
graph['LinkedList'] += []
graph['Binary Trees'] += ['Inorder', 'Preorder', 'Postorder', 'Recursion']
graph['Binary Search Trees'] += ['Inorder', 'Preorder', 'Postorder', 'Recursion']
graph['Greedy'] += ['Math']
graph['BackTracking'] += ['DFS', 'BFS', 'Recursion']
graph['Stacks & Queues'] += ['Recursion']
graph['Heap'] += []
graph['Graph'] += ['DFS', 'BFS', 'BackTracking']
graph['Trie'] += []
graph['Dynamic Programming'] += ['Math']
graph['Bit Manipulation'] += ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'String', 'Math', 'Array']
graph['Math'] += []
graph['BFS'] += []
graph['DFS'] += []
graph['Postorder'] += []
graph['Inorder'] += []
graph['Preorder'] += []
graph['Recursion'] += []
graph['Divide and Conquer'] += []

with open("data_tags.csv", "w") as f:
    for t in tags:
        f.write("\'{}\',\'{}\'\n".format(tid[t], t))

data = []

with open("tag.txt", 'r') as f:
    for line in f.readlines():
        l = [x.strip() for x in line.split(',')]
        qid = int(l[0].strip('\''))
        tag = int(l[1].strip('\''))
        other_tags = graph[tags[tag]]
        random.shuffle(other_tags)
        p = random.random()
        if p<0.8 or len(other_tags)==0:
            data.append([qid, tag+1])
        extra = random.randint(0, len(other_tags))
        for i in range(extra):
            data.append([qid, tid[other_tags[i]]])

with open("data_question_tags.csv", 'w') as f:
    i=1
    for d in data:
        f.write("\'{}\',\'{}\',\'{}\'\n".format(i,d[0], d[1]))
        i+=1

with open("data_tag_child.csv", "w") as f:
    i=1
    for t in tags:
        for c in graph[t]:
            f.write("\'{}\',\'{}\',\'{}\'\n".format(i,tid[t], tid[c]))
            i+=1

    