import base64
import requests
import ast
import openai
import os
import re
import argparse
from dotenv import load_dotenv
from datetime import datetime
from receipt import Receipt


class ReceiptCategorizer:
    def __init__(self, image_file, sub_category_set):
        self._image_file = image_file
        self._sub_category_set = sub_category_set

        # Read the API Key from environment variable
        load_dotenv()
        self._api_key = os.environ.get("OPENAI_API_KEY")
        self._openai_chat_url = "https://api.openai.com/v1/chat/completions"
        self._main_categories = {'Food', 'Transportation', 'Utilities',
                                 'Shopping', 'Medical', 'Entertainment',
                                 'Miscellaneous', 'Housing'}

    def get_sub_category_set(self):
        """
        Get the sub-category set.
        """
        return self._sub_category_set

    def encode_image(self):
        """
        Encode the image to base64 format.
        """
        self._image_file.seek(0)
        return base64.b64encode(self._image_file.read()).decode('utf-8')

    def prompt_gpt(self, prompt_msg):
        """
        Send the prompt and image to OpenAI's Chat API and return the response.
        """
        openai.api_key = self._api_key
        base64_image = self.encode_image()

        # Send the prompt and image to OpenAI's Chat API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._api_key}"
        }

        payload = {
            "model": "gpt-4-vision-preview",
            "messages": [
                {"role": "user", "content": [
                    {
                        "type": "text",
                        "text": prompt_msg
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]}
            ],
            "max_tokens": 300
        }

        response = requests.post(self._openai_chat_url,
                                 headers=headers, json=payload)
        return response.json()['choices'][0]['message']['content']

    def add_category(self, category, category_set):
        """
        Add the category to the category set.
        """
        if category not in category_set:
            category_set.add(category)

    def extract_json_string(self, input_string):
        """
        Extract the JSON-like string from the input string.
        """
        # Pattern to match the JSON-like structure
        date_pattern = r'\d{2}/\d{2}/\d{4}'
        float_pattern = r'[+-]?([0-9]*[.])?[0-9]+'
        pattern = rf'\{{\s*"Date":\s*("{date_pattern}"),\s*"Total_Expense":\s*({float_pattern})\s*\}}'

        # Find all matches in the input string
        matches = re.search(pattern, input_string)

        # Return the matched string if found, otherwise return None
        return matches.group(0) if matches else None

    def categorize_receipt(self):
        """
        Categorize the receipt based on the image content,
        and store the information in a Receipt object.
        """
        receipt = Receipt()

        # Check if the image is a receipt
        prompt1 = """
        Your task is to valid whether the image uploaded is a receipt.
        If yes, RETURN True; if no, RETURN False.
        """

        is_receipt = bool(self.prompt_gpt(prompt1))
        if not is_receipt:
            return None

        # Categorize the main category of the receipt
        prompt2 = f"""
        Your task is to categorize the receipt based on the given main
        categories delimited with triple backticks.
        For example, if the receipt is from a bookstore or a hardware store,
        add it to the Miscellaneous category.
        If the receipt is related to doing exercise, add it to the
        Entertainment category.
        If the receipt is related to a hotel, add it to the Housing category.

        Category: '''{self._main_categories}'''
        Please only return the category.
        """

        main_category = self.prompt_gpt(prompt2)

        # Categorize the sub-category of the receipt
        prompt3 = f"""
        Your task is to categorize the receipt based on your knowledge as
        detailed as possible, e.g., Italian Restaurant. Try to use the
        existing categories delimited with triple backticks.
        If none of the categories can represent the expense, you can create
        new categories. But try to not create too many.

        Category: '''{self._sub_category_set}'''
        Please only return the most matched name of the category without any
        triple backticks and redundant information.
        """

        sub_category = self.prompt_gpt(prompt3)

        # Limit the words of the sub-category
        prompt_limit = 0
        while len(sub_category.split()) > 3:
            if prompt_limit > 2:
                sub_category = "Miscellaneous"
                break

            sub_category = self.prompt_gpt(prompt3)
            prompt_limit += 1

        # Update the sub-category set with the new category
        self.add_category(sub_category, self._sub_category_set)

        # Extract information from the receipt
        prompt4 = """
        Your task is to extract relevant information from the receipt content,
        and return it in the format exactly as below:
        {
            "Date": mm/dd/yyyy,
            "Total_Expense": float
        }

        Please do not include the triple backticks and json keyword.
        """

        info = self.prompt_gpt(prompt4)

        # Parse the extracted information
        # Handle the cases that it contains the ```json
        extracted_info = self.extract_json_string(info)
        info_dict = ast.literal_eval(extracted_info) if extracted_info else {}

        # Check for missing values and set defaults if necessary
        date = info_dict.get("Date", datetime.now().strftime('%m/%d/%Y'))
        total_expense = float(info_dict.get("Total_Expense", 0.0))

        # Use the setter methods to store the data in the Receipt object
        receipt.set_receipt_file(self._image_file)
        receipt.set_date(date)
        receipt.set_total_expense(total_expense)
        receipt.set_main_category(main_category)
        receipt.set_sub_category(sub_category)
        return receipt


# Example Usage
if __name__ == "__main__":
    # Add an argument for the image file path
    # Example: python receipt_categorizer.py <image_path>
    parser = argparse.ArgumentParser()
    parser.add_argument("image_path", help="The path to the image file.")

    # Get the image file
    args = parser.parse_args()
    image_path = args.image_path
    image_file = open(image_path, 'rb')

    # Create an instance of the ReceiptCategorizer class
    categorizer = ReceiptCategorizer(image_file=image_file,
                                     sub_category_set=set())
    receipt = categorizer.categorize_receipt()

    if receipt:
        print(receipt)

    # Close the image file
    image_file.close()
