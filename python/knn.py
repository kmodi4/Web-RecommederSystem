import json
import fileinput
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import KNeighborsClassifier
import pickle
import os
from classify import tokenize
import warnings
warnings.filterwarnings("ignore")

def fullPath():
	return os.path.split(os.path.realpath(__file__))[0]

def loadMatrix():
	with open(fullPath()+'/features/tfMatrix.pickle', 'rb') as f:
		M=pickle.load(f)			
	return M

def loadTFvector():
	with open(fullPath()+'/features/tfvect.pickle', 'rb') as f:
		V=pickle.load(f)			
	return V

def loadKnn():
	with open(fullPath()+'/classifiers/clf_Knn.pkl', 'rb') as f:
		K=pickle.load(f)			
	return K

def loadGenre():
	with open(fullPath()+'/features/genre.pickle', 'rb') as f:
		G=pickle.load(f)
	return G 	

def readinput():
	for lines in fileinput.input():
		desc = lines
	return desc	

def main(): 
	tfvect = loadTFvector()
	#Y = loadMatrix()
	desc = readinput()	
	genre = loadGenre()
	genre_dict = {value:index for index, value in enumerate(genre)}
	
	knn = loadKnn()
    	
	txt = [desc]
	vec_text = tfvect.transform(txt).toarray()   # change here 
	predict_data = knn.predict(vec_text)
	predict_index=predict_data[0]
	print(list(genre_dict.keys())[list(genre_dict.values()).index(predict_index)])

		

# Start process
if __name__ == '__main__':
	main()
