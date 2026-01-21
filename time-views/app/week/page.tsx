import { redirect } from "next/navigation";
import { getWeekNumber, getWeekYear } from "@/lib/utils";

export default function WeekPage() {
  const now = new Date();
  const year = getWeekYear(now);
  const week = getWeekNumber(now);

  redirect(`/week/${year}/${week}`);
}
