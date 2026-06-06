import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  fullName: z.string().min(1).max(255),
  phone: z.string().min(1).max(50),
  email: z.string().max(255).optional().nullable(),
  appointmentDate: z.string().min(1),
  serviceName: z.string().max(255).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const createAppointmentCalendarEvent = createServerFn({ method: "POST" })
  .inputValidator((d) => Input.parse(d))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const calKey = process.env.GOOGLE_CALENDAR_API_KEY;
    if (!lovableKey || !calKey) {
      throw new Error("Google Calendar bağlantı bilgileri eksik.");
    }

    const start = new Date(data.appointmentDate);
    if (Number.isNaN(start.getTime())) throw new Error("Geçersiz tarih");
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const description = [
      `Ad Soyad: ${data.fullName}`,
      `Telefon: ${data.phone}`,
      `E-posta: ${data.email || "-"}`,
      `Hizmet: ${data.serviceName || "-"}`,
      `Not: ${data.notes || "-"}`,
    ].join("\n");

    const res = await fetch(
      "https://connector-gateway.lovable.dev/google_calendar/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": calKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `Yeni Klinik Randevusu: ${data.fullName}`,
          description,
          start: { dateTime: start.toISOString(), timeZone: "Europe/Istanbul" },
          end: { dateTime: end.toISOString(), timeZone: "Europe/Istanbul" },
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Google Calendar API error", res.status, text);
      throw new Error(`Calendar API ${res.status}`);
    }

    const json = (await res.json()) as { id?: string; htmlLink?: string };
    return { id: json.id, htmlLink: json.htmlLink };
  });
