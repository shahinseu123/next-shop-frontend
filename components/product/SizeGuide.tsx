"use client"
import { Ruler, X, ChevronRight,  Shirt, Ruler as RulerIcon, Weight } from "lucide-react";
import { useState } from "react";

interface SizeGuideProps {
  isOpen?: boolean;
  onClose?: () => void;
}

// Mock size chart data for different categories
const sizeCharts = {
  clothing: {
    title: "Clothing Size Guide",
    description: "Find your perfect fit with our detailed size chart",
    measurements: ["Chest", "Waist", "Hip", "Length"],
    sizes: [
      { size: "XS", chest: "32-34", waist: "24-26", hip: "33-35", length: "27", us: "0-2", uk: "4-6", eu: "32-34" },
      { size: "S", chest: "35-37", waist: "27-29", hip: "36-38", length: "28", us: "4-6", uk: "8-10", eu: "36-38" },
      { size: "M", chest: "38-40", waist: "30-32", hip: "39-41", length: "29", us: "8-10", uk: "12-14", eu: "40-42" },
      { size: "L", chest: "41-43", waist: "33-35", hip: "42-44", length: "30", us: "12-14", uk: "16-18", eu: "44-46" },
      { size: "XL", chest: "44-46", waist: "36-38", hip: "45-47", length: "31", us: "16-18", uk: "20-22", eu: "48-50" },
      { size: "XXL", chest: "47-49", waist: "39-41", hip: "48-50", length: "32", us: "20-22", uk: "24-26", eu: "52-54" },
    ],
  },
  shoes: {
    title: "Shoe Size Guide",
    description: "Convert between international shoe sizes",
    measurements: ["Foot Length (cm)", "Foot Length (in)"],
    sizes: [
      { size: "US 5", uk: "3", eu: "36", footCM: "22.0", footIN: "8.66" },
      { size: "US 6", uk: "4", eu: "37", footCM: "22.9", footIN: "9.02" },
      { size: "US 7", uk: "5", eu: "38", footCM: "23.8", footIN: "9.37" },
      { size: "US 8", uk: "6", eu: "39", footCM: "24.6", footIN: "9.69" },
      { size: "US 9", uk: "7", eu: "40.5", footCM: "25.4", footIN: "10.00" },
      { size: "US 10", uk: "8", eu: "41.5", footCM: "26.0", footIN: "10.24" },
      { size: "US 11", uk: "9", eu: "42.5", footCM: "27.0", footIN: "10.63" },
      { size: "US 12", uk: "10", eu: "44", footCM: "27.9", footIN: "10.98" },
    ],
  },
  jeans: {
    title: "Jeans & Bottoms Size Guide",
    description: "Find your perfect waist and inseam fit",
    measurements: ["Waist", "Hip", "Inseam", "Thigh"],
    sizes: [
      { size: "28", waist: "28-29", hip: "34-35", inseam: "30", thigh: "20-21", us: "XS" },
      { size: "29", waist: "29-30", hip: "35-36", inseam: "30", thigh: "21-22", us: "S" },
      { size: "30", waist: "30-31", hip: "36-37", inseam: "31", thigh: "22-23", us: "S" },
      { size: "31", waist: "31-32", hip: "37-38", inseam: "31", thigh: "23-24", us: "M" },
      { size: "32", waist: "32-33", hip: "38-39", inseam: "32", thigh: "24-25", us: "M" },
      { size: "33", waist: "33-34", hip: "39-40", inseam: "32", thigh: "25-26", us: "L" },
      { size: "34", waist: "34-35", hip: "40-41", inseam: "33", thigh: "26-27", us: "L" },
      { size: "36", waist: "36-37", hip: "42-43", inseam: "33", thigh: "27-28", us: "XL" },
      { size: "38", waist: "38-39", hip: "44-45", inseam: "34", thigh: "28-29", us: "XXL" },
    ],
  },
};

type CategoryType = "clothing" | "shoes" | "jeans";

export default function SizeGuide({ isOpen: externalIsOpen, onClose: externalOnClose }: SizeGuideProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("clothing");
  const [unit, setUnit] = useState<"inches" | "cm">("inches");

  const isControlled = externalIsOpen !== undefined;
  const isOpen = isControlled ? externalIsOpen : internalIsOpen;
  
  const handleClose = () => {
    if (isControlled && externalOnClose) {
      externalOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (!isControlled) {
      setInternalIsOpen(true);
    }
  };

  const currentChart = sizeCharts[selectedCategory];

  // Convert measurements based on unit
  const convertToCm = (inches: string) => {
    if (unit === "cm" && !inches.includes("cm")) {
      const parts = inches.split("-");
      if (parts.length === 2) {
        const cmMin = (parseFloat(parts[0]) * 2.54).toFixed(0);
        const cmMax = (parseFloat(parts[1]) * 2.54).toFixed(0);
        return `${cmMin}-${cmMax} cm`;
      }
      return `${(parseFloat(inches) * 2.54).toFixed(0)} cm`;
    }
    return inches;
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors group"
      >
        <Ruler className="w-4 h-4 group-hover:scale-110 transition-transform" />
        Size Guide
      </button>
    );
  }

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-full">
                <RulerIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Size Guide</h2>
                <p className="text-sm text-gray-500">Find your perfect fit</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
              <button
                onClick={() => setSelectedCategory("clothing")}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  selectedCategory === "clothing"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <Shirt className="w-4 h-4 inline mr-2" />
                Clothing
              </button>
              <button
                onClick={() => setSelectedCategory("jeans")}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  selectedCategory === "jeans"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {/* <Tape className="w-4 h-4 inline mr-2" /> */}
                Jeans & Bottoms
              </button>
              <button
                onClick={() => setSelectedCategory("shoes")}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  selectedCategory === "shoes"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                <Ruler className="w-4 h-4 inline mr-2" />
                Shoes
              </button>
            </div>

            {/* Unit Toggle */}
            <div className="flex justify-end mb-6">
              <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
                <button
                  onClick={() => setUnit("inches")}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                    unit === "inches" ? "bg-white shadow-sm text-black" : "text-gray-500"
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnit("cm")}
                  className={`px-4 py-1.5 text-sm rounded-md transition-all ${
                    unit === "cm" ? "bg-white shadow-sm text-black" : "text-gray-500"
                  }`}
                >
                  Centimeters
                </button>
              </div>
            </div>

            {/* Size Chart Description */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">{currentChart.title}</h3>
              <p className="text-sm text-gray-600">{currentChart.description}</p>
            </div>

            {/* Size Chart Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left font-semibold text-sm">Size</th>
                    {selectedCategory === "clothing" && (
                      <>
                        <th className="border p-3 text-left font-semibold text-sm">Chest</th>
                        <th className="border p-3 text-left font-semibold text-sm">Waist</th>
                        <th className="border p-3 text-left font-semibold text-sm">Hip</th>
                        <th className="border p-3 text-left font-semibold text-sm">Length</th>
                        <th className="border p-3 text-left font-semibold text-sm">US</th>
                        <th className="border p-3 text-left font-semibold text-sm">UK</th>
                        <th className="border p-3 text-left font-semibold text-sm">EU</th>
                      </>
                    )}
                    {selectedCategory === "jeans" && (
                      <>
                        <th className="border p-3 text-left font-semibold text-sm">Waist</th>
                        <th className="border p-3 text-left font-semibold text-sm">Hip</th>
                        <th className="border p-3 text-left font-semibold text-sm">Inseam</th>
                        <th className="border p-3 text-left font-semibold text-sm">Thigh</th>
                        <th className="border p-3 text-left font-semibold text-sm">US Size</th>
                      </>
                    )}
                    {selectedCategory === "shoes" && (
                      <>
                        <th className="border p-3 text-left font-semibold text-sm">UK</th>
                        <th className="border p-3 text-left font-semibold text-sm">EU</th>
                        <th className="border p-3 text-left font-semibold text-sm">Foot Length (cm)</th>
                        <th className="border p-3 text-left font-semibold text-sm">Foot Length (in)</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentChart.sizes.map((size, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="border p-3 font-medium text-gray-900">{size.size}</td>
                      {selectedCategory === "clothing" && (
                        <>
                          <td className="border p-3 text-gray-600">{convertToCm(size.chest)}</td>
                          <td className="border p-3 text-gray-600">{convertToCm(size.waist)}</td>
                          <td className="border p-3 text-gray-600">{convertToCm(size.hip)}</td>
                          <td className="border p-3 text-gray-600">{convertToCm(size.length)}</td>
                          <td className="border p-3 text-gray-600">{size.us}</td>
                          <td className="border p-3 text-gray-600">{size.uk}</td>
                          <td className="border p-3 text-gray-600">{size.eu}</td>
                        </>
                      )}
                      {selectedCategory === "jeans" && (
                        <>
                          <td className="border p-3 text-gray-600">{convertToCm(size.waist)}</td>
                          <td className="border p-3 text-gray-600">{convertToCm(size.hip)}</td>
                          <td className="border p-3 text-gray-600">{convertToCm(size.inseam)}</td>
                          <td className="border p-3 text-gray-600">{convertToCm(size.thigh)}</td>
                          <td className="border p-3 text-gray-600">{size.us}</td>
                        </>
                      )}
                      {selectedCategory === "shoes" && (
                        <>
                          <td className="border p-3 text-gray-600">{size.uk}</td>
                          <td className="border p-3 text-gray-600">{size.eu}</td>
                          <td className="border p-3 text-gray-600">{unit === "inches" ? size.footIN : size.footCM}</td>
                          <td className="border p-3 text-gray-600">{unit === "inches" ? size.footIN : size.footCM}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to Measure Section */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tape className="w-5 h-5" />
                How to Measure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                    <RulerIcon className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Chest</h4>
                  <p className="text-sm text-gray-600">Measure around the fullest part of your chest, keeping the tape horizontal</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                    <Tape className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Waist</h4>
                  <p className="text-sm text-gray-600">Measure around your natural waistline, typically the narrowest part</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-white rounded-full w-10 h-10 flex items-center justify-center mb-3">
                    <Weight className="w-5 h-5" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Hip</h4>
                  <p className="text-sm text-gray-600">Measure around the fullest part of your hips, keeping feet together</p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Pro Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• If you're between sizes, we recommend sizing up for a more comfortable fit</li>
                    <li>• Take measurements while wearing thin clothing for accuracy</li>
                    <li>• Use a soft measuring tape and keep it level for best results</li>
                    <li>• Check product-specific size notes as styles may vary</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Still have questions */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Still have questions?{" "}
                <button className="text-black font-medium hover:underline">
                  Contact customer service
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}