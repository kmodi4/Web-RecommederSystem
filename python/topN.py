import json
import fileinput
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.externals import joblib
import pickle
import warnings
warnings.filterwarnings("ignore")

def loadvector():
	with open('tfMatrix.pickle', 'rb') as f:
			Y=pickle.load(f)
	return Y

def readinput():
	for lines in fileinput.input():
		jsondata = lines
	return json.loads(jsondata)		

def main():
	data = readinput()
	Y = loadvector()
	mytitle = data['Mytitle']
	AllTitle = data['Alltitles']
	title_list = []
	mytitleIndex = 0
	i = 0

	for x in AllTitle:
		if x['title'] == mytitle:
			mytitleIndex = i
		title_list.append(x['title'])
		i = i+1

	
	new_data = pd.DataFrame(title_list, columns=["title"])
	cosine = linear_kernel(Y[mytitleIndex], Y)

	topN = []
	for x in cosine[0].argsort()[:-5:-1]:
		topN.append(new_data["title"][x])
	topN.pop(0)
	print (json.dumps(topN))
		

# Start process
if __name__ == '__main__':
	main()
