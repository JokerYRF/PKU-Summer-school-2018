#encoding=utf-8
import numpy as np
import pandas as pd
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
import csv

names = ["Goal Scored", "Ball Possession %", "Attempts", "On-Target", \
         "Off-Target", "Blocked", "Corners", "Offsides", "Free Kicks", \
         "Saves", "Pass Accuracy %", "Passes", "Distance Covered (Kms)", \
         "Fouls Committed", "Yellow Card", "Yellow & Red", "Red"] # , "1st Goal"

names = ["Goal Scored", "On-Target", "Off-Target", "Ball Possession %", \
         "Fouls Committed"]

data_file_name = "../data/FIFA_2018_Statistics.csv"
df = pd.read_csv(data_file_name)
df = df[names]

df_norm = (df - df.mean()) / (df.max() - df.min())

print(df_norm)

input_data_mat = np.array(df_norm)




df_embedded = TSNE(n_components=2).fit_transform(df_norm)


# pca = PCA(n_components=2)
# df_embedded = pca.fit(input_data_mat).transform(input_data_mat)


print(df_embedded)

df_embedded = pd.DataFrame(df_embedded)
df_embedded.reset_index(inplace=True)
df_embedded = df_embedded.rename(columns={0: "x", 1: "y"})
print(df_embedded)

df_embedded.to_csv("../data/tsne-results.csv", index=0)




