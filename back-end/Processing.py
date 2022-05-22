import pymysql
import datetime
import json


def get_json(param: str) -> str:
    """
    根据用户请求类型返回相应JSON数据

    Args:
        param: 用户请求类型
    Returns:
        JSON类型的数据
    """

    db = pymysql.connect(host="localhost", user="root", password="mm20020207", database="covid19")  # 数据库连接
    cursor = db.cursor()  # 游标
    raw_data = dict()  # 字典类型的数据
    today = datetime.date.today()  # 今天日期

    # 用户请求类型为overall
    if param == "overall":
        # 查看缓存
        with open("overall.json", "r") as f:
            raw_data = json.load(f)
            if raw_data["date"] == str(today):  # 若有今日缓存则使用
                json_data = json.dumps(raw_data, ensure_ascii=False)
                return json_data

        # 获取概况数据
        date = today  # 最新日期
        cursor.execute(f"select * from overall where date='{date}'")
        overall = cursor.fetchone()  # 今日概况数据
        if overall is None:  # 若今日概况数据为空
            date = date + datetime.timedelta(days=-1)  # 昨天日期
            cursor.execute(f"select * from overall where date='{date}'")
            overall = cursor.fetchone()  # 昨日概况数据
        raw_data['date'] = str(date)  # 写入日期
        raw_data['overall'] = {'currentConfirmed': overall[1], ' overseas': overall[2], 'asymptomatic': overall[3],
                               'confirmed': overall[4], 'dead': overall[5], 'cured': overall[6]}  # 写入概况数据

        # 获取省级数据
        cursor.execute(
            f"select province,currentConfirmed,confirmed,dead,cured from area "
            f"where date='{date}' and city='总计'")
        province = cursor.fetchall()  # 省级数据
        raw_data['province'] = [
            {'name': province[i][0], 'currentConfirmed': province[i][1], 'confirmed': province[i][2],
             'dead': province[i][3], 'cured': province[i][4]} for i in range(len(province))]  # 写入省级数据

        # 转换为JSON格式
        json_data = json.dumps(raw_data, ensure_ascii=False)

        # 缓存文件
        if raw_data["date"] == str(today):
            with open("overall.json", "w") as f:
                json.dump(raw_data, f, ensure_ascii=False)

    # 用户请求类型为trend
    elif param == "trend":
        # 查看缓存
        with open("trend.json", "r") as f:
            raw_data = json.load(f)
            if raw_data["trend"][0]["date"] == str(today):
                json_data = json.dumps(raw_data)
                return json_data

        # 获取三十日数据
        cursor.execute(f"select * from overall order by date DESC")
        trend = cursor.fetchall()  # 三十日数据
        raw_data['trend'] = [{'date': str(trend[i][0]), 'currentConfirmed': trend[i][1], 'overseas': trend[i][2],
                              'asymptomatic': trend[i][3], 'confirmed': trend[i][4], 'dead': trend[i][5],
                              'cured': trend[i][6]} for i in range(len(trend))]  # 写入三十日数据

        # 转换为JSON格式
        json_data = json.dumps(raw_data)

        # 缓存文件
        if raw_data["trend"][0]["date"] == str(today):
            with open("trend.json", "w") as f:
                json.dump(raw_data, f, ensure_ascii=False)

    # 用户请求类型为地区名
    else:
        # 获取市级数据
        cursor.execute(
            f"select city,currentConfirmed,confirmed,dead,cured from area "
            f"where province='{spelling(param)}' and city<>'总计'")
        city = cursor.fetchall()
        raw_data["city"] = [
            {'name': city[i][0], 'currentConfirmed': city[i][1], 'confirmed': city[i][2],
             'dead': city[i][3], 'cured': city[i][4]} for i in range(len(city))]

        # 转换为JSON格式
        json_data = json.dumps(raw_data)

    db.close()  # 关闭数据库
    return json_data


def spelling(province: str) -> str:
    """
    拼音转换为地区名

    Args:
        province: 地区名
    Returns:
        对应的拼音
    """
    mapping = {"taiwan": "台湾", "xianggang": "香港", "shanghai": "上海", "zhejiang": "浙江", "beijing": "北京",
               "sichuan": "四川", "henan": "河南", "jilin": "吉林", "shandong": "山东", "fujian": "福建",
               "tianjin": "天津", "qinghai": "青海", "hainan": "海南", "guangxi": "广西", "yunnan": "云南",
               "liaoning": "辽宁", "jiangsu": "江苏", "hunan": "湖南", "chongqing": "重庆", "hebei": "河北",
               "jiangxi": "江西", "neimenggu": "内蒙古", "guizhou": "贵州", "shaanxi": "陕西", "hubei": "湖北",
               "heilongjiang": "黑龙江", "anhui": "安徽", "xinjiang": "新疆", "gansu": "甘肃", "shanxi": "山西",
               "ningxia": "宁夏", "aomen": "澳门", "xizang": "西藏"
               }
    return mapping[province]


if __name__ == "__main__":
    print(get_json("trend"))
