"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { adminLoginSchema } from "@/lib/validation/schemas";
import { loginAdmin } from "@/lib/actions/auth";
import { Label, Input, FieldError, FieldGroup } from "@/components/ui/FormField";
import Button from "@/components/ui/Button";

export default function AdminLoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const result = adminLoginSchema.safeParse(form);
    if (!result.success) {
      const next = {};
      for (const issue of result.error.issues) next[issue.path[0]] = issue.message;
      setErrors(next);
      return;
    }
    setServerError("");
    startTransition(async () => {
      const res = await loginAdmin(form);
      if (!res.success) {
        setServerError(res.error || "Invalid credentials.");
        if (res.errors) setErrors(res.errors);
        return;
      }
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {serverError ? <p className="mb-4 rounded-lg bg-ember-500/10 px-4 py-3 text-sm text-ember-500">{serverError}</p> : null}
      <FieldGroup>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={form.email} error={errors.email} onChange={(e) => update("email", e.target.value)} placeholder="admin@ironvaultfitness.com" autoComplete="username" />
        <FieldError>{errors.email}</FieldError>
      </FieldGroup>
      <FieldGroup>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={form.password} error={errors.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••"
        autoComplete="current-password" />
        <FieldError>{errors.password}</FieldError>
      </FieldGroup>
      <Button type="submit" disabled={pending} icon={pending ? Loader2 : LogIn} className={"w-full" + (pending ? " [&_svg]:animate-spin" : "")}>
        {pending ? "Signing In…" : "Sign In"}
      </Button>
    </form>
  );
}
