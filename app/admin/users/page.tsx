import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import UsersClient from "./UsersClient";
import Navbar from "@/components/layout/Navbare";

export default async function UsersPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        redirect("/login");
      }
      if (error.message === "FORBIDDEN") {
        redirect("/");
      }
    }
    throw error;
  }

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E]">
      <Navbar />
      <UsersClient />
    </div>
  );
}