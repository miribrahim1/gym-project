"use client";

import { CalendarPlus, MessageCircle, Download } from "lucide-react";
import Button from "@/components/ui/Button";

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toICSDate(dateStr) {
  return dateStr.replaceAll("-", "");
}

export default function ConfirmationActions({ membership, gymName, gymPhone }) {
  function handleAddToCalendar() {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//IronVault Fitness//Membership//EN",
      "BEGIN:VEVENT",
      `UID:${membership.id}@ironvaultfitness.com`,
      `DTSTART;VALUE=DATE:${toICSDate(membership.startDate)}`,
      `DTEND;VALUE=DATE:${toICSDate(membership.expiryDate)}`,
      `SUMMARY:${gymName} — ${membership.planName} Membership`,
      `DESCRIPTION:Membership ID ${membership.id}. Billing: ${membership.billingLabel}.`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    downloadFile(`ironvault-membership-${membership.id}.ics`, ics, "text/calendar");
  }

  function handleDownload() {
    const text = [
      `${gymName} — Membership Confirmation`,
      "----------------------------------------",
      `Membership ID: ${membership.id}`,
      `Plan: ${membership.planName}`,
      `Billing Cycle: ${membership.billingLabel}`,
      `Start Date: ${membership.startDate}`,
      `Expiry Date: ${membership.expiryDate}`,
      `Member Name: ${membership.fullName}`,
      `Email: ${membership.email}`,
      `Phone: ${membership.phone}`,
      `Fitness Goal: ${membership.fitnessGoal}`,
      "",
      "This is a demo confirmation generated for portfolio purposes.",
    ].join("\n");
    downloadFile(`ironvault-membership-${membership.id}.txt`, text, "text/plain");
  }

  const whatsappText = encodeURIComponent(
    `Hi! I just joined ${gymName} 🎉 Membership ID: ${membership.id}, Plan: ${membership.planName}. Excited to start training!`
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button variant="secondary" icon={CalendarPlus} onClick={handleAddToCalendar}>
        Add to Calendar
      </Button>
      <Button
        as="a"
        href={`https://wa.me/?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        icon={MessageCircle}
      >
        Share on WhatsApp
      </Button>
      <Button variant="secondary" icon={Download} onClick={handleDownload}>
        Download Details
      </Button>
    </div>
  );
}
