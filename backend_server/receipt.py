class Receipt:
    def __init__(self):
        self._receipt_file = None
        self._date = None
        self._total_expense = 0.0
        self._main_category = None
        self._sub_category = None

    # Getter Methods
    def get_receipt_file(self):
        return self._receipt_file

    def get_date(self):
        return self._date

    def get_total_expense(self):
        return self._total_expense

    def get_main_category(self):
        return self._main_category

    def get_sub_category(self):
        return self._sub_category

    # Setter Methods
    def set_receipt_file(self, receipt_file):
        self._receipt_file = receipt_file

    def set_date(self, date):
        self._date = date

    def set_total_expense(self, total_expense):
        self._total_expense = total_expense

    def set_main_category(self, main_category):
        self._main_category = main_category

    def set_sub_category(self, sub_category):
        self._sub_category = sub_category

    # Print Method
    def __str__(self):
        return f"Date: {self._date}, Total Expense: {self._total_expense}, " \
               f"Main Category: {self._main_category}, " \
               f"Sub Category: {self._sub_category}"
