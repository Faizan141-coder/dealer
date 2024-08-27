from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from shortuuid.django_fields import ShortUUIDField
from django.db.models.signals import post_save
from django.dispatch import receiver
from uuid import uuid4
from django.utils.text import slugify


class User(AbstractUser):
    username = models.CharField(max_length=500, null=True, blank=True)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=500, null=True, blank=True)
    phone = models.CharField(max_length=500)
    is_active = models.BooleanField(default=True)
    is_client = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        email_username, mobile = self.email.split("@")

        if not self.full_name:
            self.full_name = email_username
        if not self.username:
            self.username = email_username

        super(User, self).save(*args, **kwargs)


class Profile(models.Model):

    STATE = [
        ("NY", "New York"),
        ("CA", "California"),
        ("TX", "Texas"),
        # Add other states as needed
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to="accounts/users",
        default="default/default-user.jpg",
        null=True,
        blank=True,
    )
    full_name = models.CharField(max_length=1000, null=True, blank=True)
    company_name = models.CharField(max_length=1000, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    address = models.CharField(max_length=1000, null=True, blank=True)
    country = models.CharField(max_length=1000, null=True, blank=True)
    state = models.CharField(choices=STATE, default="TX", max_length=100)
    city = models.CharField(max_length=500, null=True, blank=True)
    zip_code = models.CharField(max_length=1000, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    pid = ShortUUIDField(
        unique=True, length=10, max_length=20, alphabet="abcdefghijklmnopqrstuvxyz"
    )

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return self.full_name if self.full_name else self.user.full_name

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = self.user.full_name
        super(Profile, self).save(*args, **kwargs)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


# from django.db import models
# from django.contrib.auth.models import AbstractUser
# from shortuuid.django_fields import ShortUUIDField
# from django.db.models.signals import post_save


# class User(AbstractUser):
#     username = models.CharField(max_length=500, null=True, blank=True)
#     email = models.EmailField(unique=True)
#     full_name = models.CharField(max_length=500, null=True, blank=True)
#     phone = models.CharField(max_length=500)
#     is_active = models.BooleanField(default=True)
#     is_client = models.BooleanField(default=False)
#     is_staff = models.BooleanField(default=False)
#     is_superuser = models.BooleanField(default=False)
#     date_joined = models.DateTimeField(auto_now_add=True)
#     is_approved = models.BooleanField(default=False)
#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = ["username"]

#     def __str__(self):
#         return self.email

#     def save(self, *args, **kwargs):
#         email_username, mobile = self.email.split("@")

#         if self.full_name == "" or self.full_name == None:
#             self.full_name = email_username
#         if self.username == "" or self.username == None:
#             self.username = email_username

#         super(User, self).save(*args, **kwargs)


# class Profile(models.Model):

#     STATE = [
#         ("NY", "New York"),
#         ("CA", "California"),
#         ("TX", "Texas"),
#         # Add other states as needed
#     ]

#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     image = models.ImageField(
#         upload_to="accounts/users",
#         default="default/default-user.jpg",
#         null=True,
#         blank=True,
#     )
#     full_name = models.CharField(max_length=1000, null=True, blank=True)
#     company_name = models.CharField(max_length=1000, null=True, blank=True)
#     about = models.TextField(null=True, blank=True)
#     address = models.CharField(max_length=1000, null=True, blank=True)
#     country = models.CharField(max_length=1000, null=True, blank=True)
#     state = models.CharField(choices=STATE, default="TX", max_length=100)
#     city = models.CharField(max_length=500, null=True, blank=True)
#     zip_code = models.CharField(max_length=1000, null=True, blank=True)
#     date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
#     pid = ShortUUIDField(
#         unique=True, length=10, max_length=20, alphabet="abcdefghijklmnopqrstuvxyz"
#     )

#     class Meta:
#         ordering = ["-date"]

#     def __str__(self):
#         if self.full_name:
#             return str(self.full_name)
#         else:
#             return str(self.user.full_name)

#     def save(self, *args, **kwargs):

#         if self.full_name == None:
#             self.full_name = self.user.full_name

#         super(Profile, self).save(*args, **kwargs)


# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)


# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()


# post_save.connect(create_user_profile, sender=User)
# post_save.connect(save_user_profile, sender=User)
