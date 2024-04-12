import requests
import openai
import os
from dotenv import load_dotenv


class AdvisorBot:
    def __init__(self, user_prompt):
        self._user_prompt = user_prompt
        self._prefix = "Please answer the question delimited with triple backticks "
        load_dotenv()
        self._api_key = os.environ.get("OPENAI_API_KEY")
        self._openai_chat_url = "https://api.openai.com/v1/chat/completions"

    def prompt_gpt(self, prompt_msg):
        """
        Send the user prompt to OpenAI's Chat API and return the response.
        """
        openai.api_key = self._api_key

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._api_key}"
        }

        payload = {
            "model": "gpt-4",
            "messages": [
                {"role": "system", "content": "You are a helpful advisorbot and chatbot."},
                {"role": "user", "content": prompt_msg}
            ],
            "max_tokens": 300
        }

        response = requests.post(self._openai_chat_url,
                                 headers=headers, json=payload)
        return response.json()['choices'][0]['message']['content']

    def fetch_and_analyze_receipt(self, user_id):
        """
        Fetch receipt data from a Django endpoint and analyze it with GPT.
        """
        # Send a GET request to the endpoint to fetch the receipt data
        url = "http://127.0.0.1:8000/receipt/?user_id=" + user_id
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            # Concatenate all the information into a single prompt
            prompt_msg = self._prefix
            prompt_msg += f"'''{self._user_prompt}''', "
            prompt_msg += "based on the receipts information given below:\n"
            prompt_msg += response.text
            prompt_msg += "\nIf there is no question, "
            prompt_msg += "just reply with the message delimited with "
            prompt_msg += "triple backticks as a chatbot."
            prompt_msg += "\nPlease do not include the triple backticks in your message."

            # Send the concatenated prompt to GPT for analysis
            analysis_result = self.prompt_gpt(prompt_msg)
            return analysis_result
        else:
            return f"Error: {response.status_code}"


# Example Usage
if __name__ == "__main__":
    # user_prompt = "Please let me know if I bought anything on '2020-01-02'."
    user_prompt = "What is the main category I spent the most on? Remember to sum up all the amounts for each main category."
    advisor_bot = AdvisorBot(user_prompt)
    user_id = "7hTsAeSu1e2JOKJEEfr4Ng"
    analysis_result = advisor_bot.fetch_and_analyze_receipt(user_id)
    print(analysis_result)
