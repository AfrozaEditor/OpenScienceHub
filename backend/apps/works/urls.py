from rest_framework.routers import DefaultRouter

from .views import ScientificWorkViewSet

router = DefaultRouter(trailing_slash=False)
router.register("works", ScientificWorkViewSet, basename="work")

urlpatterns = router.urls
