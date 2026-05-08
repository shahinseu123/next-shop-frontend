"use client";

import Image from "next/image";
import { useMemo, useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductDetailsSlider({
  sliders,
}: {
  sliders: Array<string>;
}) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [magnifierImagePosition, setMagnifierImagePosition] = useState({ x: 0, y: 0 });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  const imageRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const processedImages = useMemo(() => {
    if (!sliders || sliders.length === 0) return [];

    const allImages: string[] = [];

    sliders.forEach((item) => {
      try {
        if (
          typeof item === "string" &&
          item.trim().startsWith("[") &&
          item.trim().endsWith("]")
        ) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) {
            allImages.push(...parsed);
          } else {
            allImages.push(item);
          }
        } else {
          allImages.push(item);
        }
      } catch (error) {
        console.error("Failed to parse image:", item, error);
        allImages.push(item);
      }
    });

    return allImages;
  }, [sliders]);

  const currentImage = processedImages[selectedImageIndex] || "";

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMagnifierPosition({
      x: e.clientX - left,
      y: e.clientY - top,
    });

    setMagnifierImagePosition({
      x,
      y,
    });
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailsRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = thumbnailsRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      
      thumbnailsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const checkScrollButtons = () => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [processedImages]);

  useEffect(() => {
    if (selectedImageIndex !== undefined && thumbnailsRef.current) {
      const thumbnailElement = thumbnailsRef.current.children[selectedImageIndex] as HTMLElement;
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedImageIndex]);

  if (!processedImages.length) {
    return (
      <div className="product-slider-wrapper">
        <div className="no-images">
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-slider-wrapper">
      {/* Main Product Image */}
      <div className="main-image-card">
        <div
          ref={imageRef}
          className="main-image-container"
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onMouseMove={handleMouseMove}
        >
          {currentImage && !imageErrors[selectedImageIndex] ? (
            <>
              <div className="image-wrapper">
                <Image
                  src={currentImage}
                  alt={`Product image ${selectedImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="main-image"
                  onError={() => handleImageError(selectedImageIndex)}
                  unoptimized={true}
                  priority
                />
              </div>

              {/* Rounded Magnifier */}
              {showMagnifier && (
                <div
                  className="rounded-magnifier"
                  style={{
                    left: magnifierPosition.x,
                    top: magnifierPosition.y,
                  }}
                >
                  <div
                    className="magnifier-zoom"
                    style={{
                      backgroundImage: `url(${currentImage})`,
                      backgroundPosition: `${magnifierImagePosition.x}% ${magnifierImagePosition.y}%`,
                      backgroundSize: "300%",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="image-error">
              <span>Failed to load image</span>
            </div>
          )}
        </div>

        {/* Image Counter Badge */}
        <div className="image-counter">
          {selectedImageIndex + 1} / {processedImages.length}
        </div>
      </div>

      {/* Thumbnail Navigation with Arrows */}
      <div className="thumbnails-container">
        {showLeftArrow && (
          <button
            className="scroll-arrow left"
            onClick={() => scrollThumbnails("left")}
            aria-label="Previous thumbnails"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div
          ref={thumbnailsRef}
          className="thumbnails-wrapper"
          onScroll={checkScrollButtons}
        >
          {processedImages.map((slide, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`thumbnail-btn ${selectedImageIndex === index ? "active" : ""}`}
            >
              <div className="thumbnail-image-wrapper">
                {!imageErrors[index] ? (
                  <Image
                    src={slide}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="thumbnail-image"
                    onError={() => handleImageError(index)}
                    unoptimized={true}
                  />
                ) : (
                  <div className="thumbnail-error">!</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            className="scroll-arrow right"
            onClick={() => scrollThumbnails("right")}
            aria-label="Next thumbnails"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <style jsx>{`
        .product-slider-wrapper {
          width: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 20px;
          display: inline-block;
        }

        /* Main Image Card */
        .main-image-card {
          position: relative;
          margin-bottom: 20px;
        }

        .main-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
          border-radius: 16px;
          overflow: hidden;
          cursor: crosshair;
        }

        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .main-image {
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        /* Rounded Magnifier */
        .rounded-magnifier {
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 20;
          box-shadow: 0 0 0 4px rgba(232, 255, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.15);
          overflow: hidden;
          backdrop-filter: blur(2px);
          animation: pulse 0.3s ease;
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        .magnifier-zoom {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          border-radius: 50%;
        }

        /* Image Counter */
        .image-counter {
          position: absolute;
          bottom: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          z-index: 10;
        }

        /* Thumbnails Container with Arrows */
        .thumbnails-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .scroll-arrow {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .scroll-arrow:hover {
          background: #f9fafb;
          border-color: #d1d5db;
          transform: scale(1.05);
        }

        .scroll-arrow:active {
          transform: scale(0.95);
        }

        .thumbnails-wrapper {
          flex: 1;
          display: flex;
          gap: 12px;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .thumbnails-wrapper::-webkit-scrollbar {
          display: none;
        }

        .thumbnail-btn {
          flex-shrink: 0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s ease;
        }

        .thumbnail-btn:hover {
          transform: translateY(-2px);
        }

        .thumbnail-image-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          background: #f0f0f0;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .thumbnail-btn.active .thumbnail-image-wrapper {
          border-color: #e8ff00;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: scale(1.05);
        }

        .thumbnail-image {
          object-fit: cover;
        }

        .thumbnail-error {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          color: #999;
          font-size: 20px;
          font-weight: bold;
        }

        .image-error {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          color: #999;
          border-radius: 16px;
        }

        .no-images {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          border-radius: 16px;
          color: #666;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .product-slider-wrapper {
            padding: 16px;
          }

          .rounded-magnifier {
            width: 140px;
            height: 140px;
          }

          .thumbnail-image-wrapper {
            width: 65px;
            height: 65px;
          }

          .scroll-arrow {
            width: 32px;
            height: 32px;
          }

          .thumbnails-wrapper {
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .rounded-magnifier {
            width: 110px;
            height: 110px;
          }

          .thumbnail-image-wrapper {
            width: 55px;
            height: 55px;
          }

          .scroll-arrow {
            width: 28px;
            height: 28px;
          }

          .scroll-arrow .w-5 {
            width: 16px;
            height: 16px;
          }
        }
      `}</style>
    </div>
  );
}