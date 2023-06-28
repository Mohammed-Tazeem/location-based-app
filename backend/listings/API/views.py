from .serializers import ListingSerializer
from listings.models import Listings

from rest_framework import generics
from django.http import HttpResponse


class ListingList(generics.ListAPIView):
    queryset = Listings.objects.all()
    serializer_class = ListingSerializer


class ListingCreate(generics.CreateAPIView):
    queryset = Listings.objects.all()
    serializer_class = ListingSerializer


class ListingDetail(generics.RetrieveAPIView):
    queryset = Listings.objects.all()
    serializer_class = ListingSerializer


class ListingDelete(generics.DestroyAPIView):
    queryset = Listings.objects.all()
    serializer_class = ListingSerializer


class ListingUpdate(generics.UpdateAPIView):
    queryset = Listings.objects.all()
    serializer_class = ListingSerializer


def home(request):
    return HttpResponse("<html><body><h1>Welcome to my website</h1></body></html>")
