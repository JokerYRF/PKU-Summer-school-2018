#encoding=utf-8
import pandas as pd
import numpy as np

data_file_name = "../data/FIFA_2018_Statistics_1.csv"
df = pd.read_csv(data_file_name)
# df = df[names]


# 
# df["month"] = 0
# df["day"] = 0
# for i in range(len(df)):
#     # print(df["month"][i])
#     # print(df["Date"][i][3:5])
#     df.loc[i, "month"] = int(df["Date"][i][3:5])
#     df.loc[i, "day"] = int(df["Date"][i][0:2])
# print(df["month"])
# print(df["day"])
# df.sort_values(by=["month", "day"], inplace=True)


print(df["Team"].unique())
list_team = df["Team"].unique()

df_output = pd.DataFrame()
for team_name in list_team:
    df_filter_team = df[df["Team"] == team_name]
    # df_filter_team.sort(columns=["Date"])
    




# name_convert = {"乌拉圭",
# "俄罗斯",
# "沙特阿拉伯",
# "埃及",
# "西班牙",
# "葡萄牙",
# "伊朗",
# "摩洛哥",
# "法国",
# "丹麦",
# "秘鲁",
# "澳大利亚",
# "克罗地亚",
# "阿根廷",
# "尼日利亚",
# "冰岛",
# "巴西",
# "瑞士",
# "塞尔维亚",
# "哥斯达黎加",
# "瑞典",
# "墨西哥",
# "韩国",
# "德国",
# "比利时",
# "英格兰",
# "突尼斯",
# "巴拿马",
# "哥伦比亚",
# "日本",
# "塞内加尔",
# "波兰"}