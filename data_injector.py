# This script automates inserting random order to the database


import datetime
import msvcrt
import random
from time import sleep

import pymssql


class Match:
    def __init__(self, mid, stock_name, amount, price):
        self.mid = mid
        self.stockName = stock_name
        self.amount = amount
        self.price = price

    def __repr__(self):
        return "id: {0}, stockName: {1}, amount: {2}, price: {3}" \
            .format(self.mid, self.stockName, self.amount, self.price)


class Order:
    def __init__(self, orderid, stock_name, trade_option, amount, price, date=str(datetime.datetime.now())[0:-3]):
        self.id = orderid
        self.stockName = stock_name
        self.trade_option = trade_option
        self.date = date
        self.amount = amount
        self.price = price

    def __repr__(self):
        return "stockName: {0}, date: {1}, option: {2}, amount: {3}, price: {4}" \
            .format(self.stockName, self.date, self.trade_option, self.amount, self.price)


stock_ids = ['GOOG', 'APPL', 'NVDA', 'AMZN', 'FB']
options = ['M', 'B']


# def random_matching():
#     print("\nPress any key to stop\n")
#     conn = pymssql.connect('MSI\\MSSQLServer', user='sa', password='123', database='CHUNGKHOAN')
#     cursor = conn.cursor()
#     # randomize price updates
#     while True:
#         amount = random.randrange(100, 1000)
#         price = random.randrange(100, 1000)
#         stock = random.choice(stock_ids)
#         #         cursor.execute('UPDATE tbl_price set price=price+%s where id=%s', (value, stock.id))
#         # cursor.execute('INSERT INTO LENHKHOP() values (%s, &s) price=price+%s where id=%s', (value, stock.id))
#
#         # stock.price = stock.price + value
#         print("Updated {0}: New price: {1}".format(stock.name, stock.price))
#         conn.commit()
#
#         # if user hit
#         if msvcrt.kbhit():
#             break
#         sleep(1)
#
#     conn.close()


def random_ordering():
    print("\nPress any key to stop\n")

    conn = pymssql.connect('MSI\\MSSQLServer', user='sa', password='123', database='CHUNGKHOAN')
    cursor = conn.cursor()

    while True:
        name = random.choice(stock_ids)
        date = str(datetime.datetime.now())[0:-3]
        option = random.choice(options)
        amount = random.randrange(1, 100) * 10
        price = random.randrange(1, 100) * 1000

        cursor.callproc('LimitOrderMatching',
                        (name, date, option, amount, price))
        conn.commit()
        print("Inserted {} {} {} {} {}".format(name, date, option, amount, price))

        if msvcrt.kbhit():
            break
        sleep(1)


if __name__ == '__main__':
    random_ordering()
