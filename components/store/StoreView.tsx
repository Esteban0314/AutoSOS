"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Search,
  Check,
  Plus,
  Star,
  ShieldCheck,
  Fuel,
  Sparkles,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Product, products } from "@/data/products";
import CartDrawer, { CartItem } from "./CartDrawer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Business } from "@/data/businesses";

interface StoreViewProps {
  business: Business;
}

export default function StoreView({ business }: StoreViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "Todos los repuestos" },
    { id: "lubricants", label: "Aceites y Lubricantes" },
    { id: "brakes", label: "Frenos y Discos" },
    { id: "filters", label: "Filtros" },
    { id: "batteries", label: "Baterías" },
    { id: "ignition", label: "Bujías e Inyección" },
    { id: "accessories", label: "Accesorios" },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.compatibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setAddedAnimationId(product.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="space-y-8">
      {/* BARRA SUPERIOR DE TIENDA & CARRITO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-[#0C3B2E] text-white p-6 shadow-lg border border-[#145341]">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="sm" withDot pulseDot>
              Catálogo Oficial
            </Badge>
            <span className="text-xs text-gray-300">Despacho Inmediato</span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-white">
            Repuestos y Accesorios Disponibles
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Garantía de originalidad, envíos a domicilio o retiro directo en mostrador
          </p>
        </div>

        {/* BOTÓN RESUMEN DE CARRITO */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative inline-flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition cursor-pointer shadow-md group"
        >
          <div className="relative">
            <ShoppingBag size={20} className="text-[#FFBA00] group-hover:scale-110 transition" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFBA00] text-[#0C3B2E] text-[10px] font-extrabold shadow-sm animate-pulse">
                {totalCartCount}
              </span>
            )}
          </div>
          <div className="text-left">
            <span className="block text-[10px] uppercase tracking-wider text-gray-300">
              Mi Carrito
            </span>
            <span className="text-sm font-extrabold text-white">
              {totalCartAmount > 0 ? `${totalCartAmount} Bs` : "0 Bs"}
            </span>
          </div>
        </button>
      </div>

      {/* BUSCADOR Y CATEGORÍAS */}
      <div className="space-y-4">
        {/* Buscador */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por repuesto, marca (Mobil 1, Bosch, Denso) o auto compatible (Toyota, Suzuki)..."
            className="w-full rounded-2xl border border-[#DCE7DE] bg-white pl-11 pr-4 py-3 text-xs text-[#0C3B2E] outline-none shadow-xs focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
          />
        </div>

        {/* Categorías tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? "border-[#0C3B2E] bg-[#0C3B2E] text-white shadow-xs"
                  : "border-[#DCE7DE] bg-white text-gray-600 hover:border-[#6D9773] hover:bg-[#F8FAF8]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE PRODUCTOS */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[#DCE7DE] bg-white p-12 text-center">
          <ShoppingBag size={36} className="mx-auto text-gray-300 mb-2" />
          <h3 className="text-base font-bold text-[#0C3B2E]">
            No encontramos repuestos que coincidan
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Intenta buscando con otro término o consulta disponibilidad por teléfono.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const inCart = cartItems.find((i) => i.product.id === product.id);
            const isJustAdded = addedAnimationId === product.id;

            return (
              <Card
                key={product.id}
                hoverEffect
                className="flex flex-col justify-between border-[#DCE7DE] bg-gradient-to-b from-white to-[#F8FAF8] p-5"
              >
                <div>
                  {/* Header Tarjeta */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="rounded-lg bg-[#E8F0E9] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#0C3B2E]">
                      {product.brand}
                    </span>

                    {product.badge && (
                      <span className="rounded-lg bg-[#FFF4D6] px-2.5 py-1 text-[10px] font-extrabold text-[#8C5D00] border border-[#FFBA00]/30">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-extrabold text-[#0C3B2E] leading-snug">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Compatibilidad chip */}
                  <div className="mt-3 rounded-xl bg-gray-50 p-2.5 border border-gray-100 text-[11px] text-gray-600 space-y-1">
                    <div className="font-semibold text-[#0C3B2E] text-[10px] uppercase">
                      Compatibilidad:
                    </div>
                    <div className="truncate font-medium text-gray-700">
                      {product.compatibility}
                    </div>
                  </div>
                </div>

                {/* Footer Precio y Botón */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-[#0C3B2E]">
                        {product.price} Bs
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.originalPrice} Bs
                        </span>
                      )}
                    </div>
                    <span className="block text-[10px] text-emerald-600 font-bold">
                      • {product.stock} en stock
                    </span>
                  </div>

                  <Button
                    variant={isJustAdded ? "success" : inCart ? "secondary" : "yellow"}
                    size="sm"
                    icon={
                      isJustAdded ? (
                        <Check size={14} />
                      ) : inCart ? (
                        <CheckCircle2 size={14} className="text-[#6D9773]" />
                      ) : (
                        <Plus size={14} />
                      )
                    }
                    onClick={() => handleAddToCart(product)}
                    className="font-bold text-xs"
                  >
                    {isJustAdded
                      ? "¡Agregado!"
                      : inCart
                      ? `En carrito (${inCart.quantity})`
                      : "Añadir"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* DRAWER / MODAL DEL CARRITO */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        storePhone={business.phone}
        storeName={business.name}
      />
    </div>
  );
}
