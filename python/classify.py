import json
import fileinput
from collections import defaultdict
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction import text
from sklearn.naive_bayes import MultinomialNB
from nltk import word_tokenize
from nltk.stem.porter import PorterStemmer
from nltk.stem import WordNetLemmatizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.externals import joblib
from sklearn.neighbors import KNeighborsClassifier
import pickle
import os
import warnings
warnings.filterwarnings("ignore")

#Read data from stdin
def read_in():
    
    for lines in fileinput.input():
        jsondata = lines
 
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(jsondata)

def tokenize(text):
    tokens = word_tokenize(text)
    wordnet_lemmatizer = WordNetLemmatizer()
    stems = []
    for item in tokens:
        item = PorterStemmer().stem(item)
        #stems.append(PorterStemmer().stem(item))
        stems.append(wordnet_lemmatizer.lemmatize(item))
    return stems

def MNLB(Y,results):
    clf = MultinomialNB()
    clf.fit(Y,results)
    #now you can save it to a file
    Fullpath = os.path.split(os.path.realpath(__file__))[0]
    with open(Fullpath+'/classifiers/clf_Mnlb.pkl', 'wb') as f:
        pickle.dump(clf, f)
    return clf
    
def KNN(Y,results):
    clf = KNeighborsClassifier(n_neighbors=3) 
    clf.fit(Y,results)
    Fullpath = os.path.split(os.path.realpath(__file__))[0]
    with open(Fullpath+'/classifiers/clf_Knn.pkl', 'wb') as f:
        pickle.dump(clf, f)
    return clf


def main():
    #get our data as an array from read_in()
    data = read_in()
    title_list = []
    bookid_list = []
    description_list = []
    genre_list = []
    

    for x in data:
        title_list.append(x['title'])
        description_list.append(x['desc'])
        genre_list.append(x['genre'])
        bookid_list.append(x['book_id'])
        
    
    new_data = pd.DataFrame(bookid_list, columns=["book_id"])
    new_data["description"] = description_list
    new_data["genre"] = genre_list
    
    extra_word = {"!",":",";","[","]","(",")","{","}",",",".","-","--","&","'","?","@","#","%","$","*","book","books"}
    s_w = text.ENGLISH_STOP_WORDS.union(extra_word)

    corpus = new_data["description"]
    
    tfvect = TfidfVectorizer(tokenizer=tokenize,stop_words=s_w,analyzer='word',lowercase=True,strip_accents='unicode',use_idf=False)
    
    Y = tfvect.fit_transform(corpus).toarray()
    Fullpath = os.path.split(os.path.realpath(__file__))[0]
    pickle.dump(Y, open(Fullpath+'/features/tfMatrix.pickle', "wb"))
    f1 = open(Fullpath+'/features/tfvect.pickle',"wb")
    pickle.dump(tfvect,f1)
    f1.close()

    #print (pd.DataFrame(data=Y,index=bookid_list,columns=tfvect.get_feature_names()))
    #print (tfvect.get_feature_names()[150:240])

    genre = new_data["genre"].unique()
    genre_dict = {value:index for index, value in enumerate(genre)}
    results = new_data["genre"].map(genre_dict)

    #pickle.dump(genre,open(Fullpath+"/features/genre.pickle", "wb")) 
    KNN(Y,results)
    #print ("KNN model created...")
    print (Y.shape)
    MNLB(Y,results)
    #print ("MLNB model created...")
    

    #cosine_similarities = linear_kernel(Y, Y)
    #cosine = cosine_similarity(Y[0], Y)
    #cosine = linear_kernel(Y[0], Y)
    #print (cosine[0].argsort()[:-5:-1])

    #for idx, row in new_data.iterrows():   # to find Cosine Similaty between every element
            #similar_indices = cosine_similarities[idx].argsort()[:-5:-1]
            #print (similar_indices)
            #similar_items = [(cosine_similarities[idx][i], new_data["title"][i]) for i in similar_indices]
            # First item is the item itself, so remove it.
            # This 'sum' is turns a list of tuples into a single tuple:
            # [(1,2), (3,4)] -> (1,2,3,4)
            #flattened = sum(similar_items[1:], ())
            #print (flattened)

   

    
    #txt = ["java classes ,java interfaces  java programming"]
    #txt = ["Effective presentation of linear algebra, its mathematical concepts, its tools and techniques that are essential to the solution of problems encountered most frequently in connection with engineering applications. The book introduces students to the related concepts, rules and use of matrices and vector spaces in the solution of linear systems of equations which appear frequently as models of various engineering problems. Separate chapters are devoted to a thorough study of linear transformations, inner product spaces and eigenvalue problems in connection with matrices."]
    #txt = ["beginning with an overview of the concepts of C programming the book provides an introduction to different data structures and methods to analyse the complexity of different algorithms. It goes onto connect these concepts and apply them to the study of various data structures such as arrays, strings, linked lists, stacks, queues, trees, heaps and graphs. In addition, the book includes detailed description of searching and sorting techniques and hashing and an exclusive chapter on the attributes and organisation of files."]
    #txt = ["revisit the database"]
    #txt = ["practical approch to operating system"]
    #vec_text = tfvect.transform(txt).toarray()   # change here 
    #predict_data = clf.predict(vec_text);
    #print (predict_data)
    #predict_index = predict_data[0];
    #print (predict_index)
    #print ("Predicted Category is "+list(genre_dict.keys())[list(genre_dict.values()).index(predict_index)])
    



    
    

# Start process
if __name__ == '__main__':
    main()

 

