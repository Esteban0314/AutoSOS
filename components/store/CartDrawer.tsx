"use client";

import { useState } from "react";
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  PhoneCall,
  Send,
  Truck,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Product } from "@/data/products";
import Button from "@/components/ui/Button";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  storePhone?: string;
  storeName?: string;
}

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  storePhone = "+591 73333333",
  storeName = "Tienda de Repuestos AutoSOS",
}: CartDrawerProps) {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerVehicle, setCustomerVehicle] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const isFreeDelivery = subtotal >= 150;
  const deliveryCost = items.length === 0 ? 0 : isFreeDelivery ? 0 : 15;
  const total = subtotal + deliveryCost;

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    let message = `*¡Hola ${storeName}!* 👋\n`;
    message += `Quisiera realizar un pedido de repuestos mediante *AutoSOS Bolivia*:\n\n`;

    items.forEach((item, index) => {
      message += `🔹 *${index + 1}. ${item.product.name}*\n`;
      message += `   • Cantidad: ${item.quantity}\n`;
      message += `   • Precio: ${item.product.price} Bs c/u  (Subtotal: ${
        item.product.price * item.quantity
      } Bs)\n`;
    });

    message += `\n📦 *Subtotal:* ${subtotal} Bs\n`;
    message += `🚚 *Envío:* ${deliveryCost === 0 ? "Gratis (Promo +150 Bs)" : `${deliveryCost} Bs`}\n`;
    message += `💰 *TOTAL A PAGAR:* ${total} Bs\n\n`;

    if (customerName) message += `👤 *Cliente:* ${customerName}\n`;
    if (customerVehicle) message += `🚗 *Vehículo:* ${customerVehicle}\n`;
    if (deliveryAddress) message += `📍 *Dirección de Entrega:* ${deliveryAddress}\n`;

    message += `\n¿Tienen disponibilidad para despacho inmediato? ¡Muchas gracias!`;

    const cleanPhone = storePhone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  const handleDirectConfirm = () => {
    setOrderConfirmed(true);
  };

  const handleReset = () => {
    setOrderConfirmed(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative flex h-full w-full max-w-md flex-col justify-between bg-white shadow-2xl border-l border-[#DCE7DE] animate-slideLeft">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E]">
              <ShoppingBag size={20} className="text-[#6D9773]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#0C3B2E]">
                Carrito de Repuestos
              </h3>
              <p className="text-xs text-gray-500">
                {items.length} {items.length === 1 ? "producto" : "productos"} seleccionados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENIDO DEL CARRITO */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderConfirmed ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-extrabold text-[#0C3B2E]">
                ¡Pedido Registrado con Éxito!
              </h4>
              <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                La tienda <strong>{storeName}</strong> ha recibido tu solicitud. Te contactarán a la brevedad para coordinar la entrega en {deliveryAddress || "tu ubicación"}.
              </p>
              <div className="w-full rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE] text-left text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-[#0C3B2E]">
                  <span>Total a abonar:</span>
                  <span className="text-[#6D9773] text-sm">{total} Bs</span>
                </div>
                <div className="text-gray-500 text-[11px]">
                  Modalidad: Pago contra entrega (Efectivo / QR / Simple)
                </div>
              </div>

              <Button variant="yellow" fullWidth onClick={handleReset}>
                Aceptar y Finalizar
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F8FAF8] text-gray-400 border border-[#DCE7DE]">
                <ShoppingBag size={28} />
              </div>
              <h4 className="text-base font-bold text-[#0C3B2E]">
                Tu carrito está vacío
              </h4>
              <p className="text-xs text-gray-500 max-w-xs">
                Explora el catálogo de repuestos abajo y añade aceites, frenos, filtros o baterías a tu pedido.
              </p>
              <Button variant="outline" size="sm" onClick={onClose} className="mt-2">
                Explorar catálogo
              </Button>
            </div>
          ) : (
            <>
              {/* LISTA DE ITEMS */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8FAF8] p-3.5 border border-[#DCE7DE]"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#0C3B2E] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {item.product.brand} • {item.product.price} Bs
                      </p>
                      <span className="inline-block text-[10px] text-[#6D9773] font-semibold mt-0.5">
                        Subtotal: {item.product.price * item.quantity} Bs
                      </span>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-1.5 bg-white rounded-xl border border-[#DCE7DE] p-1">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="w-6 text-center text-xs font-bold text-[#0C3B2E]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-gray-400 hover:text-red-600 p-1 transition cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* DATOS DE ENTREGA Y VEHÍCULO */}
              <div className="mt-6 rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE] space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Truck size={14} className="text-[#6D9773]" />
                  <span>Datos para el despacho</span>
                </h5>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Nombre o Contacto
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3 py-2 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Modelo de tu auto (Para verificar compatibilidad)
                  </label>
                  <input
                    type="text"
                    value={customerVehicle}
                    onChange={(e) => setCustomerVehicle(e.target.value)}
                    placeholder="Ej. Toyota Corolla 2018"
                    className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3 py-2 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Dirección de entrega o Taller
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Ej. Calacoto Calle 15 #300, La Paz"
                    className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3 py-2 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER TOTALES & ACCIONES */}
        {items.length > 0 && !orderConfirmed && (
          <div className="border-t border-gray-100 bg-[#F8FAF8] p-5 space-y-3">
            {/* Desglose de precios */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal repuestos:</span>
                <span className="font-semibold">{subtotal} Bs</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <span>Envío local:</span>
                  {isFreeDelivery && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-700">
                      Gratis
                    </span>
                  )}
                </span>
                <span className="font-semibold">
                  {isFreeDelivery ? "0 Bs" : `${deliveryCost} Bs`}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-extrabold text-[#0C3B2E]">
                <span>Total Estimado:</span>
                <span className="text-[#6D9773]">{total} Bs</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2 pt-2">
              <Button
                variant="yellow"
                fullWidth
                size="md"
                icon={<Send size={15} />}
                onClick={handleWhatsAppCheckout}
                className="font-extrabold shadow-md"
              >
                Pedir por WhatsApp
              </Button>

              <Button
                variant="primary"
                fullWidth
                size="md"
                icon={<CheckCircle2 size={15} />}
                onClick={handleDirectConfirm}
              >
                Confirmar pedido en tienda
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 text-center">
              <ShieldCheck size={12} className="text-[#6D9773]" />
              <span>Garantía de repuestos originales y boleta oficial</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
