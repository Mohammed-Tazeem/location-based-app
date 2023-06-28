from django.contrib import admin
from listings.models import Listings
from listings.models import Poi

from .forms import PoisForm


class PoiAdmin(admin.ModelAdmin):
    form = PoisForm


admin.site.register(Listings)
admin.site.register(Poi, PoiAdmin)

# Register your models here.
