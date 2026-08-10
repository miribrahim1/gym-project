"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { Label, Input, Textarea, Select, FieldGroup, FieldError } from "@/components/ui/FormField";

// Columns are plain data descriptors (key/format), never functions — this
// component is a Client Component and receives `columns`/`items` from Server
// Component pages, so any function props would fail to serialize across
// that boundary. Formatting logic below runs entirely client-side instead.
function formatCell(item, col) {
  const value = item[col.key];
  if (value === undefined || value === null || value === "") return "—";
  switch (col.format) {
    case "currency":
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
    case "truncate":
      return String(value).length > 60 ? `${String(value).slice(0, 60)}…` : String(value);
    case "list":
      return Array.isArray(value) ? value.join(", ") : value;
    case "date":
      return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    case "badge":
      return value;
    case "fraction":
      return `${item[col.key]} / ${item[col.denominatorKey]}`;
    case "suffix":
      return `${value}${col.suffix || ""}`;
    default:
      return String(value);
  }
}

function toFormValue(field, item) {
  const raw = item?.[field.name];
  if (field.type === "tags") return Array.isArray(raw) ? raw.join(", ") : "";
  if (field.type === "checkbox") return !!raw;
  return raw ?? "";
}

function buildInitialForm(fields, item) {
  const form = {};
  for (const field of fields) form[field.name] = toFormValue(field, item);
  return form;
}

function parseFormValues(fields, form) {
  const data = {};
  for (const field of fields) {
    const value = form[field.name];
    if (field.type === "number") data[field.name] = value === "" ? 0 : Number(value);
    else if (field.type === "checkbox") data[field.name] = !!value;
    else if (field.type === "tags") data[field.name] = value ? value.split(",").map((v) => v.trim()).filter(Boolean) : [];
    else data[field.name] = value;
  }
  return data;
}

export default function CrudManager({
  title,
  description,
  items,
  columns,
  fields,
  actions,
  searchKeys = [],
  emptyIcon = "Inbox",
  itemLabel = "item",
  extraAction,
  detailHrefTemplate,
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [pending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    if (!search || searchKeys.length === 0) return items;
    const q = search.toLowerCase();
    return items.filter((item) => searchKeys.some((key) => String(item[key] ?? "").toLowerCase().includes(q)));
  }, [items, search, searchKeys]);

  function openCreate() {
    setEditingItem(null);
    setForm(buildInitialForm(fields, null));
    setErrors({});
    setServerError("");
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setForm(buildInitialForm(fields, item));
    setErrors({});
    setServerError("");
    setModalOpen(true);
  }

  function update(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};
    for (const field of fields) {
      if (field.required && !form[field.name]) nextErrors[field.name] = `${field.label} is required`;
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    const data = parseFormValues(fields, form);
    setServerError("");
    startTransition(async () => {
      try {
        if (editingItem) {
          await actions.update(editingItem.id, data);
        } else {
          await actions.create(data);
        }
        setModalOpen(false);
        router.refresh();
      } catch (err) {
        setServerError(err?.message || "Something went wrong. Please try again.");
      }
    });
  }

  function handleDelete(item) {
    if (!window.confirm(`Delete this ${itemLabel}? This cannot be undone.`)) return;
    setDeletingId(item.id);
    startTransition(async () => {
      await actions.remove(item.id);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <div>
      <PageTop title={title} description={description} onAdd={openCreate} itemLabel={itemLabel} extraAction={extraAction} />

      {searchKeys.length ? (
        <div className="relative mb-5 w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-bone-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${itemLabel}s…`}
            className="w-full rounded-full border border-ink-600 bg-ink-900/60 py-2.5 pl-10 pr-4 text-sm text-bone-100 placeholder:text-bone-500 focus:border-gold-500/60 focus:outline-none"
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState icon={emptyIcon} title={`No ${itemLabel}s found`} description={search ? "Try a different search term." : `Get started by adding a new ${itemLabel}.`} action={<Button onClick={openCreate} icon={Plus}>Add {itemLabel}</Button>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink-700">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-700 bg-ink-900/60 text-left text-xs uppercase tracking-wider text-bone-500">
                {columns.map((col) => (
                  <th key={col.key} className="px-5 py-3.5 font-medium">{col.label}</th>
                ))}
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-700 bg-ink-900/30">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-ink-800/40">
                  {columns.map((col, colIndex) => (
                    <td key={col.key} className="px-5 py-3.5 text-bone-200">
                      {colIndex === 0 && detailHrefTemplate ? (
                        <Link href={detailHrefTemplate.replace("{id}", item.id)} className="font-medium text-gold-400 hover:underline">
                          {formatCell(item, col)}
                        </Link>
                      ) : (
                        formatCell(item, col)
                      )}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" onClick={() => openEdit(item)} aria-label="Edit" className="flex size-8 items-center justify-center rounded-lg text-bone-400 hover:bg-ink-700 hover:text-gold-400">
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={pending && deletingId === item.id}
                        aria-label="Delete"
                        className="flex size-8 items-center justify-center rounded-lg text-bone-400 hover:bg-ember-500/10 hover:text-ember-500"
                      >
                        {pending && deletingId === item.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? `Edit ${itemLabel}` : `Add ${itemLabel}`} size="lg">
        <form onSubmit={handleSubmit}>
          {serverError ? <p className="mb-4 text-sm text-ember-500">{serverError}</p> : null}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            {fields.map((field) => (
              <FieldGroup key={field.name} className={field.span === "full" ? "sm:col-span-2" : ""}>
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea id={field.name} value={form[field.name] ?? ""} error={errors[field.name]} onChange={(e) => update(field.name, e.target.value)} placeholder={field.placeholder} />
                ) : field.type === "select" ? (
                  <Select id={field.name} value={form[field.name] ?? ""} error={errors[field.name]} onChange={(e) => update(field.name, e.target.value)}>
                    <option value="">Select…</option>
                    {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </Select>
                ) : field.type === "checkbox" ? (
                  <label className="flex items-center gap-2 pt-2 text-sm text-bone-300">
                    <input type="checkbox" checked={!!form[field.name]} onChange={(e) => update(field.name, e.target.checked)} className="size-4 rounded border-ink-600 bg-ink-900 accent-gold-500" />
                    {field.checkboxLabel || "Enabled"}
                  </label>
                ) : (
                  <Input id={field.name} type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={form[field.name] ?? ""} error={errors[field.name]} onChange={(e) => update(field.name, e.target.value)} placeholder={field.placeholder} />
                )}
                {field.hint ? <p className="mt-1 text-xs text-bone-600">{field.hint}</p> : null}
                <FieldError>{errors[field.name]}</FieldError>
              </FieldGroup>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending} icon={pending ? Loader2 : undefined} className={pending ? "[&_svg]:animate-spin" : ""}>
              {pending ? "Saving…" : editingItem ? "Save Changes" : `Add ${itemLabel}`}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function PageTop({ title, description, onAdd, itemLabel, extraAction }) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="font-display text-3xl tracking-wide text-bone-50">{title}</h1>
        {description ? <p className="mt-1 text-sm text-bone-500">{description}</p> : null}
      </div>
      <div className="flex gap-2">
        {extraAction}
        <Button onClick={onAdd} icon={Plus}>Add {itemLabel}</Button>
      </div>
    </div>
  );
}
