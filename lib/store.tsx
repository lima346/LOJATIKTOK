'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  videoUrl?: string;
}

interface StoreContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Cadeira Ergonômica Pro',
    description: 'Conforto máximo para longas horas de trabalho.',
    price: 899.90,
    images: ['https://picsum.photos/seed/chair/400/400'],
    stock: 15
  },
  {
    name: 'Teclado Mecânico RGB',
    description: 'Switches lineares para uma digitação suave e rápida.',
    price: 450.00,
    images: ['https://picsum.photos/seed/keyboard/400/400'],
    stock: 25
  },
  {
    name: 'Monitor 4K 27"',
    description: 'Cores vibrantes e nitidez excepcional.',
    price: 2100.00,
    images: ['https://picsum.photos/seed/monitor/400/400'],
    stock: 8
  }
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return;
      }

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // If no products in DB, we could seed them or just show empty
        // For this demo, we'll just keep it empty if DB is empty
        setProducts([]);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) {
        console.error('Supabase Error (Add):', error);
        alert(`Erro do Banco: ${error.message} (Código: ${error.code})`);
        return;
      }

      if (data) {
        setProducts([data[0], ...products]);
      }
    } catch (err: any) {
      console.error('Unexpected Error:', err);
      alert('Erro inesperado ao conectar com o banco de dados.');
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // Remove id if it exists in updates to avoid Supabase error
      const { id: _, ...payload } = updates as any;

      const { error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id);

      if (error) {
        console.error('Supabase Error (Update):', error);
        alert(`Erro ao atualizar: ${error.message}`);
        return;
      }

      setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert('Erro inesperado ao atualizar produto.');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Erro ao deletar produto.');
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      isLoading,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
