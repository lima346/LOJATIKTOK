'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[]; // UI expects array
  stock: number;    // UI expects number
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
        // Traduz do banco para a UI
        const mappedProducts = data.map((dbProd: any) => ({
          id: dbProd.id,
          name: dbProd.name,
          description: dbProd.description,
          price: dbProd.price,
          images: dbProd.image_url ? [dbProd.image_url] : [],
          stock: dbProd.available ? 10 : 0 // Converte boolean para número simbólico
        }));
        setProducts(mappedProducts);
      } else {
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
      // Traduz da UI para o Banco
      const dbProduct = {
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.images && product.images.length > 0 ? product.images[0] : '',
        available: product.stock > 0
      };

      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select();

      if (error) {
        console.error('Supabase Error (Add):', error);
        alert(`Erro do Banco: ${error.message}`);
        return;
      }

      if (data) {
        // Mapeia de volta para a UI o item criado
        const newProduct: Product = {
          id: data[0].id,
          name: data[0].name,
          description: data[0].description,
          price: data[0].price,
          images: data[0].image_url ? [data[0].image_url] : [],
          stock: data[0].available ? 10 : 0
        };
        setProducts([newProduct, ...products]);
      }
    } catch (err: any) {
      console.error('Unexpected Error:', err);
      alert('Erro inesperado ao conectar com o banco de dados.');
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // Traduz da UI para o Banco
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.images) dbUpdates.image_url = updates.images[0];
      if (updates.stock !== undefined) dbUpdates.available = updates.stock > 0;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
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
