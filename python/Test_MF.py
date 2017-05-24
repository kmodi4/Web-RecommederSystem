import json
import fileinput
import numpy as np
import pandas as pd 
import matplotlib.pyplot as plt
import pylab
import time

def readinput():
	for lines in fileinput.input():
		jsondata = lines
	return json.loads(jsondata)

def get_error(Q, X, Y, W):
	return np.sum((W * (Q - np.dot(X, Y)))**2)

#def print_recommendations(W=W, Q=Q, Q_hat=Q_hat, movie_titles=movie_titles):
	#Q_hat -= np.min(Q_hat)
	#Q_hat[Q_hat < 1] *= 5
	#Q_hat -= np.min(Q_hat)
	#Q_hat *= float(5) / np.max(Q_hat)
	#movie_ids = np.argmax(Q_hat - 5 * W, axis=1)
	#for jj, movie_id in zip(range(m), movie_ids):
		#if Q_hat[jj, movie_id] < 0.1: continue
		#print('User {} liked {}\n'.format(jj + 1, ', '.join([movie_titles[ii] for ii, qq in enumerate(Q[jj]) if qq > 3])))
		#print('User {} did not like {}\n'.format(jj + 1, ', '.join([movie_titles[ii] for ii, qq in enumerate(Q[jj]) if qq < 3 and qq != 0])))
		#print('\n User {} recommended movie is {} - with predicted rating: {}'.format(jj + 1, movie_titles[movie_id], Q_hat[jj, movie_id]))
		#print('\n' + 100 *  '-' + '\n')
#print_recommendations()

def main():

	data = readinput()
	users = data['users']
	books = data['books']
	ratings = data['ratings']
	target = data['target']
	rating_matrix = np.zeros((len(users),len(books)))
	user_list = []
	book_list = []
	user_liked = []
	target_id = -1
	
	for i,x in enumerate(users):
		if(x==target):
			target_id = i
		user_list.append(x)
		

	for x in books:
		book_list.append(x)

	df = pd.DataFrame(data=rating_matrix,index=user_list,columns=book_list)

	for x in ratings:
		df.set_value(x['user_id'],x['b_id'],x['counts'])
	
	#df.to_csv('implicit_rating.csv')

	Q = df.values

	for i,x in enumerate(Q[target_id]):
		if(x>0):
			user_liked.append(book_list[i])
			

	W = Q>0.5
	W[W == True] = 1
	W[W == False] = 0
	# To be consistent with our Q matrix
	W = W.astype(np.float64, copy=False)

	lambda_ = 0.1
	n_factors = 8
	m, n = Q.shape
	n_iterations = 22
	t0 = time.time()

	X = 5 * np.random.rand(m, n_factors) 
	Y = 5 * np.random.rand(n_factors, n)
		

	weighted_errors = []
	for ii in range(n_iterations):
		for u, Wu in enumerate(W):
			X[u] = np.linalg.solve(np.dot(Y, np.dot(np.diag(Wu), Y.T)) + lambda_ * np.eye(n_factors),np.dot(Y, np.dot(np.diag(Wu), Q[u].T))).T
		for i, Wi in enumerate(W.T):
			Y[:,i] = np.linalg.solve(np.dot(X.T, np.dot(np.diag(Wi), X)) + lambda_ * np.eye(n_factors),np.dot(X.T, np.dot(np.diag(Wi), Q[:, i])))
		weighted_errors.append(get_error(Q, X, Y, W))
			#print('{}th iteration is completed'.format(ii))
	weighted_Q_hat = np.dot(X,Y)
	err = get_error(Q, X, Y, W)
	print('Error of rated Books: {}'.format(err))
	
	plt.plot(weighted_errors);
	plt.xlabel('Iteration Number');
	plt.ylabel('Mean Squared Error');
		
	ids = []
			
	if(target_id!=-1):
		ids = weighted_Q_hat[target_id].argsort()[::-1][:10]
	result = []
	for x in ids:
		if(book_list[x] not in user_liked):
			result.append(book_list[x])
	t1 = time.time()
	print ('Finished Computing in %f seconds' % (t1 - t0))
	print (result)	
	pylab.show()
	


# Start process
if __name__ == '__main__':
	main()
