from django.db import models
from django.utils.safestring import mark_safe
from django.core.serializers.json import DjangoJSONEncoder
from django.http import JsonResponse
import datetime
import json
import secrets


def generate_random_id():
    return secrets.token_urlsafe(16)  # Adjust length as needed.


def default_categories():
    return {
        'Food': float(0),
        'Housing': float(0),
        'Transportation': float(0),
        'Utilities': float(0),
        'Shopping': float(0),
        'Medical': float(0),
        'Entertainment': float(0),
        'Miscellaneous': float(0)
    }


def past_six_months():
    return {
        'Nov': float(0),
        'Dec': float(0),
        'Jan': float(0),
        'Feb': float(0),
        'Mar': float(0),
        'Apr': float(0)
    }


# Model Definitions
class User(models.Model):
    _id = models.CharField(primary_key=True, max_length=32,
                           default=generate_random_id, unique=True,
                           editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=100)
    main_categories_exp = models.JSONField(blank=True,
                                           default=default_categories)
    sub_categories_exp = models.JSONField(blank=True, default=dict)
    past_exp = models.JSONField(blank=True, default=past_six_months)


class Receipt(models.Model):
    _id = models.CharField(primary_key=True, max_length=32,
                           default=generate_random_id, unique=True,
                           editable=False)
    user_id = models.CharField(max_length=255, blank=False, null=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    time = models.CharField(max_length=255, blank=True, null=True)
    sub_category = models.CharField(max_length=255, blank=True, null=True)
    main_category = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
