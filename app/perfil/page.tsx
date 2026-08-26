import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";

export default async function PerfilPage() {
  let user;

  try {
    user = await requireAuth();
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
    <main className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="bg-[#0C3B2E] text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold">
              AutoSOS
            </h1>

            <p className="text-sm text-gray-300">
              Mi perfil
            </p>
          </div>

          <a
            href="/"
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
          >
            Volver al inicio
          </a>

        </div>
      </header>


      {/* PERFIL */}
      <section className="max-w-5xl mx-auto px-6 py-10">

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

          {/* CABECERA DEL PERFIL */}
          <div className="bg-[#0C3B2E] px-8 py-10 text-white">

            <div className="flex items-center gap-6">

              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  bg-[#FFBA00]
                  text-[#0C3B2E]
                  flex
                  items-center
                  justify-center
                  text-4xl
                  font-bold
                "
              >
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm text-gray-300">
                  Mi cuenta
                </p>

                <h2 className="text-3xl font-bold mt-1">
                  {user.name}
                </h2>

                <p className="text-gray-300 mt-1">
                  {user.role === "ADMIN"
                    ? "Administrador"
                    : user.role === "BUSINESS"
                      ? "Negocio"
                      : "Cliente"}
                </p>
              </div>

            </div>

          </div>


          {/* INFORMACIÓN */}
          <div className="p-8">

            <h3 className="text-xl font-bold text-[#0C3B2E]">
              Información personal
            </h3>

            <p className="text-gray-500 mt-1">
              Información asociada a tu cuenta de AutoSOS.
            </p>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">

              {/* NOMBRE */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">
                  Nombre completo
                </p>

                <p className="text-lg font-semibold text-[#0C3B2E] mt-2">
                  {user.name}
                </p>
              </div>


              {/* EMAIL */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">
                  Correo electrónico
                </p>

                <p className="text-lg font-semibold text-[#0C3B2E] mt-2 break-all">
                  {user.email}
                </p>
              </div>


              {/* TELÉFONO */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">
                  Teléfono
                </p>

                <p className="text-lg font-semibold text-[#0C3B2E] mt-2">
                  {user.phone || "No registrado"}
                </p>
              </div>


              {/* ROL */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-sm text-gray-500">
                  Tipo de cuenta
                </p>

                <p className="text-lg font-semibold text-[#0C3B2E] mt-2">
                  {user.role === "ADMIN"
                    ? "Administrador"
                    : user.role === "BUSINESS"
                      ? "Negocio"
                      : "Cliente"}
                </p>
              </div>

            </div>


            {/* EDITAR */}
            <div className="mt-8 flex justify-end">

              <button
                className="
                  bg-[#6D9773]
                  text-white
                  px-6
                  py-3
                  rounded-lg
                  font-semibold
                  hover:opacity-90
                  transition
                "
              >
                Editar información
              </button>

            </div>

          </div>

        </div>


        {/* VEHÍCULOS */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mt-8">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold text-[#0C3B2E]">
                Mis vehículos
              </h3>

              <p className="text-gray-500 mt-1">
                Aquí aparecerán los vehículos asociados a tu cuenta.
              </p>
            </div>

            <span className="text-4xl">
              🚗
            </span>

          </div>


          <div className="mt-6 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              🚘
            </div>

            <h4 className="font-bold text-[#0C3B2E] text-lg">
              Aún no tienes vehículos
            </h4>

            <p className="text-gray-500 mt-2">
              Cuando creemos el CRUD de vehículos podrás
              registrar todos tus autos aquí.
            </p>

            <button
              className="
                mt-5
                bg-[#6D9773]
                text-white
                px-5
                py-3
                rounded-lg
                font-semibold
                hover:opacity-90
                transition
              "
            >
              + Agregar vehículo
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}