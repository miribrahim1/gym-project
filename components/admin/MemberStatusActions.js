"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { updateMemberAction } from "@/lib/actions/adminCrud";

export default function MemberStatusActions({ member }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(status) {
    startTransition(async () => {
      await updateMemberAction(member.id, { status });
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {member.status !== "active" ? (
        <Button size="sm" variant="secondary" disabled={pending} onClick={() => setStatus("active")} icon={pending ? Loader2 : undefined}>
          Activate
        </Button>
      ) : (
        <Button size="sm" variant="secondary" disabled={pending} onClick={() => setStatus("inactive")} icon={pending ? Loader2 : undefined}>
          Deactivate
        </Button>
      )}
    </div>
  );
}
