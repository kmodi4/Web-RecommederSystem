import json
import fileinput
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.externals import joblib
import pickle
import os
import warnings
warnings.filterwarnings("ignore")

def fullPath():
	return os.path.split(os.path.realpath(__file__))[0]

def loadMatrix():
	with open(fullPath()+'/features/tfMatrix.pickle', 'rb') as f:
			Y=pickle.load(f)
	return Y

def readinput():
	for lines in fileinput.input():
		jsondata = lines
	return json.loads(jsondata)		

def main():
	data = readinput()
	Y = loadMatrix()
	mytitle = data['Mytitle']
	AllTitle = data['Alltitles']
	title_list = []
	mytitleIndex = -1
	i = 0
	topN = []

	for x in AllTitle:
		if x['title'] == mytitle:
			mytitleIndex = i
		title_list.append(x['title'])
		i = i+1

	if mytitleIndex < Y.shape[0]:
		new_data = pd.DataFrame(title_list, columns=["title"])
		cosine = linear_kernel(Y[mytitleIndex], Y)

		for x in cosine[0].argsort()[::-1][:6]:
			topN.append(new_data["title"][x])
		topN.pop(0)

	print (json.dumps(topN))

		
	
		

# Start process
if __name__ == '__main__':
	main()
