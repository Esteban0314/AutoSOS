import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPage() {
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

    // Si ocurre otro error inesperado
    throw error;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0C3B2E] text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              AutoSOS
            </h1>

            <p className="text-sm text-gray-200">
              Panel de administración
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-sm text-gray-300">
              Administrador
            </p>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#0C3B2E]">
            Bienvenido al panel
          </h2>

          <p className="text-gray-500 mt-2">
            Desde aquí podrás administrar los datos de AutoSOS.
          </p>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              Usuarios
            </p>

            <p className="text-3xl font-bold text-[#0C3B2E] mt-2">
              —
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Próximamente
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              Talleres
            </p>

            <p className="text-3xl font-bold text-[#0C3B2E] mt-2">
              —
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Próximamente
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              Tiendas
            </p>

            <p className="text-3xl font-bold text-[#0C3B2E] mt-2">
              —
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Próximamente
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">
              Grúas
            </p>

            <p className="text-3xl font-bold text-[#0C3B2E] mt-2">
              —
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Próximamente
            </p>
          </div>

        </div>

        {/* Sección CRUD */}
        <div className="mt-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-[#0C3B2E]">
            Administración
          </h3>

          <p className="text-gray-500 mt-2">
            Aquí construiremos las herramientas CRUD de AutoSOS.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <button className="bg-[#6D9773] text-white px-5 py-3 rounded-lg font-semibold">
              Usuarios
            </button>

            <button className="bg-[#6D9773] text-white px-5 py-3 rounded-lg font-semibold">
              Negocios
            </button>

            <button className="bg-[#6D9773] text-white px-5 py-3 rounded-lg font-semibold">
              Vehículos
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}