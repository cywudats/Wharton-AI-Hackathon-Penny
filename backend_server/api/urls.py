from django.urls import path
from .views import register_user, user_login, create_receipt, get_receipts, upload_receipt, upload_message

urlpatterns = [
    path('user', register_user, name='register_user'),
    path('user/login/', user_login, name='user_login'),
    path('receipt/', get_receipts, name='get_receipts'),
    path('receipt/confirm', create_receipt, name='create_receipt'),
    path('receipt/upload/', upload_receipt, name='upload_receipt'),
    path('chatbot/', upload_message, name='upload_message')
]