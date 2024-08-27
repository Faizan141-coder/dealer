from django.core.mail import send_mail
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from shortuuid.django_fields import ShortUUIDField
from django.db.models.signals import post_save
from django.dispatch import receiver
from uuid import uuid4
from django.utils.text import slugify
from django.urls import reverse

from store.models import Order
from userauths.models import User, Profile


class Invoice(models.Model):

    TERMS = [
        ("Due on Receipt", "Due on Receipt"),
        ("NET 14", "NET 14 days"),
        ("NET 30 days", "30 days"),
        ("NET 60 days", "60 days"),
    ]

    STATUS = [
        ("CURRENT", "CURRENT"),
        ("EMAIL_SENT", "EMAIL_SENT"),
        ("OVERDUE", "OVERDUE"),
        ("PAID", "PAID"),
    ]

    title = models.CharField(null=True, blank=True, max_length=100)
    number = models.CharField(null=True, blank=True, max_length=100)
    dueDate = models.DateField(null=True, blank=True, default=timezone.now)
    paymentTerms = models.CharField(choices=TERMS, default="14 days", max_length=100)
    status = models.CharField(choices=STATUS, default="CURRENT", max_length=100)
    notes = models.TextField(null=True, blank=True)
    client = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice', null=True, blank=True)
    # orders = models.ManyToManyField(Order, related_name='invoices', blank=True)
    # Utility fields
    uniqueId = models.CharField(null=True, blank=True, max_length=100)
    slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.number:
            self.number = self.generate_invoice_number()
        if not self.date_created:
            self.date_created = timezone.now()
        self.last_updated = timezone.now()
        super().save(*args, **kwargs)

    def generate_invoice_number(self):
        import uuid
        return str(uuid.uuid4()).split('-')[0].upper()

    def client_full_name(self):
        return self.client.full_name if self.client else "No client"

    def client_company_name(self):
        profile = Profile.objects.get(user=self.client)
        return (
            profile.company_name if profile and profile.company_name else "No company"
        )


    def __str__(self):
        return f"Invoice {self.id} - {self.client_full_name()}"


class Product(models.Model):
    CURRENCY = [
        ("$", "USD"),
    ]

    title = models.CharField(null=True, blank=True, max_length=100)
    description = models.TextField(null=True, blank=True)
    quantity = models.FloatField(null=True, blank=True)
    price = models.FloatField(null=True, blank=True)
    currency = models.CharField(choices=CURRENCY, default="$", max_length=100)
    invoice = models.ForeignKey(
        Invoice, blank=True, null=True, on_delete=models.CASCADE
    )
    uniqueId = models.CharField(null=True, blank=True, max_length=100)
    slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title} {self.uniqueId}"

    def get_absolute_url(self):
        return reverse("product-detail", kwargs={"slug": self.slug})

    def save(self, *args, **kwargs):
        if self.date_created is None:
            self.date_created = timezone.localtime(timezone.now())
        if self.uniqueId is None:
            self.uniqueId = str(uuid4()).split("-")[4]
            self.slug = slugify(f"{self.title} {self.uniqueId}")

        self.slug = slugify(f"{self.title} {self.uniqueId}")
        self.last_updated = timezone.localtime(timezone.now())
        super(Product, self).save(*args, **kwargs)


class Setting(models.Model):

    STATES = [
        ("NY", "New York"),
        ("CA", "California"),
        ("TX", "Texas"),
    ]

    clientName = models.CharField(null=True, blank=True, max_length=200)
    clientLogo = models.ImageField(
        default="default_logo.jpg", upload_to="company_logos"
    )
    addressLine1 = models.CharField(null=True, blank=True, max_length=200)
    states = models.CharField(choices=STATES, blank=True, max_length=100)
    zip_code = models.CharField(null=True, blank=True, max_length=10)
    phoneNumber = models.CharField(null=True, blank=True, max_length=100)
    emailAddress = models.CharField(null=True, blank=True, max_length=100)
    taxNumber = models.CharField(null=True, blank=True, max_length=100)
    uniqueId = models.CharField(null=True, blank=True, max_length=100)
    slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
    date_created = models.DateTimeField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.clientName} {self.states} {self.uniqueId}"

    def get_absolute_url(self):
        return reverse("setting-detail", kwargs={"slug": self.slug})

    def save(self, *args, **kwargs):
        if self.date_created is None:
            self.date_created = timezone.localtime(timezone.now())
        if self.uniqueId is None:
            self.uniqueId = str(uuid4()).split("-")[4]
            self.slug = slugify(f"{self.clientName} {self.states} {self.uniqueId}")

        self.slug = slugify(f"{self.clientName} {self.states} {self.uniqueId}")
        self.last_updated = timezone.localtime(timezone.now())
        super(Setting, self).save(*args, **kwargs)


# from django.db import models
# from django.template.defaultfilters import slugify
# from django.utils import timezone
# from uuid import uuid4

# from django.urls import reverse
# from userauths.models import User


# class Invoice(models.Model):
#     TERMS = [
#         ("14 days", "14 days"),
#         ("30 days", "30 days"),
#         ("60 days", "60 days"),
#     ]

#     STATUS = [
#         ("CURRENT", "CURRENT"),
#         ("EMAIL_SENT", "EMAIL_SENT"),
#         ("OVERDUE", "OVERDUE"),
#         ("PAID", "PAID"),
#     ]

#     title = models.CharField(null=True, blank=True, max_length=100)
#     number = models.CharField(null=True, blank=True, max_length=100)
#     dueDate = models.DateField(null=True, blank=True)
#     paymentTerms = models.CharField(choices=TERMS, default="14 days", max_length=100)
#     status = models.CharField(choices=STATUS, default="CURRENT", max_length=100)
#     notes = models.TextField(null=True, blank=True)

#     # RELATED fields
#     client = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)

#     # Utility fields
#     uniqueId = models.CharField(null=True, blank=True, max_length=100)
#     slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
#     date_created = models.DateTimeField(blank=True, null=True)
#     last_updated = models.DateTimeField(blank=True, null=True)

#     def __str__(self):
#         return "{} {}".format(self.number, self.uniqueId)

#     def get_absolute_url(self):
#         return reverse("invoice-detail", kwargs={"slug": self.slug})

#     def save(self, *args, **kwargs):
#         if self.date_created is None:
#             self.date_created = timezone.localtime(timezone.now())
#         if self.uniqueId is None:
#             self.uniqueId = str(uuid4()).split("-")[4]
#             self.slug = slugify("{} {}".format(self.number, self.uniqueId))

#         self.slug = slugify("{} {}".format(self.number, self.uniqueId))
#         self.last_updated = timezone.localtime(timezone.now())

#         super(Invoice, self).save(*args, **kwargs)


# class Product(models.Model):
#     CURRENCY = [
#         ("$", "USD"),
#     ]

#     title = models.CharField(null=True, blank=True, max_length=100)
#     description = models.TextField(null=True, blank=True)
#     quantity = models.FloatField(null=True, blank=True)
#     price = models.FloatField(null=True, blank=True)
#     currency = models.CharField(choices=CURRENCY, default="R", max_length=100)

#     # Related Fields
#     invoice = models.ForeignKey(
#         Invoice, blank=True, null=True, on_delete=models.CASCADE
#     )

#     # Utility fields
#     uniqueId = models.CharField(null=True, blank=True, max_length=100)
#     slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
#     date_created = models.DateTimeField(blank=True, null=True)
#     last_updated = models.DateTimeField(blank=True, null=True)

#     def __str__(self):
#         return "{} {}".format(self.title, self.uniqueId)

#     def get_absolute_url(self):
#         return reverse("product-detail", kwargs={"slug": self.slug})

#     def save(self, *args, **kwargs):
#         if self.date_created is None:
#             self.date_created = timezone.localtime(timezone.now())
#         if self.uniqueId is None:
#             self.uniqueId = str(uuid4()).split("-")[4]
#             self.slug = slugify("{} {}".format(self.title, self.uniqueId))

#         self.slug = slugify("{} {}".format(self.title, self.uniqueId))
#         self.last_updated = timezone.localtime(timezone.now())

#         super(Product, self).save(*args, **kwargs)


# class Setting(models.Model):

#     STATES = [
#         ("NY", "New York"),
#         ("CA", "California"),
#         ("TX", "Texas"),
#     ]

#     # Basic Fields
#     clientName = models.CharField(null=True, blank=True, max_length=200)
#     clientLogo = models.ImageField(
#         default="default_logo.jpg", upload_to="company_logos"
#     )
#     addressLine1 = models.CharField(null=True, blank=True, max_length=200)
#     states = models.CharField(choices=STATES, blank=True, max_length=100)
#     zip_code = models.CharField(null=True, blank=True, max_length=10)
#     phoneNumber = models.CharField(null=True, blank=True, max_length=100)
#     emailAddress = models.CharField(null=True, blank=True, max_length=100)
#     taxNumber = models.CharField(null=True, blank=True, max_length=100)

#     # Utility fields
#     uniqueId = models.CharField(null=True, blank=True, max_length=100)
#     slug = models.SlugField(max_length=500, unique=True, blank=True, null=True)
#     date_created = models.DateTimeField(blank=True, null=True)
#     last_updated = models.DateTimeField(blank=True, null=True)

#     def __str__(self):
#         return "{} {} {}".format(self.clientName, self.states, self.uniqueId)

#     def get_absolute_url(self):
#         return reverse("setting-detail", kwargs={"slug": self.slug})

#     def save(self, *args, **kwargs):
#         if self.date_created is None:
#             self.date_created = timezone.localtime(timezone.now())
#         if self.uniqueId is None:
#             self.uniqueId = str(uuid4()).split("-")[4]
#             self.slug = slugify(
#                 "{} {} {}".format(self.clientName, self.states, self.uniqueId)
#             )

#         self.slug = slugify(
#             "{} {} {}".format(self.clientName, self.states, self.uniqueId)
#         )
#         self.last_updated = timezone.localtime(timezone.now())

#         super(Setting, self).save(*args, **kwargs)
