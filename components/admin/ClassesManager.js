"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import CrudManager from "@/components/admin/CrudManager";
import {
  createClassDefinitionAction, updateClassDefinitionAction, deleteClassDefinitionAction,
  createSessionAction, updateSessionAction, deleteSessionAction,
} from "@/lib/actions/adminCrud";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const DEF_FIELDS = [
  { name: "name", label: "Class Name", required: true },
  { name: "difficulty", label: "Difficulty", type: "select", options: DIFFICULTIES, required: true },
  { name: "defaultDuration", label: "Duration (min)", type: "number" },
  { name: "icon", label: "Icon (Lucide name)", placeholder: "Dumbbell" },
  { name: "description", label: "Description", type: "textarea", span: "full" },
];

const DEF_COLUMNS = [
  { key: "name", label: "Class" },
  { key: "difficulty", label: "Difficulty" },
  { key: "defaultDuration", label: "Duration", format: "suffix", suffix: " min" },
];

export default function ClassesManager({ classDefinitions, sessions, trainers }) {
  const [tab, setTab] = useState("types");

  const classOptions = classDefinitions.map((c) => c.slug);
  const trainerOptions = trainers.map((t) => t.slug);

  const sessionFields = [
    { name: "classSlug", label: "Class", type: "select", options: classOptions, required: true },
    { name: "day", label: "Day", type: "select", options: DAYS, required: true },
    { name: "time", label: "Time (24h)", placeholder: "06:00", required: true },
    { name: "trainerSlug", label: "Trainer", type: "select", options: trainerOptions, required: true },
    { name: "capacity", label: "Capacity", type: "number", required: true },
    { name: "booked", label: "Currently Booked", type: "number" },
  ];

  const sessionItems = sessions.map((s) => ({
    ...s,
    classLabel: classDefinitions.find((c) => c.slug === s.classSlug)?.name || s.classSlug,
    trainerLabel: trainers.find((t) => t.slug === s.trainerSlug)?.name || s.trainerSlug,
    occupancy: `${s.booked}/${s.capacity}`,
  }));

  const sessionColumns = [
    { key: "classLabel", label: "Class" },
    { key: "day", label: "Day" },
    { key: "time", label: "Time" },
    { key: "trainerLabel", label: "Trainer" },
    { key: "occupancy", label: "Booked" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl tracking-wide text-bone-50">Classes</h1>
        <p className="mt-1 text-sm text-bone-500">Manage class types and the weekly schedule.</p>
      </div>

      <div role="tablist" className="flex gap-2 border-b border-ink-700 pb-px mb-6">
        {[{ value: "types", label: "Class Types" }, { value: "schedule", label: "Weekly Schedule" }].map((t) => (
          <button
            key={t.value}
            role="tab"
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "-mb-px rounded-t-lg px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2",
              tab === t.value ? "text-gold-400 border-gold-500" : "text-bone-500 border-transparent hover:text-bone-200"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "types" ? (
        <CrudManager
          title=""
          items={classDefinitions}
          columns={DEF_COLUMNS}
          fields={DEF_FIELDS}
          searchKeys={["name", "difficulty"]}
          itemLabel="Class Type"
          emptyIcon="CalendarDays"
          actions={{ create: createClassDefinitionAction, update: updateClassDefinitionAction, remove: deleteClassDefinitionAction }}
        />
      ) : (
        <CrudManager
          title=""
          items={sessionItems}
          columns={sessionColumns}
          fields={sessionFields}
          searchKeys={["classLabel", "trainerLabel", "day"]}
          itemLabel="Session"
          emptyIcon="CalendarDays"
          actions={{ create: createSessionAction, update: updateSessionAction, remove: deleteSessionAction }}
        />
      )}
    </div>
  );
}
