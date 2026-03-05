'use client';

import { useState, useEffect } from 'react';
import { useStore, Product } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Trash2,
  Edit,
  Users,
  ArrowUpRight,
  XCircle,
  Menu,
  LogOut
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products'>('dashboard');
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useStore();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setIsAuthChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-40">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <Package className="text-black w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">ADMIN</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg">
          {isSidebarOpen ? <XCircle className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:sticky top-0 left-0 z-50
        w-72 md:w-64 h-screen bg-[#0a0a0a] border-r border-white/10 
        flex flex-col transition-transform duration-300 ease-in-out
      `}>
        <div className="p-8 hidden md:block">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <Package className="text-black w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-grow px-4 space-y-2 mt-4 md:mt-0">
          <button
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-white text-black' : 'hover:bg-white/5 text-white/60'}`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium">Produtos</span>
          </button>
        </nav>

        <div className="p-8 border-t border-white/10 space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all hover:bg-red-500/10 text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
          <Link href="/" className="text-sm text-white/40 hover:text-white transition-colors flex items-center px-4">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Voltar para Loja
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight capitalize">{activeTab}</h1>
            <p className="text-white/40 mt-1 text-sm md:text-base">Bem-vindo ao centro de comando da Codmaster.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:border-white/40 outline-none transition-all"
              />
            </div>
            {activeTab === 'products' && (
              <button
                onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-white/90 transition-all flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </button>
            )}
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
            </motion.div>
          ) : activeTab === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl">
                      <Package className="text-purple-500 w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Total de Produtos</p>
                  <h3 className="text-3xl font-display font-bold mt-2">{products.length}</h3>
                </div>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                      <Users className="text-blue-500 w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-wider">Visitas (Simulado)</p>
                  <h3 className="text-3xl font-display font-bold mt-2">1,284</h3>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product) => (
                <div key={product.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 group relative">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                    <Image src={(product.images && product.images.length > 0) ? product.images[0] : 'https://picsum.photos/seed/placeholder/400/400'} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-display font-bold text-lg">{product.name}</h3>
                    </div>
                    <p className="font-bold text-lg">
                      {product.price.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                    </p>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm">
                      <span className="text-white/40">Estoque:</span>
                      <span className={`ml-2 font-bold ${product.stock < 5 ? 'text-red-500' : 'text-white'}`}>{product.stock}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#1a1a1a] border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-display font-bold mb-6">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <ProductForm
                initialData={editingProduct}
                isSubmitting={isSubmitting}
                onSubmit={async (data) => {
                  setIsSubmitting(true);
                  try {
                    if (editingProduct) {
                      await updateProduct(editingProduct.id, data);
                    } else {
                      await addProduct(data as Omit<Product, 'id'>);
                    }
                    setIsProductModalOpen(false);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                onCancel={() => setIsProductModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }: { initialData: Product | null, onSubmit: (data: Partial<Product>) => void, onCancel: () => void, isSubmitting: boolean }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    description: initialData?.description || '',
    images: initialData?.images || [],
    videoUrl: initialData?.videoUrl || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Nome</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Preço (MT)</label>
          <input
            required
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Estoque</label>
          <input
            required
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">URL do Vídeo (Opcional)</label>
          <input
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/40 transition-all"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Fotos do Produto</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-2">
            {formData.images && formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                <Image src={img} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <XCircle className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-white/20 transition-all">
              <Plus className="w-6 h-6 text-white/20" />
              <span className="text-[8px] uppercase font-bold text-white/20 mt-1">Upload</span>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Descrição</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-24 outline-none focus:border-white/40 transition-all resize-none"
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-grow bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 transition-all order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
          ) : (
            initialData ? 'Salvar Alterações' : 'Criar Produto'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-4 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all order-2 sm:order-1"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
