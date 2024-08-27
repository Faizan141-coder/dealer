from userauths.models import Profile, User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    # Define a custom method to get the token for a user
    def get_token(cls, user):
        # Call the parent class's get_token method
        token = super().get_token(user)

        # Add custom claims to the token
        token["full_name"] = user.full_name
        token["email"] = user.email
        token["username"] = user.username
        try:
            token["vendor_id"] = user.vendor.id
        except:
            token["vendor_id"] = 0

        # ...

        # Return the token with custom claims
        return token


class RegisterSerializer(serializers.ModelSerializer):
    # Define fields for the serializer, including password and password2
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        # Specify the model that this serializer is associated with
        model = User
        # Define the fields from the model that should be included in the serializer
        fields = (
            "full_name",
            "email",
            "phone",
            # "company",
            # "ein_number",
            # "tax_id",
            # "country",
            # "city",
            # "state",
            # "address",
            # "zip_code",
            "password",
            "password2",
        )

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        # Return the validated attributes
        return attrs

    def create(self, validated_data):
        # Define a method to create a new user based on validated data
        user = User.objects.create(
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            phone=validated_data["phone"],
            # company=validated_data["company"],
            # ein_number=validated_data["ein_number"],
            # tax_id=validated_data["tax_id"],
            # country=validated_data["country"],
            # city=validated_data["city"],
            # state=validated_data["state"],
            # address=validated_data["address"],
            # zip_code=validated_data["zip_code"],
        )
        email_username, mobile = user.email.split("@")
        user.username = email_username

        # Set the user's password based on the validated data
        user.set_password(validated_data["password"])
        user.save()

        # Return the created user
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"

    # def __init__(self, *args, **kwargs):
    #     super(ProfileSerializer, self).__init__(*args, **kwargs)
    #     # Customize serialization depth based on the request method.
    #     request = self.context.get('request')
    #     if request and request.method == 'POST':
    #         # When creating a new product FAQ, set serialization depth to 0.
    #         self.Meta.depth = 0
    #     else:
    #         # For other methods, set serialization depth to 3.
    #         self.Meta.depth = 3

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["user"] = UserSerializer(instance.user).data
        return response


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['company_name', 'address', 'country', 'state', 'city', 'zip_code']


class UserRegistrationSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'phone', 'password', 'confirm_password', 'profile']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        Profile.objects.filter(user=user).update(**profile_data)

        return user
