import { SliderType } from "@/type/shop";
import Image from "next/image";

export const SliderItem = ({ slide }: { slide: SliderType }) => {
  return (
    <div className="relative w-full h-[350px] overflow-hidden">
      <div className="hidden md:block relative w-full h-full">
        <Image
          src={slide.imageUrl}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          unoptimized={true}
          sizes="100vw" 
        />
      </div>
      
      {/* Mobile Image */}
      <div className="block md:hidden relative w-full h-full">
        <Image
          src={slide.mobileImageUrl}
          alt={slide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw" // Add sizes prop
          unoptimized={true} // Add this for localhost images
        />
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-4 md:px-20 lg:px-32">
        <div className="max-w-2xl">
          {slide.subtitle && (
            <p className="text-white text-sm md:text-base lg:text-lg mb-2 md:mb-4 animate-fadeIn">
              {slide.subtitle}
            </p>
          )}
          
          <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6 animate-slideInUp">
            {slide.title}
          </h2>
          
          {slide.description && (
            <p className="text-white text-sm md:text-base lg:text-lg opacity-90 line-clamp-3 md:line-clamp-none">
              {slide.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};