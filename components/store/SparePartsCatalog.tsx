"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Search,
  MessageSquare,
  X,
  Package,
  ArrowRight,
  Truck,
  Store as StoreIcon,
  Tag,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { SparePart, getSparePartsForStore } from "@/data/spare-parts";

interface CartItem {
  part: SparePart;
  quantity: number;
}

interface SparePartsCatalogProps {
  storeId: string;
  storeName: string;
  storePhone: string;
  storeWhatsapp?: string;
  storeAddress: string;
}

export default function SparePartsCatalog({
  storeId,
  storeName,
  storePhone,
  storeWhatsapp,
  storeAddress,
}: SparePartsCatalogProps) {
  const parts = getSparePartsForStore(storeId);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");

  // Categorías presentes
  const categories = ["all", ...Array.from(new Set(parts.map((p) => p.category)))];

  const filteredParts = parts.filter((part) => {
    const matchesCat = selectedCategory === "all" || part.category === selectedCategory;
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.compatibleWith.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Manejo de carrito
  const addToCart = (part: SparePart) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.part.id === part.id);
      if (existing) {
        return prev.map((item) =>
          item.part.id === part.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { part, quantity: 1 }];
    });
  };

  const updateQuantity = (partId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.part.id === partId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (partId: string) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.part.price * item.quantity, 0);
  const deliveryFee = deliveryType === "delivery" && subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + deliveryFee;

  // Teléfono para WhatsApp
  const cleanPhone = (storeWhatsapp || storePhone).replace(/\D/g, "");

  // Generar mensaje estructurado de WhatsApp
  const buildWhatsAppMessage = () => {
    let msg = `Hola *${storeName}*, deseo realizar el siguiente pedido de repuestos mediante AutoSOS:\n\n`;
    cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.part.name}* (Marca: ${item.part.brand})\n`;
      msg += `   Cantidad: ${item.quantity} x ${item.part.price} Bs. = *${item.quantity * item.part.price} Bs.*\n`;
      msg += `   Compatibilidad: ${item.part.compatibleWith}\n\n`;
    });
    msg += `--------------------------\n`;
    msg += `Modalidad: *${deliveryType === "delivery" ? "Envío a domicilio en La Paz (+15 Bs.)" : "Recojo en tienda física"}*\n`;
    msg += `Total a pagar: *${grandTotal} Bs.*\n\n`;
    msg += `¿Cuentan con stock disponible para confirmar la orden? Muchas gracias.`;
    return encodeURIComponent(msg);
  };

  return (
    <div className="space-y-6">
      {/* BOTÓN FLOTANTE DEL CARRITO (SI HAY PRODUCTOS) */}
      {totalItemsCount > 0 && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-2xl bg-[#0C3B2E] text-white px-5 py-3.5 shadow-2xl hover:bg-[#145341] transition-all hover:scale-105 border border-[#FFBA00] cursor-pointer animate-enter-scale"
        >
          <div className="relative">
            <ShoppingCart size={22} className="text-[#FFBA00]" />
            <span className="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFBA00] text-[10px] font-black text-[#0C3B2E]">
              {totalItemsCount}
            </span>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Ver Carrito</p>
            <p className="text-sm font-extrabold text-white">{subtotal} Bs.</p>
          </div>
          <ArrowRight size={16} className="text-[#FFBA00] ml-1" />
        </button>
      )}

      {/* CATÁLOGO DE PRODUCTOS */}
      <Card className="border-[#6D9773]/30 shadow-md bg-white">
        {/* HEADER DE LA SECCIÓN */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
                <Package size={18} className="text-[#6D9773]" />
              </span>
              <h2 className="text-xl font-black text-[#0C3B2E]">
                Catálogo Oficial de Repuestos y Autopartes
              </h2>
            </div>
            <p className="mt-1 text-xs text-gray-500 leading-relaxed">
              Explora los repuestos originales y alternativos disponibles en inventario. Agrega lo que necesites a tu carrito para ordenar directo por WhatsApp o recoger en tienda.
            </p>
          </div>

          {/* BOTÓN VER CARRITO */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#DCE7DE] bg-[#F8FAF8] px-4 py-2 text-xs font-bold text-[#0C3B2E] hover:border-[#6D9773] transition cursor-pointer shadow-xs shrink-0"
          >
            <ShoppingCart size={16} className="text-[#6D9773]" />
            <span>Carrito ({totalItemsCount})</span>
            {subtotal > 0 && <span className="text-[#6D9773]">· {subtotal} Bs.</span>}
          </button>
        </div>

        {/* BUSCADOR Y FILTROS POR CATEGORÍA */}
        <div className="mt-5 space-y-3.5">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por repuesto, marca (Bosch, Mann, Denso) o modelo de auto (Hilux, Swift, Corolla)..."
              className="h-11 w-full rounded-xl border border-[#DCE7DE] bg-white pl-10 pr-4 text-xs text-[#0C3B2E] outline-none transition focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
            />
          </div>

          {/* CHIPS DE CATEGORÍAS */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0C3B2E] text-white shadow-xs"
                    : "border border-[#DCE7DE] bg-[#F8FAF8] text-gray-600 hover:border-[#6D9773]"
                }`}
              >
                {cat === "all" ? "Todos los repuestos" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID DE REPUESTOS */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredParts.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-[#DCE7DE] p-8 text-center">
              <Package size={28} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#0C3B2E]">No se encontraron repuestos</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Prueba con otro término de búsqueda o selecciona otra categoría.
              </p>
            </div>
          ) : (
            filteredParts.map((part) => {
              const inCartItem = cart.find((i) => i.part.id === part.id);

              return (
                <div
                  key={part.id}
                  className="rounded-2xl border border-[#DCE7DE] bg-white overflow-hidden shadow-xs hover:border-[#6D9773] hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* FOTOGRAFÍA DEL REPUESTO */}
                    <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                      <img
                        src={part.imageUrl}
                        alt={part.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="rounded-lg bg-black/75 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#FFBA00] backdrop-blur-md">
                          {part.brand}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 text-white px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
                          <CheckCircle2 size={10} />
                          En stock
                        </span>
                      </div>
                    </div>

                    {/* DETALLES */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#6D9773] uppercase tracking-wider">
                          {part.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {part.warranty}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-[#0C3B2E] line-clamp-2">
                        {part.name}
                      </h4>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {part.description}
                      </p>

                      <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                        <span className="font-bold text-[#0C3B2E]">Compatible con:</span>{" "}
                        <span className="text-gray-500 italic">{part.compatibleWith}</span>
                      </div>
                    </div>
                  </div>

                  {/* PRECIO Y BOTÓN AGREGAR AL CARRITO */}
                  <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">
                        Precio
                      </span>
                      <span className="text-lg font-black text-[#0C3B2E]">
                        {part.price} <span className="text-xs font-bold text-[#6D9773]">Bs.</span>
                      </span>
                    </div>

                    {inCartItem ? (
                      <div className="flex items-center gap-2 bg-[#E8F0E9] rounded-xl p-1 border border-[#6D9773]/40">
                        <button
                          type="button"
                          onClick={() => updateQuantity(part.id, -1)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg bg-white text-[#0C3B2E] hover:bg-gray-100 transition shadow-xs cursor-pointer"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-xs font-black text-[#0C3B2E] px-1">
                          {inCartItem.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(part.id, 1)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#0C3B2E] text-[#FFBA00] hover:bg-[#145341] transition shadow-xs cursor-pointer"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        icon={<Plus size={14} />}
                        onClick={() => addToCart(part)}
                        className="font-bold"
                      >
                        Agregar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* MODAL / DRAWER DEL CARRITO DE COMPRAS */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-[#DCE7DE] max-h-[90vh] flex flex-col justify-between animate-enter-scale">
            {/* Header Carrito */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
                  <ShoppingCart size={20} className="text-[#6D9773]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0C3B2E]">
                    Carrito de Repuestos
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tienda: <strong>{storeName}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-xl p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido / Ítems */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[45vh] pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingCart size={36} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#0C3B2E]">Tu carrito está vacío</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                    Agrega los repuestos que necesites para tu auto desde el catálogo.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.part.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-[#DCE7DE] bg-[#F8FAF8]"
                  >
                    <img
                      src={item.part.imageUrl}
                      alt={item.part.name}
                      className="h-14 w-14 rounded-xl object-cover border border-gray-200"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-extrabold text-[#0C3B2E] truncate">
                        {item.part.name}
                      </h5>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        {item.part.brand} · {item.part.price} Bs. c/u
                      </p>
                      <span className="text-[11px] font-black text-[#6D9773]">
                        Subtotal: {item.quantity * item.part.price} Bs.
                      </span>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.part.id, -1)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg border border-[#DCE7DE] bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold text-[#0C3B2E] w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.part.id, 1)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg border border-[#DCE7DE] bg-white text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.part.id)}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 ml-1 cursor-pointer"
                        title="Eliminar del carrito"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modalidad de Entrega */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 pt-3 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Modalidad de Entrega en La Paz:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("delivery")}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        deliveryType === "delivery"
                          ? "border-[#0C3B2E] bg-[#0C3B2E] text-white shadow-xs"
                          : "border-[#DCE7DE] bg-[#F8FAF8] text-gray-600 hover:border-[#6D9773]"
                      }`}
                    >
                      <Truck size={15} />
                      <span>Delivery (+15 Bs.)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("pickup")}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        deliveryType === "pickup"
                          ? "border-[#0C3B2E] bg-[#0C3B2E] text-white shadow-xs"
                          : "border-[#DCE7DE] bg-[#F8FAF8] text-gray-600 hover:border-[#6D9773]"
                      }`}
                    >
                      <StoreIcon size={15} />
                      <span>Recojo en Mostrador</span>
                    </button>
                  </div>
                </div>

                {/* Resumen de totales */}
                <div className="rounded-2xl bg-[#E8F0E9]/60 p-3 text-xs space-y-1">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal repuestos ({totalItemsCount} unid.):</span>
                    <strong className="text-[#0C3B2E]">{subtotal} Bs.</strong>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <strong className="text-[#0C3B2E]">
                      {deliveryFee > 0 ? `${deliveryFee} Bs.` : "Gratis (Recojo en tienda)"}
                    </strong>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#0C3B2E] border-t border-gray-200/60 pt-1.5 mt-1">
                    <span>Total a pagar:</span>
                    <span className="text-base text-[#0C3B2E]">{grandTotal} Bs.</span>
                  </div>
                </div>

                {/* Botón WhatsApp de orden directa */}
                <a
                  href={`https://wa.me/${cleanPhone}?text=${buildWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    variant="yellow"
                    fullWidth
                    size="lg"
                    icon={<MessageSquare size={16} />}
                    className="font-extrabold shadow-md hover:shadow-[#FFBA00]/30"
                  >
                    Confirmar Pedido por WhatsApp ({grandTotal} Bs.)
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
