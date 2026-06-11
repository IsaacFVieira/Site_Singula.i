'use client';

import React, { useState, useEffect, useRef } from "react";
import { Download, Building2, ChevronUp } from "lucide-react";
import DownloadModal from "@/components/download/DownloadModal";

interface ScrollDownloadFormProps {
  productId: string;
  productName: string;
  fileName: string;
}

const ScrollDownloadForm: React.FC<ScrollDownloadFormProps> = ({
  productId,
  productName,
  fileName
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: "0px"
      }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        ref={formRef}
        className={`relative bg-gradient-to-br from-[#00ff9d] to-[#00cc7d] rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden transition-all duration-1000 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20"
        }`}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--foreground)]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--foreground)]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[var(--foreground)]/20 rounded-xl backdrop-blur-sm">
              <Download className="w-6 h-6 text-[var(--foreground)]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1a1a2e]">
                Baixar {productName}
              </h3>
              <p className="text-[#1a1a2e]/70 text-xs sm:text-sm">
                Comece a usar agora mesmo
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadClick}
            className="w-full py-3 px-4 sm:py-4 sm:px-6 bg-white text-[#1E40AF] font-semibold rounded-xl hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Iniciar Download</span>
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Download Modal */}
      <DownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productName={productName}
        fileName={fileName}
      />
    </>
  );
};

export default ScrollDownloadForm;
