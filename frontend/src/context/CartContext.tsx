"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Product } from "@/lib/api";

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: "ADD"; product: Product }
    | { type: "REMOVE"; productId: number }
    | { type: "SET_QTY"; productId: number; qty: number }
    | { type: "CLEAR" }
    | { type: "LOAD"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD": {
            const existing = state.items.find((i) => i.product.id === action.product.id);
            if (existing) {
                return {
                    items: state.items.map((i) =>
                        i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                };
            }
            return { items: [...state.items, { product: action.product, quantity: 1 }] };
        }
        case "REMOVE":
            return { items: state.items.filter((i) => i.product.id !== action.productId) };
        case "SET_QTY":
            if (action.qty <= 0) {
                return { items: state.items.filter((i) => i.product.id !== action.productId) };
            }
            return {
                items: state.items.map((i) =>
                    i.product.id === action.productId ? { ...i, quantity: action.qty } : i
                ),
            };
        case "CLEAR":
            return { items: [] };
        case "LOAD":
            return { items: action.items };
        default:
            return state;
    }
}

const CartContext = createContext<{
    items: CartItem[];
    total: number;
    count: number;
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    setQty: (productId: number, qty: number) => void;
    clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    // Persist to localStorage
    useEffect(() => {
        const saved = localStorage.getItem("hamberger_cart");
        if (saved) {
            try {
                dispatch({ type: "LOAD", items: JSON.parse(saved) });
            } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("hamberger_cart", JSON.stringify(state.items));
    }, [state.items]);

    const total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                total,
                count,
                addItem: (p) => dispatch({ type: "ADD", product: p }),
                removeItem: (id) => dispatch({ type: "REMOVE", productId: id }),
                setQty: (id, qty) => dispatch({ type: "SET_QTY", productId: id, qty }),
                clearCart: () => dispatch({ type: "CLEAR" }),
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}
