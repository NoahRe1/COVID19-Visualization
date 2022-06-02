import json
import requests
import time
import datetime
import re
import pymysql

'''创建covid数据库'''
'''
db = pymysql.connect(host='localhost', user='root', password='wangdaxianer1447'）
cur=db.cursor()
cur.execute("create database covid;")
cur.execute("use covid;")
cur.execute("create table overall(date varchar(20),currentConfirmed int,overaeas int,asympyomatic int,confirmed int,dead int,cured int);")
cur.execute("create table area(date varchar(20),province varchar(20),city varchar(20),currentConfirmed int,confirmed int,dead int,cured int);")
db.commit()
cur.close()
db.close()
'''

while True:
    '''获取当前时间，判断是否执行程序'''
    time_now=time.strftime("%H:%M:%S",time.localtime())
    if time_now=="12:00:00":
        date_now = datetime.datetime.now().strftime('%Y-%m-%d')
        date_delete = (datetime.datetime.now() - datetime.timedelta(days=30)).strftime('%Y-%m-%d')

        '''连接数据库'''
        db = pymysql.connect(host='localhost', user='root', password='wangdaxianer1447', db='covid')
        cur = db.cursor()

        '''获取网站数据'''
        '''若无法获取数据，等待30秒后再次请求；若请求次数达到10，本日数据不更新'''
        flag=0
        while flag<10:
            try:
                reault = requests.get('https://ncov.dxy.cn/ncovh5/view/pneumonia?scene=2&clicktime=1579583352&enterid=1579583352&from=timeline&isappinstalled=0')
                url_text = reault.content.decode()
                break
            except:
                time.sleep(30)
                flag=flag+1
        else:
            break

        '''获取地区数据，并将数据存入area表'''
        url_result = re.search(r'window.getAreaStat = (.*?)}]}catch', url_text, re.S)
        texts = url_result.group()
        texts = texts.replace('window.getAreaStat = ', '')
        texts = texts.replace('}catch', '')
        area = json.loads(texts)

        for i in area:
            sql1 = "insert into area values('{a}','{b}','{c}',{d},{e},{f},{g});".format(a=date_now, b=i['provinceName'],c='总计',d=i['currentConfirmedCount'],e=i['confirmedCount'],f=i['deadCount'],g=i['curedCount'])
            cur.execute(sql1)
            db.commit()
            if i['cities'] != []:
                for j in i['cities']:
                    sql2 = "insert into area values('{a}','{b}','{c}',{d},{e},{f},{g});".format(a=date_now,b=i['provinceName'],c=j['cityName'], d=j['currentConfirmedCount'], e=j['confirmedCount'], f=j['deadCount'], g=j['curedCount'])
                    cur.execute(sql2)
                    db.commit()

        '''获取全国数据，并将数据存入overall表'''
        result1 = re.search(r' window.getStatisticsService(.*?)该字段已替换为说明1', url_text, re.S)
        result2 = result1.group()
        result3 = result2.replace(' window.getStatisticsService = ', '') + '"}'
        texts4 = json.loads(result3)
        
        currentConfirmed = (texts4['currentConfirmedCount'])
        overaeas = (texts4['suspectedCount'])
        asympyomatic = (texts4['seriousCount'])
        confirmed = (texts4['confirmedCount'])
        dead = (texts4['deadCount'])
        cured = (texts4['curedCount'])
        sql = "insert into overall values('{a}',{b},{c},{d},{e},{f},{g});".format(a=date_now, b=currentConfirmed,c=overaeas, d=asympyomatic,e=confirmed, f=dead,g=cured)
        cur.execute(sql)
        db.commit()

        '''删除过期数据'''
        sql = "delete from overall where date='{a}';".format(a=date_delete)
        cur.execute(sql)
        sql = "delete from area where date='{a}';".format(a=date_delete)
        cur.execute(sql)
        db.commit()

        cur.close()
        db.close()

        '''防止一秒内执行多次'''
        time.sleep(2)

