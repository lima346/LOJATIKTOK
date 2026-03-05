'use client';

import Navbar from '@/components/Navbar';
import { useStore } from '@/lib/store';
import { motion } from 'motion/react';
import { Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const { products, isLoading } = useStore();

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:h-[30vh] flex items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full grid grid-cols-6 md:grid-cols-12 gap-4 p-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="aspect-square border border-black/10 rounded-sm" />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 md:py-0">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-6">
                Bem-vindo à nossa <span className="text-black/20 italic">loja online!</span>
              </h1>
              <p className="text-base md:text-lg text-black/60 mb-0 max-w-2xl leading-relaxed">
                Trabalhamos com Cash on Delivery (pagamento na entrega) para garantir mais segurança. Faça seu pedido facilmente e pague apenas ao receber. Entregas rápidas e grátis em Maputo e Matola.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">Produtos em Destaque</h2>
            <p className="text-black/40 mt-2">Nossa seleção manual para você.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-black/5 rounded-2xl mb-4" />
                <div className="h-4 bg-black/5 rounded w-3/4 mb-2" />
                <div className="h-4 bg-black/5 rounded w-1/2" />
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-black/40">Nenhum produto encontrado.</p>
            </div>
          ) : (
            products.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 border border-black/5 shadow-sm group-hover:shadow-md transition-all">
                    <Image
                      src={(product.images && product.images.length > 0) ? product.images[0] : 'https://picsum.photos/seed/placeholder/400/400'}
                      alt={product.name}
                      fill
                      className={`object-cover group-hover:scale-105 transition-transform duration-500 ${product.stock === 0 ? 'grayscale' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    {product.stock === 0 ? (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-3 py-1 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-widest shadow-xl">
                          Esgotado
                        </span>
                      </div>
                    ) : product.stock < 5 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded-md uppercase">
                          Poucas unidades
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-display font-bold text-sm leading-tight mb-1">{product.name}</h3>
                    <p className="font-bold text-sm">
                      {product.price.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <ShoppingBag className="text-white w-4 h-4" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">CODMASTER</span>
            </div>
            <p className="text-sm text-black/40">© 2024 Codmaster Store. Todos os direitos reservados.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-black/40 hover:text-black transition-colors">Instagram</Link>
              <Link href="#" className="text-sm text-black/40 hover:text-black transition-colors">Twitter</Link>
              <Link href="#" className="text-sm text-black/40 hover:text-black transition-colors">Suporte</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
