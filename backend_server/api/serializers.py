from rest_framework import serializers
from .models import User, Receipt


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['_id', 'name', 'email', 'password',
                  'main_categories_exp', 'sub_categories_exp', 'past_exp']
        extra_kwargs = {
            'password': {'write_only': True},
            # Don't want to allow manual setting of _id
            '_id': {'read_only': True}
        }


class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = ['_id', 'user_id', 'amount', 'time',
                  'sub_category', 'main_category', 'image']
        extra_kwargs = {
            # _id is auto-generated and should not be manually set
            '_id': {'read_only': True}
        }
