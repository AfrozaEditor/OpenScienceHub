import { Suspense } from "react";
import CredentialOfferClient from "@/components/ui/createCredentialOffer";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CredentialOfferClient />
    </Suspense>
  );
}
