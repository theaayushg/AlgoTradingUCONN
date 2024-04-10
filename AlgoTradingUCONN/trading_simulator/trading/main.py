#Prototype for the trading simulator

class TradingSimulator:

    def __init__(self):
        self.orders = []
        self.executed_orders = []
        self.user_balance = 10000 #user starts with 10k
        self.user_portfolio = {} #user starts with empty portfolio
        self.order_id_counter = 0

    def place_order(self, order_type, quantity, price, stop_loss=None):
        order = {
            'order_id': self.order_id_counter,
            'type': order_type,
            'quantity': quantity,
            'price': price,
            'stop_loss': stop_loss
        }
        self.order_id_counter += 1
        if self.validate_order(order):
            self.orders.append(order)
            print(f"Order placed: {order}")
        else:
            print("Order invalid.")

    def validate_order(self, order):
        if order['quantity'] <= 0 or order['price'] <= 0:
            return False
        if order['type'] not in ['buy', 'sell']:
            return False
        if order['type'] == 'buy' and (order['price'] * order['quantity']) > self.user_balance:
            return False
        # Additional validation checks need to be added here
        return True

    def execute_orders(self):
        for order in self.orders:
            if order['type'] == 'buy' and self.user_balance >= order['quantity'] * order['price']:
                self.user_balance -= order['quantity'] * order['price']
                self.user_portfolio[order['order_id']] = order
                order['status'] = 'executed'
                self.executed_orders.append(order)
                print(f"Order executed: {order}")
            # Additional execution logic for sell orders and other order types can be added here
        self.orders = [order for order in self.orders if order['status'] == 'pending']

    def print_portfolio(self):
        print("User Portfolio:")
        for order_id, order in self.user_portfolio.items():
            print(f"Order ID: {order_id}, Type: {order['type']}, Quantity: {order['quantity']}, Price: {order['price']}")

    def print_balance(self):
        print(f"User Balance: ${self.user_balance:.2f}")

# Example usage:
simulator = TradingSimulator()
simulator.place_order('buy', 10, 50)  # Buy 10 shares at $50 each
simulator.place_order('buy', 5, 200)  # Buy 5 shares at $200 each
simulator.execute_orders()
simulator.print_portfolio()
simulator.print_balance()
