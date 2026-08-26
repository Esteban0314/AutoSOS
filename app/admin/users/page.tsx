import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import UsersClient from "./UsersClient";
import LogoutButton from "@/components/ui/LogoutButton";

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
    <main className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-[#0C3B2E] text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              AutoSOS
            </h1>

            <p className="text-sm text-gray-300">
              Administración de usuarios
            </p>
          </div>

          <LogoutButton
            className="
              bg-[#FFBA00]
              text-[#0C3B2E]
              px-5
              py-2.5
              rounded-lg
              font-semibold
              hover:opacity-90
              transition
            "
          />

        </div>
      </header>

      {/* CONTENIDO */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <UsersClient />
      </section>

    </main>
  );
}