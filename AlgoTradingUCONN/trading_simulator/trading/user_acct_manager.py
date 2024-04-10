from datetime import datetime
from datetime import date
class User:
    """This class defines the attributes of a user"""
    def __init__(self, fname: str, lname: str, dob, email: str, phone, acct_bal: int, portfolio: dict, trsctn_hist: dict):
        self.fname = fname
        self.lname = lname
        self.dob = dob
        self.email = email
        self.phone = phone
        self.acct_bal = acct_bal
        self.portfolio = portfolio
        self.trsctn_hist = trsctn_hist

    def update_email(self, new_email):
        self.email = new_email

    def update_phone(self, new_phone):
        self.phone = new_phone

    def update_user_balance(self, bal_change):
        self.acct_bal += bal_change

    def update_portfolio(self, order_type, price, num_assets, asset_name):
        if order_type == "sell":
            for stock_name in self.portfolio.keys():
                if stock_name == asset_name and num_assets <= self.portfolio[asset_name][1]:
                    self.portfolio[asset_name][1] -= num_assets
                    self.acct_bal += price * num_assets
                    self.update_transaction_hist(order_type, price, num_assets, asset_name)
                    break
                else:
                    print(f"Error. You own less than {num_assets} stocks of {asset_name}.")
        else:
            #Buy order
            for stock_name in self.portfolio.keys():
                if stock_name == asset_name:
                    self.portfolio[asset_name][1] += num_assets
                    self.acct_bal -= price * num_assets
                    self.update_transaction_hist(order_type, price, num_assets, asset_name)
                    break
                else:
                    #new stock
                    self.portfolio[asset_name] = [price, num_assets]
                    self.acct_bal -= price * num_assets
                    self.update_transaction_hist(order_type, price, num_assets, asset_name)

    def print_portfolio(self):
        print(self.portfolio)

    def update_transaction_hist(self, order_type, price, num_assets, asset_name):
        self.trsctn_hist = {}
        now = datetime.now()
        current_time = now.strftime("%H:%M:%S")
        self.trsctn_hist[current_time] = [asset_name, order_type, price, num_assets]

    def print_trsctn_hist(self):
        print(self.trsctn_hist)


if __name__ == "__main__":
    portfolio1 = {}
    trsnctn_hist1 = {}
    portfolio1["AAPL"] = [60, 100] #BuyPrice, NumberOfShares
    portfolio1["MSFT"] = [80, 55]
    portfolio1["TSLA"] = [120, 14]

    trsnctn_hist1[date.today()] = ["AAPL", 60, 100]
    trsnctn_hist1[date.today()] = ["MSFT", 80, 55]
    trsnctn_hist1[date.today()] = ["AAPL", 120, 14]

    dob1 = date(2001, 12, 28)
    user1 = User("Siddharth", "Sinha", dob1, "sid.sinha722@outlook.com", "4754550984",
        3500, portfolio1, trsnctn_hist1)

    user1.update_portfolio("sell", 90, 50, "AAPL")
    user1.print_portfolio()
    user1.print_trsctn_hist()
