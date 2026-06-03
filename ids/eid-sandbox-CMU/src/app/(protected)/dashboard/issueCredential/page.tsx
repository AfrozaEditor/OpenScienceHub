"use client";

import { ActionCard } from "@/components/ui/actionCard";
import { useRouter } from "next/navigation";
import { ISSUE_CREDENTIAL_CARDS } from "@/config/cardConfig";

export default function IssuerCredential() {
  const router = useRouter();

  return (
    <div className="-m-6 flex w-[calc(100%+48px)] min-h-screen bg-white">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-4 md:px-8 py-8">
          {/* Page Header */}

          {/* Quick Actions */}
          <h2 className="text-base font-bold text-[#111827] mb-4">
            Quick Actions
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-auto sm:grid-cols-2 lg:grid-cols-auto gap-4 max-w-250">
            {ISSUE_CREDENTIAL_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <ActionCard
                  key={card.title}
                  label={card.title}
                  bg={card.color}
                  icon={<Icon size={20} color={card.iconColor} />}
                  onClick={() => router.push(card.link)}
                />
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
