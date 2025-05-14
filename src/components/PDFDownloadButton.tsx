
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PDFDownloadButton = () => {
  const handleDownload = async () => {
    const contentElement = document.getElementById('root');
    if (!contentElement) return;

    try {
      // Show loading or notification
      const notify = () => {
        const event = new CustomEvent('toast', {
          detail: {
            title: 'Creating PDF',
            description: 'Please wait while we prepare your download...',
          },
        });
        document.dispatchEvent(event);
      };
      notify();
      
      // Add a class to the body to hide elements not needed in PDF
      document.body.classList.add('creating-pdf');
      
      // Create a style element to hide elements with the logo-change-btn class
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .creating-pdf [data-pdf-hide="true"] {
          display: none !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Find logo change button and add data attribute
      const logoChangeButtons = document.querySelectorAll('button:has(.h-4.w-4)');
      logoChangeButtons.forEach(btn => {
        if (btn.textContent?.includes('Change Logo')) {
          btn.setAttribute('data-pdf-hide', 'true');
        }
      });
      
      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      // Remove the temporary styling
      document.body.classList.remove('creating-pdf');
      document.head.removeChild(styleElement);
      
      // Remove the data attributes
      logoChangeButtons.forEach(btn => {
        if (btn.hasAttribute('data-pdf-hide')) {
          btn.removeAttribute('data-pdf-hide');
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width * 0.5, canvas.height * 0.5],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.5, canvas.height * 0.5);
      pdf.save('dually-roi-insights.pdf');
      
      // Show success notification
      const successNotify = () => {
        const event = new CustomEvent('toast', {
          detail: {
            title: 'Download Ready',
            description: 'Your PDF has been created successfully!',
            variant: 'success',
          },
        });
        document.dispatchEvent(event);
      };
      successNotify();
    } catch (error) {
      console.error('PDF generation error:', error);
      
      // Show error notification
      const errorNotify = () => {
        const event = new CustomEvent('toast', {
          detail: {
            title: 'Download Failed',
            description: 'There was an error creating your PDF. Please try again.',
            variant: 'destructive',
          },
        });
        document.dispatchEvent(event);
      };
      errorNotify();
    }
  };

  return (
    <div className="flex justify-center mt-4 mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-400 hover:text-gray-600" 
        onClick={handleDownload}
      >
        <Download className="h-4 w-4 mr-1" />
        <span className="text-xs">Download Report</span>
      </Button>
    </div>
  );
};

export default PDFDownloadButton;
