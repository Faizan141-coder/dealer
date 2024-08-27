# from django.db import models
# from django.template.defaultfilters import slugify
# from django.utils import timezone
# from uuid import uuid4
# from userauths.models import User, Profile
# from django.urls import reverse
# from django.db.models.signals import post_save


# class Client(models.Model):

#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     profile = models.OneToOneField(Profile, on_delete=models.CASCADE)

#     company_name = models.CharField(max_length=255, null=True, blank=True)
#     ein_number = models.CharField(max_length=100, null=True, blank=True)
#     tax_id = models.CharField(max_length=100, null=True, blank=True)
#     # Basic Fields.

#     clientLogo = models.ImageField(
#         default="default_logo.jpg", upload_to="company_logos"
#     )
#     uniqueId = models.CharField(null=True, blank=True, max_length=100)
#     # Utility fields
#     slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
#     date_created = models.DateTimeField(blank=True, null=True)
#     last_updated = models.DateTimeField(blank=True, null=True)

#     def __str__(self):
#         return "{} {} {}".format(self.clientName, self.profile.state, self.uniqueId)

#     def get_absolute_url(self):
#         return reverse("client-detail", kwargs={"slug": self.slug})

#     def save(self, *args, **kwargs):
#         if self.date_created is None:
#             self.date_created = timezone.localtime(timezone.now())
#         if self.uniqueId is None:
#             self.uniqueId = str(uuid4()).split("-")[4]
#             self.slug = slugify(
#                 "{} {} {}".format(self.clientName, self.profile.state, self.uniqueId)
#             )

#         self.slug = slugify(
#             "{} {} {}".format(self.clientName, self.profile.state, self.uniqueId)
#         )
#         self.last_updated = timezone.localtime(timezone.now())

#         super(Client, self).save(*args, **kwargs)


# def create_client(sender, instance, created, **kwargs):
#     if created:
#         Client.objects.create(user=instance)


# def save_client(sender, instance, **kwargs):
#     instance.user.save()


# post_save.connect(create_client, sender=User)
# post_save.connect(save_client, sender=User)
