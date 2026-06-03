from django.urls import path

from .views import (
    ProofReissueView,
    ProofRevokeView,
    SsiConnectionView,
    SsiTestConnectionView,
    VerifyView,
    WorkProofView,
)

urlpatterns = [
    path("verify/<str:proof_code>", VerifyView.as_view(), name="verify"),
    path("works/<uuid:work_id>/proof", WorkProofView.as_view(), name="work-proof"),
    path("ssi/proofs/<uuid:pk>/revoke", ProofRevokeView.as_view(), name="proof-revoke"),
    path("ssi/proofs/<uuid:pk>/reissue", ProofReissueView.as_view(), name="proof-reissue"),
    path("admin/ssi/connection", SsiConnectionView.as_view(), name="ssi-connection"),
    path("admin/ssi/test-connection", SsiTestConnectionView.as_view(), name="ssi-test-connection"),
]
