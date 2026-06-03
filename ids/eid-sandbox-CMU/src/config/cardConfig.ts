import {
  FilePlus2,
  KeyRound,
  FileSearch2,
  ShieldCheck,
} from "lucide-react";

export const ISSUE_CREDENTIAL_CARDS = [
  {
    title: "Create a Schema",

    color: "#FEF3C7",          // amber-100
    iconColor: "#D97706",      // amber-600
    icon: FilePlus2,
    link: "/dashboard/issueCredential/create-schema",
  },
  {
    title: "Create Credential Definition",
    color: "#F3E8FF",          // purple-100
    iconColor: "#7C3AED",      // purple-600
    icon: KeyRound,
    link: "/dashboard/issueCredential/create-credential",
  },
  {
    title: "Use Existing Schema",
    color: "#EFF6FF",          // blue-100
    iconColor: "#2563EB",      // blue-600
    icon: FileSearch2,
    link: "/dashboard/issueCredential/existing-schema",

  },
  {
    title: "Use Existing Credential Definition",
    color: "#ECFDF5",          // green-100
    iconColor: "#059669",      // green-600
    icon: ShieldCheck,
    link: "/dashboard/issueCredential/existing-credential",
  },
  {
    title: "Issue Credential",
    color: "#ECFDF5",          // green-100
    iconColor: "#059669",      // green-600
    icon: FileSearch2,
    link: "/dashboard/issueCredential/createOffer",
  },
];
