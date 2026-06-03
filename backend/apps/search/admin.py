from django.contrib import admin

from .models import FacetDefinition, SearchFacetValue, SearchIndexEntry

admin.site.register(SearchIndexEntry)
admin.site.register(FacetDefinition)
admin.site.register(SearchFacetValue)
