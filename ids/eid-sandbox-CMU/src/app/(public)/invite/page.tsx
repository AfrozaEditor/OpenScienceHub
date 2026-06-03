 import { Suspense } from "react";
import InviteRedirectClient from "./invite";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <InviteRedirectClient />
    </Suspense>
  );
}
