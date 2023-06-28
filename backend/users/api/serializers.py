from rest_framework import serializers

from users.models import Profile
from listings.models import Listings

from listings.API.serializers import ListingSerializer


class ProfileSerializer(serializers.ModelSerializer):
    seller_listings = serializers.SerializerMethodField()

    def get_seller_listings(self, obj):
        query = Listings.objects.filter(seller=obj.seller)
        listings_serialized = ListingSerializer(query, many=True)
        return listings_serialized.data

    class Meta:
        model = Profile
        fields = "__all__"
