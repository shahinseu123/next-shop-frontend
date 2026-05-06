import Image from "next/image";
import Link from "next/link";

interface Brand {
  id: number;
  name: string;
  logoUrl: string;
  slug: string | null;
}

interface BrandCardProps {
  brand: Brand;
  variant?: "default" | "compact" | "featured" | "logo-only";
  href?: string;
}

export function BrandCard({
  brand,
  variant = "default",
  href,
}: BrandCardProps) {
  const { id, name, logoUrl, slug } = brand;
  const linkUrl = href || (slug ? `/brands/${slug}` : `/brands/${id}`);

  // const getImageUrl = () => {
  //   if (!logoUrl) return null;
  //   return `https://spring-shop-backend-production.up.railway.app${logoUrl}`;
  // };

  const formatBrandName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Logo-only variant
  if (variant === "logo-only") {
    return (
      <Link href={linkUrl} className="group block">
        <div className="flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-md overflow-hidden group-hover:shadow-xl transition-all duration-300">
            {logoUrl ? (
              <Image
                src={logoUrl!}
                alt={name}
                unoptimized={true}
                fill
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                sizes="80px"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-white font-bold text-xl">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
            {formatBrandName(name)}
          </span>
        </div>
      </Link>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Link href={linkUrl} className="group block">
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-all">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                unoptimized={true}
                fill
                className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                sizes="56px"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-white font-bold text-lg">
                  {name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {formatBrandName(name)}
            </h4>
            <p className="text-xs text-gray-400 mt-1 group-hover:text-blue-500 transition-colors">
              View Collection →
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </Link>
    );
  }

  // Featured variant
  if (variant === "featured") {
    return (
      <Link href={linkUrl} className="group block">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="relative w-32 h-32 mx-auto mb-5 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-lg overflow-hidden ring-4 ring-white/20 group-hover:ring-white/40 transition-all">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={name}
                  fill
                  unoptimized={true}
                  className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  sizes="128px"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-indigo-600">
                  <span className="text-white font-bold text-3xl">
                    {name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {formatBrandName(name)}
            </h3>
            <div className="inline-flex items-center gap-2 text-white/80 group-hover:text-white group-hover:gap-3 transition-all">
              <span className="text-sm">Shop Now</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant - Modern Glassmorphism Style
  return (
    <Link href={linkUrl} className="group block">
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Image Container with Overlay */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {logoUrl ? (
            <>
              <Image
                src={logoUrl}
                alt={name}
                fill
                unoptimized={true}
                className="object-contain p-6 transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              {/* Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold text-4xl">
                  {name.charAt(0)}
                </span>
              </div>
            </div>
          )}

          {/* Badge - Optional */}
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-white text-xs">Brand</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 text-center z-10">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
            {formatBrandName(name)}
          </h3>

          {/* Decorative Line */}
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-2 mb-3 group-hover:w-20 transition-all duration-300" />

          <div className="mt-3 inline-flex items-center gap-2 text-gray-500 group-hover:text-blue-600 transition-all">
            <span className="text-sm font-medium">Discover</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>

          {/* Optional: Show if slug is missing */}
          {!slug && (
            <div className="mt-3 inline-flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full">
              <span>✨</span>
              <span>Coming Soon</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
