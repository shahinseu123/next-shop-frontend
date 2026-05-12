// components/cart/QuantityControl.tsx
"use client";

import { Minus, Plus, Loader2 } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";

interface QuantityControlProps {
  itemId: number;
  quantity: number;
  minQuantity?: number;
  maxQuantity?: number;
  onUpdate: (itemId: number, quantity: number) => Promise<boolean>;
  size?: 'sm' | 'md';
}

export function QuantityControl({ 
  itemId, 
  quantity: externalQuantity, 
  minQuantity = 1,
  maxQuantity = 99,
  onUpdate,
  size = 'md'
}: QuantityControlProps) {
  // Local state - completely isolated
  const [localQuantity, setLocalQuantity] = useState(externalQuantity);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Use refs to track without causing re-renders
  const itemIdRef = useRef(itemId);
  const updatingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Sync external quantity changes only when not updating
  useEffect(() => {
    if (!updatingRef.current && itemId === itemIdRef.current) {
      setLocalQuantity(externalQuantity);
    }
  }, [externalQuantity, itemId]);

  // Handle itemId change
  useEffect(() => {
    if (itemId !== itemIdRef.current) {
      itemIdRef.current = itemId;
      setLocalQuantity(externalQuantity);
    }
  }, [itemId, externalQuantity]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleQuantityChange = useCallback(async (newQuantity: number) => {
    // Validation
    if (
      newQuantity < minQuantity || 
      newQuantity > maxQuantity || 
      updatingRef.current ||
      newQuantity === localQuantity
    ) return;

    // Set updating flag
    updatingRef.current = true;
    setIsUpdating(true);
    
    // Optimistic update
    setLocalQuantity(newQuantity);
    
    try {
      await onUpdate(itemId, newQuantity);
    } catch (error) {
      // Revert on error
      setLocalQuantity(externalQuantity);
      console.error('Failed to update quantity:', error);
    } finally {
      // Small delay before allowing next update
      timeoutRef.current = setTimeout(() => {
        updatingRef.current = false;
        setIsUpdating(false);
      }, 300);
    }
  }, [itemId, externalQuantity, localQuantity, minQuantity, maxQuantity, onUpdate]);

  const isSm = size === 'sm';

  return (
    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
      <button
        onClick={() => handleQuantityChange(localQuantity - 1)}
        disabled={localQuantity <= minQuantity || isUpdating}
        className={`
          rounded hover:bg-white transition-all disabled:opacity-40 hover:shadow-sm
          flex items-center justify-center
          ${isSm ? 'p-0.5 w-5 h-5' : 'p-1 w-6 h-6 sm:w-7 sm:h-7'}
        `}
        aria-label="Decrease quantity"
      >
        <Minus className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-3.5 sm:h-3.5'} />
      </button>
      
      <span className={`
        text-center font-medium text-gray-900 flex items-center justify-center
        ${isSm ? 'w-6 text-xs' : 'w-8 text-sm'}
      `}>
        {isUpdating ? (
          <Loader2 className={`animate-spin ${isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
        ) : (
          localQuantity
        )}
      </span>
      
      <button
        onClick={() => handleQuantityChange(localQuantity + 1)}
        disabled={localQuantity >= maxQuantity || isUpdating}
        className={`
          rounded hover:bg-white transition-all hover:shadow-sm disabled:opacity-40
          flex items-center justify-center
          ${isSm ? 'p-0.5 w-5 h-5' : 'p-1 w-6 h-6 sm:w-7 sm:h-7'}
        `}
        aria-label="Increase quantity"
      >
        <Plus className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3 sm:w-3.5 sm:h-3.5'} />
      </button>
    </div>
  );
}