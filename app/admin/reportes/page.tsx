import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import Navbar from "@/components/layout/Navbare";
import ReportesClient from "./ReportesClient";

export default async function AdminReportesPage() {
  let user;

  try {
    user = await requireAdmin();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      if (error.message === "FORBIDDEN") {
        redirect("/");
      }
    }
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E]">
      <Navbar />
      <ReportesClient adminUser={user} />
    </div>
  );
}
