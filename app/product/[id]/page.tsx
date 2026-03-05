'use client';

import { useStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ProductDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const { products, isLoading } = useStore();
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find((p) => p.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-display font-bold mb-4">Produto não encontrado</h1>
        <Link href="/" className="text-black/60 hover:text-black transition-colors flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para a loja
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT`;
  };

  const whatsappNumber = "258871956427";
  const whatsappMessage = `Vem da loja quero comprar Produto:(${product.name})`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => router.back()}
          className="mb-8 text-black/40 hover:text-black transition-colors flex items-center group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm"
            >
              <Image
                src={(product.images && product.images.length > 0) ? product.images[activeImage] : 'https://picsum.photos/seed/placeholder/400/400'}
                alt={product.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {product.videoUrl && (
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-4">Vídeo do Produto</h3>
                <div className="relative aspect-video rounded-3xl overflow-hidden border border-black/5 shadow-sm bg-black">
                  {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${product.videoUrl.split('v=')[1]?.split('&')[0] || product.videoUrl.split('/').pop()}`}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={product.videoUrl}
                      controls
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
          >
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-black mb-6">
                {formatPrice(product.price)}
              </p>
              <div className="h-px w-full bg-black/5 mb-8" />
              <p className="text-lg text-black/60 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            <div className="mt-auto space-y-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 text-sm ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-600' : 'bg-red-600'}`} />
                  <span>{product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center space-x-3 bg-black text-white hover:bg-black/80 ${product.stock === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>Comprar Agora</span>
                </a>
              </div>

              <p className="text-center text-xs text-black/40">
                Pagamento seguro e entrega rápida em todo o país.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
