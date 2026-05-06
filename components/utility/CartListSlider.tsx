"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ReactNode } from "react";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
    partialVisibilityGutter: 20
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    partialVisibilityGutter: 20
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 3,
    partialVisibilityGutter: 15
  },
  smallTablet: {
    breakpoint: { max: 640, min: 464 },
    items: 2,
    partialVisibilityGutter: 10
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    partialVisibilityGutter: 10
  },
};

interface CardListSliderProps {
  children: ReactNode;
  deviceType?: string;
  title?: string;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
  infinite?: boolean;
  showArrows?: boolean;
}

export const CardListSlider = ({ 
  children, 
  deviceType, 
  title,
  showDots = false,
  autoPlay = true,
  autoPlaySpeed = 3000,
  infinite = true,
  showArrows = true
}: CardListSliderProps) => {
  
  // Don't render if no children
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null;
  }

  return (
    <div className=" shop-container border border-gray-100  rounded-lg ">
      {title && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <div className="hidden md:block text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
            View All →
          </div>
        </div>
      )}
      
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={showDots}
        responsive={responsive}
        ssr={true}
        infinite={infinite}
        autoPlay={autoPlay}
        autoPlaySpeed={autoPlaySpeed}
        keyBoardControl={true}
        customTransition="transform 500ms ease-in-out"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={showArrows ? ["tablet", "mobile"] : ["desktop", "tablet", "mobile"]}
        deviceType={deviceType}
        dotListClass="custom-dot-list"
        itemClass="carousel-item"
        arrows={showArrows}
        partialVisible={true}
      >
        {children}
      </Carousel>
      
      <style jsx global>{`
        .carousel-container {
          padding: 10px 0;
        }
        
        .carousel-item {
          padding: 0 8px;
        }
        
        .custom-dot-list {
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 8px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .custom-dot-list button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #d1d5db;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .custom-dot-list .react-multi-carousel-dot--active button {
          background-color: #3b82f6;
          width: 24px;
          border-radius: 4px;
        }
        
        /* Custom Arrows */
        .react-multiple-carousel__arrow {
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .react-multiple-carousel__arrow:hover {
          background: #3b82f6;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        
        .react-multiple-carousel__arrow::before {
          color: #4b5563;
          font-size: 20px;
        }
        
        .react-multiple-carousel__arrow:hover::before {
          color: white;
        }
        
        @media (max-width: 768px) {
          .react-multiple-carousel__arrow {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};