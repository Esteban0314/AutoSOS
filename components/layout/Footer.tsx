import Link from "next/link";
import { Car, PhoneCall, ShieldCheck, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#DCE7DE] bg-[#07261D] text-white">
      {/* Top emergency banner */}
      <div className="border-b border-[#145341] bg-[#0C3B2E]/90 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFBA00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFBA00]"></span>
            </span>
            <span className="font-semibold text-white">
              ¿Emergencia en carretera o falla mecánica urgente?
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+59170000000"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFBA00] px-4 py-2 text-xs font-bold text-[#0C3B2E] transition-all hover:bg-[#e5a700] hover:shadow-lg hover:shadow-[#FFBA00]/20"
            >
              <PhoneCall size={14} />
              Llamar Grúa 24/7
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D9773] text-white shadow-md">
                <Car size={22} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Auto<span className="text-[#FFBA00]">SOS</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm text-gray-300 leading-relaxed">
              Plataforma integral de asistencia vehicular, conexión con talleres mecánicos verificados, grúas y repuestos en toda Bolivia.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#6D9773]" />
                Talleres certificados
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-[#6D9773]" />
                Asistencia 24 Horas
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#6D9773]">
              Servicios
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/servicios" className="hover:text-white transition">
                  Talleres mecánicos
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-white transition">
                  Servicio de grúa
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:text-white transition">
                  Tiendas de repuestos
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Diagnóstico IA
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#6D9773]">
              Plataforma
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="hover:text-white transition">
                  Mi Perfil
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Panel administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#6D9773]">
              Contacto
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#6D9773] shrink-0" />
                <span>La Paz, Bolivia</span>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall size={16} className="text-[#6D9773] shrink-0" />
                <span>+591 70000000</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#145341] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} AutoSOS Bolivia. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Diseñado con pasión por la innovación automotriz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

