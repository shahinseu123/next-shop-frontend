"use client";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

export function ImageCell({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <span className="text-sm font-bold text-gray-400">
          {alt.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-10 h-10">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain rounded"
      />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {status}
    </span>
  );
}

export function PriceCell({ price, currency = "$" }: { price: number; currency?: string }) {
  return (
    <span className="font-medium text-gray-900">
      {currency}{price.toFixed(2)}
    </span>
  );
}

export function DateCell({ date }: { date: string }) {
  return (
    <span className="text-gray-500">
      {new Date(date).toLocaleDateString()}
    </span>
  );
}