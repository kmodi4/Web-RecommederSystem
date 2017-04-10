import json
import fileinput
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
import pickle
from classify import tokenize
import warnings
warnings.filterwarnings("ignore")

def loadMatrix():
	with open('tfMatrix.pickle', 'rb') as f:
		M=pickle.load(f)			
	return M

def loadTFvector():
	with open('tfvect.pickle', 'rb') as f:
		V=pickle.load(f)			
	return V

def loadKnn():
	with open('clf_Knn.pkl', 'rb') as f:
		K=pickle.load(f)			
	return K	

def readinput():
	for lines in fileinput.input():
		jsondata = lines
	return json.loads(jsondata)	

def main(): 
	tfvect = loadTFvector()
	#Y = loadMatrix()
	AllTitle = readinput()
	title_list = []
	genre_list = []
	mytitleIndex = 0
	i = 0

	for x in AllTitle:
		title_list.append(x['title'])
		genre_list.append(x['genre'])

	
	new_data = pd.DataFrame(title_list, columns=["title"])
	new_data["genre"] = genre_list

	genre = new_data["genre"].unique()
	genre_dict = {value:index for index, value in enumerate(genre)}
	results = new_data["genre"].map(genre_dict)
	knn = loadKnn()

	
	txt = ["abstract data type plays major role. such as stack,queue"]
	vec_text = tfvect.transform(txt).toarray()   # change here 
	predict_data = knn.predict(vec_text);
	print (predict_data)
	predict_index = predict_data[0];
	print ("Predicted Category is "+list(genre_dict.keys())[list(genre_dict.values()).index(predict_index)])

		

# Start process
if __name__ == '__main__':
	main()
