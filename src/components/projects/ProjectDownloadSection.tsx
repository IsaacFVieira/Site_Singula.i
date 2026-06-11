'use client';

import React, { useState } from "react";
import Button from "@/components/ui/Button";
// import DownloadModal from "@/components/download/DownloadModal";

interface ProjectDownloadSectionProps {
  projectId: string;
  projectName: string;
  fileName: string;
}

const ProjectDownloadSection: React.FC<ProjectDownloadSectionProps> = ({
  projectId,
  projectName,
  fileName
}) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <>
      {/* Project Download Counter */}
      <div className="mb-8 max-w-md">
        {/* Temporarily disabled */}
      </div>

      {/* Download Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={() => setIsDownloadModalOpen(true)}
        className="bg-[var(--accent)] hover:bg-[var(--primary)] text-[#1a1a2e]"
      >
        Baixar {projectName}
      </Button>

      {/* Download Modal */}
      {/* Download Modal */}
      {/* Temporarily disabled due to TypeScript error */}
      {/* <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        productId={projectId}
        productName={projectName}
        fileName={fileName}
      /> */}
    </>
  );
};
