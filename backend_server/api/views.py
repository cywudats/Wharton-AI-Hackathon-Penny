from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Receipt, User
from .serializers import UserSerializer, ReceiptSerializer
import datetime
from receipt_categorizer import ReceiptCategorizer
from dotenv import load_dotenv
from receipt import Receipt as CustomReceipt
from advisorbot import AdvisorBot
import os

# ----------------- Users -----------------

# User registration endpoint '/user'
# data in request body (sample):
# {
#     "email": "123@gmail.com",
#     "password": "123",
#     "name": "Norris Chen"
# }


@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get User (login) endpoint '/user/login/?email=<email>&password=<password>'
# Get a user by email and password


@api_view(['GET'])
def user_login(request):
    email = request.query_params.get('email')
    password = request.query_params.get('password')

    if not email or not password:
        return Response({'error': 'Please provide both email and password'},
                        status=status.HTTP_400_BAD_REQUEST)
    try:
        # Attempt to retrieve the user by email
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # No user was found with this email
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if the provided password matches the stored password
    if password == user.password:
        # Password is correct, return user info (excluding the password)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        # Password is incorrect
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# ----------------- Receipts -----------------

# Get receipt endpoint "/receipt/?user_id=<user_id>"
# Get all the receipts of a user (order by (time, main_category))


@api_view(['GET'])
def get_receipts(request):
    user_id = request.query_params.get('user_id')
    if not user_id:
        return Response({'error': 'Please provide the user_id'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Attempt to retrieve the receipt by user_id
    receipts = Receipt.objects.filter(
        user_id=user_id).order_by('-time', 'main_category')

    # Password is correct, return the receipts
    serializer = ReceiptSerializer(receipts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Post receipt endpoint "/receipt/confirm"
# This should be called after the user confirms the receipt details
# data in request body (sample):
# {
#     "user_id": "_o78TEkLZaULV55FyBcGVw",
#     "amount": 49.99,
#     "time": "2024-04-08T15:26:43Z",
#     "sub_category": "Groceries",
#     "main_category": "Food",
#     "image": "image_url_1.jpg"
# }


@api_view(['POST'])
def create_receipt(request):
    # Extract the data from the request
    user_id = request.data.get('user_id')
    amount = request.data.get('amount')
    receipt_time = request.data.get('time')
    sub_category = request.data.get('sub_category')
    main_category = request.data.get('main_category')

    try:
        # Retrieve the user
        user = User.objects.get(_id=user_id)

        # Initialize the dictionaries if they are not set
        user.sub_categories_exp = user.sub_categories_exp or {}
        user.main_categories_exp = user.main_categories_exp or {}
        user.past_exp = user.past_exp or {}

        # Convert amount to Decimal if it's not already
        amount = float(amount)

        # Update user categories/past expense
        user.sub_categories_exp[sub_category] = user.sub_categories_exp.get(
            sub_category, 0) + amount
        user.main_categories_exp[main_category] = user.main_categories_exp.get(
            main_category, 0) + amount
        user.past_exp['Apr'] = user.past_exp.get('Apr', 0) + amount
        user.save()

        newReceipt = Receipt(
            user_id=user_id,
            amount=amount,
            time=receipt_time,
            sub_category=sub_category,
            main_category=main_category,
            image=request.data.get('image')
        )

        newReceipt.save()

        # Create the receipt
        serializer = ReceiptSerializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.data,
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({'error': 'User not found'},
                        status=status.HTTP_404_NOT_FOUND)

# Post receipt endpoint "/receipt/upload/?user_id=<user_id>"
# This should be called when the user uploads a receipt
# data in request body: 'image' -> this needs to be in "form data", refer to the frontend code below

# const formData = new FormData();
#     formData.append('image', file); // Append the file to the form data
# const response = await fetch('/api/upload_receipt', {
#         method: 'POST',
#         body: formData, // Send the form data as the request body
#         // No need to set the Content-Type header, as fetch will set it automatically for FormData
#       });


@api_view(['POST'])
def upload_receipt(request):

    input_user_id = request.query_params.get('user_id')

    if not input_user_id:
        return Response({'error': 'Please provide the user_id'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Check if the image is in the request
    if 'image' not in request.FILES:
        return Response({'error': 'Please provide an image file'},
                        status=status.HTTP_400_BAD_REQUEST)

    image = request.FILES['image']

    # get the user and its subcategories
    user = User.objects.get(_id=input_user_id)
    sub_categories = user.sub_categories_exp.keys()
    categories_set = set(sub_categories)

    # Read the API Key from environment variable
    load_dotenv()

    # Create an instance of the ReceiptCategorizer class
    categorizer = ReceiptCategorizer(
        image_file=image, sub_category_set=categories_set)
    receipt = categorizer.categorize_receipt()

    if receipt is None:
        return Response({'error': 'Not a receipt'},
                        status=status.HTTP_400_BAD_REQUEST)

    new_receipt = Receipt(
        user_id=input_user_id,
        amount=receipt.get_total_expense(),
        time=receipt.get_date(),
        sub_category=receipt.get_sub_category().capitalize(),
        main_category=receipt.get_main_category(),
        image=receipt.get_receipt_file()
    )

    serializer = ReceiptSerializer(new_receipt)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

# ----------------- Chatbot -----------------

# Post chatbot endpoint "/chatbot/?user_id=<user_id>"
# data in request body -> {message:(string)}


@api_view(['POST'])
def upload_message(request):
    load_dotenv()

    # Get all the receipts
    user_id = request.query_params.get('user_id')
    message = request.data.get('message')

    if not user_id:
        return Response({'error': 'Please provide the user_id'},
                        status=status.HTTP_400_BAD_REQUEST)

    advisor_bot = AdvisorBot(message)
    analysis_result = advisor_bot.fetch_and_analyze_receipt(user_id)

    return Response({'message': analysis_result}, status=status.HTTP_200_OK)
