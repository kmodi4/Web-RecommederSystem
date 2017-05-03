import json
import fileinput
import numpy as np
import pandas as pd 

def readinput():
	for lines in fileinput.input():
		jsondata = lines
	return json.loads(jsondata)

def main():

	data = readinput()
	users = data['users']
	books = data['books']
	ratings = data['ratings']
	rating_matrix = np.zeros((len(users),len(books)))
	user_list = []
	book_list = []

	for x in users:
		user_list.append(x['user_id'])

	for x in books:
		book_list.append(x['book_id'])

	df = pd.DataFrame(data=rating_matrix,index=user_list,columns=book_list)

	for x in ratings:
		df.set_value(x['user_id'],x['b_id'],x['rating'])
	
	print (df)
	df.to_csv('rating.csv')

	




# Start process
if __name__ == '__main__':
	main()
		