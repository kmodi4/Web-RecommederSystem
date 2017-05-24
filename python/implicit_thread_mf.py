import json
import fileinput
import numpy as np
import pandas as pd 
import implicit
import scipy.sparse as sparse
from scipy.sparse.linalg import spsolve
import matplotlib.pyplot as plt
import itertools

def readinput():
	for lines in fileinput.input():
		jsondata = lines
	return json.loads(jsondata)

def main():

	data = readinput()
	users = data['users']
	books = data['books']
	ratings = data['ratings']
	target = data['target']
	rating_matrix = np.zeros((len(users),len(books)))
	counts = sparse.dok_matrix((len(books),len(users)), dtype=float)
	user_list = []
	book_list = []
	target_id = -1

	for i,x in enumerate(users):
		if(x==target):
			target_id = i
		user_list.append(x)

	for x in books:
		book_list.append(x)

	for x in ratings:
		counts[book_list.index(x['b_id']),user_list.index(x['user_id'])] = x['counts']

	#print(counts.tocsr())

	# initialize a model
	model = implicit.als.AlternatingLeastSquares(factors=8)

	# train the model on a sparse matrix of item/user/confidence weights
	model.fit(counts)

	# recommend items for a user
	result = []
	recommendations = model.recommend(target_id, counts.T)
	for i,x in enumerate(recommendations):
		result.append(book_list[x[0]])
	print (result)

	# find related items
	#related = model.similar_items(item_id)
	#print (related)

# Start process
if __name__ == '__main__':
	main()