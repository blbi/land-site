import csv
 
f = open('data.csv', 'r', encoding='cp949')
reader = csv.reader(f)
for line in reader:
    print(line[2])
f.close() 