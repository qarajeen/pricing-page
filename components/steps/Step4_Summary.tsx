import React, { useState, useEffect } from 'react';
import type { QuoteFormData, Quote } from '../../types';
import { calculateQuote } from '../../services/pricingService';
import { QuoteDisplay } from '../QuoteDisplay';
import { formatCurrency } from '../../utils/formatters';
import { supabaseClient as supabase } from '../../services/supabaseClient';

// Add type declarations for CDN libraries to avoid TypeScript errors
declare global {
  interface Window {
    jspdf: any;
  }
}

interface Step4Props {
  formData: QuoteFormData;
  onBack: () => void;
  onReset: () => void;
}

const GeneratingQuoteAnimation: React.FC = () => (
    <div className="flex justify-center items-center p-8 my-4">
        <svg width="120" height="150" viewBox="0 0 120 150" className="text-studio-gold">
            {/* Page Outline */}
            <path d="M10 1 H110 V149 H10 Z" fill="none" stroke="currentColor" strokeWidth="2" className="animate-draw-line" />
            
            {/* Text Lines */}
            <line x1="25" y1="30" x2="95" y2="30" stroke="currentColor" strokeWidth="2" className="opacity-0 animate-fill-in" style={{ animationDelay: '0.6s' }} />
            <line x1="25" y1="45" x2="75" y2="45" stroke="currentColor" strokeWidth="2" className="opacity-0 animate-fill-in" style={{ animationDelay: '0.7s' }} />
            
            <line x1="25" y1="65" x2="95" y2="65" stroke="currentColor" strokeWidth="1" className="opacity-0 animate-fill-in" style={{ animationDelay: '0.8s' }} />
            <line x1="25" y1="75" x2="95" y2="75" stroke="currentColor" strokeWidth="1" className="opacity-0 animate-fill-in" style={{ animationDelay: '0.85s' }} />
            <line x1="25" y1="85" x2="65" y2="85" stroke="currentColor" strokeWidth="1" className="opacity-0 animate-fill-in" style={{ animationDelay: '0.9s' }} />

            {/* Final Stamp */}
            <g transform="translate(75 110) scale(1.5)" className="opacity-0 animate-pop-in" style={{ animationDelay: '1s' }}>
                <circle cx="0" cy="0" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M-5 0 L-1 4 L5 -4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    </div>
);

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const Step4_Summary: React.FC<Step4Props> = ({ formData, onBack, onReset }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationState, setGenerationState] = useState<'generating' | 'complete'>('generating');

  // New function to save the quote to the database
  const saveQuoteToDatabase = async (quoteData: Quote) => {
    try {
        const { error: dbError } = await supabase.from('quotes').insert({
            quote_number: quoteData.quoteNumber,
            quote_date: quoteData.date,
            client_name: quoteData.clientName,
            client_email: quoteData.clientEmail,
            client_phone: quoteData.clientPhone,
            client_company: quoteData.clientCompany,
            project_name: quoteData.projectName,
            line_items: quoteData.lineItems,
            subtotal: quoteData.subtotal,
            grand_total: quoteData.grandTotal,
            notes: quoteData.notes,
        });

        if (dbError) {
            throw dbError;
        }
    } catch (err) {
        // Log the error for debugging, but don't show it to the user
        // as the primary action (quote generation) was successful.
        console.error("Error saving quote to database:", err);
    }
  };


  useEffect(() => {
    const timer = setTimeout(() => {
        try {
            setError(null);
            const calculatedQuote = calculateQuote(formData);
            setQuote(calculatedQuote);
            setGenerationState('complete');
            
            // --- NEW: Save the quote after it's successfully generated ---
            saveQuoteToDatabase(calculatedQuote);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred while generating the quote.');
            }
            setGenerationState('complete'); // Stop loading even on error
        }
    }, 1500); // Wait for the animation
    return () => clearTimeout(timer);
  }, [formData]);

  const handleExportPDF = async () => {
    if (!quote) return;
    try {
        const response = await fetch('./4.png');
        if (!response.ok) throw new Error('Logo image not found at ./4.png. Make sure it is in the public folder.');
        const blob = await response.blob();
        const logoBase64 = await blobToBase64(blob);

        const img = new Image();
        img.src = logoBase64;
        await new Promise(resolve => { img.onload = resolve; });

        // --- Canvas Cropping Logic ---
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        const cropTop = img.height * 0.25;
        const cropHeight = img.height * 0.5;
        canvas.width = img.width;
        canvas.height = cropHeight;
        ctx.drawImage(img, 0, cropTop, img.width, cropHeight, 0, 0, img.width, cropHeight);
        const croppedLogoBase64 = canvas.toDataURL('image/png');
        // --- End Cropping Logic ---

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        
        const pageHeight = pdf.internal.pageSize.getHeight();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let y = margin;
        
        // --- COLORS & FONTS ---
        const brandColor = '#D6B585';
        const textColor = '#212020';
        const mutedTextColor = '#555555';
        const headerTextColor = '#FFFFFF';
        const lightGray = '#F5F5F5';
        
        pdf.setTextColor(textColor);

        // --- HEADER ---
        const imgWidth = 25;
        const imgHeight = (cropHeight * imgWidth) / img.width; // Use cropped height for aspect ratio
        pdf.addImage(croppedLogoBase64, 'PNG', margin, y, imgWidth, imgHeight);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(textColor);
        pdf.text('QUOTATION', pageWidth - margin, y + (imgHeight/2) - 5, { align: 'right' });
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(mutedTextColor);
        pdf.text(`Quote #: ${quote.quoteNumber}`, pageWidth - margin, y + (imgHeight/2) + 2, { align: 'right' });
        pdf.text(`Date: ${quote.date}`, pageWidth - margin, y + (imgHeight/2) + 7, { align: 'right' });

        y += Math.max(imgHeight, 12) + 18; // Adjust y position after header

        // --- CLIENT INFO ---
        const clientInfoBoxHeight = 32;
        pdf.setFillColor(lightGray);
        pdf.rect(margin, y, pageWidth - (margin * 2), clientInfoBoxHeight, 'F');
        
        let clientX = margin + 5;
        let clientY = y + 7;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(mutedTextColor);
        pdf.text('PREPARED FOR', clientX, clientY);
        
        clientY += 7;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(textColor);
        pdf.text(quote.clientName, clientX, clientY);

        if (quote.clientCompany) {
            clientY += 5;
            pdf.setFontSize(10);
            pdf.text(quote.clientCompany, clientX, clientY);
        }
        clientY += 6;
        pdf.setFontSize(9);
        pdf.text([quote.clientEmail, quote.clientPhone].filter(Boolean).join(' | '), clientX, clientY);
        
        let projectX = margin + 90;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(mutedTextColor);
        pdf.text('PROJECT', projectX, y + 7);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(textColor);
        pdf.text(quote.projectName, projectX, y + 14);

        y += clientInfoBoxHeight + 10;
        
        // --- TABLE ---
        const tableHeaders = ['DESCRIPTION', 'QTY', 'RATE', 'TOTAL'];
        const tableColumnWidths = [100, 20, 30, 30];
        const tableHeaderY = y;
        
        pdf.setFillColor(brandColor);
        pdf.rect(margin, tableHeaderY, pageWidth - (margin * 2), 10, 'F');
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(headerTextColor);
        let currentX = margin + 5;
        tableHeaders.forEach((header, i) => {
            let align = 'left';
            if (i > 0) {
                align = 'right';
                currentX = margin + tableColumnWidths.slice(0, i+1).reduce((a, b) => a + b, 0) - 5;
            }
            pdf.text(header, currentX, tableHeaderY + 7, { align: align as any });
        });

        y += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(textColor);

        quote.lineItems.forEach((item, index) => {
            if (index % 2 === 1) {
                pdf.setFillColor(lightGray);
                pdf.rect(margin, y, pageWidth - (margin * 2), 10, 'F');
            }
            
            const descriptionLines = pdf.splitTextToSize(item.description, tableColumnWidths[0] - 5);
            pdf.text(descriptionLines, margin + 5, y + 6);
            pdf.text(item.quantity.toString(), margin + tableColumnWidths[0] + tableColumnWidths[1] - 5, y + 6, { align: 'right' });
            pdf.text(formatCurrency(item.rate), margin + tableColumnWidths[0] + tableColumnWidths[1] + tableColumnWidths[2] - 5, y + 6, { align: 'right' });
            pdf.text(formatCurrency(item.total), margin + tableColumnWidths.reduce((a,b) => a+b, 0) - 5, y + 6, { align: 'right' });
            
            y += 10;
        });

        y += 5;
        
        // --- TOTALS ---
        const totalX = pageWidth - margin - 70;
        
        pdf.setFontSize(12);
        pdf.text('Total', totalX + 30, y, { align: 'right' });
        pdf.text(formatCurrency(quote.grandTotal), totalX + 70, y, { align: 'right' });
        
        y += 10;

        // --- NOTES ---
        if (quote.notes) {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(10);
            pdf.text('Notes', margin, y);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(mutedTextColor);
            const notesLines = pdf.splitTextToSize(quote.notes, pageWidth - (margin * 2));
            pdf.text(notesLines, margin, y + 5);
        }
        
        // --- FOOTER ---
        const footerY = pageHeight - 20;
        pdf.setDrawColor(lightGray);
        pdf.line(margin, footerY, pageWidth - margin, footerY);
        pdf.setFontSize(9);
        pdf.setTextColor(mutedTextColor);
        pdf.text('Thank you for your business!', pageWidth / 2, footerY + 8, { align: 'center' });
        
        pdf.setFontSize(8);
        const contactInfo = `hi@studioo.ae  |  +971 58 658 3939`;
        pdf.text(contactInfo, pageWidth / 2, footerY + 13, { align: 'center' });

        pdf.save(`Quote-STUDIOO-${quote.quoteNumber}.pdf`);
    } catch (pdfError) {
        console.error("Failed to generate PDF:", pdfError);
        alert("Could not generate PDF. Please try again.");
    }
  };

  if (generationState === 'generating') {
    return (
        <div>
            <h2 className="text-2xl font-bold text-center text-metallic mb-2 uppercase tracking-wider font-serif">
                Putting Your Quote Together...
            </h2>
            <p className="text-center text-studio-text-dark/70 dark:text-studio-text-light/70 mb-4">Just a moment while we put everything together.</p>
            <GeneratingQuoteAnimation />
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-metallic mb-6 uppercase tracking-wider font-serif">
        Your Personalized Quote is Ready!
      </h2>
      
      {error && (
        <div className="text-center p-4 bg-red-900/30 border border-red-600 text-red-300 rounded-lg mb-6">
          <p className="font-bold">Error Generating Quote</p>
          <p>{error}</p>
        </div>
      )}
      
      {quote && !error && (
        <QuoteDisplay quote={quote} />
      )}

      {/* Actions */}
      <div className="text-center mt-10 no-print flex flex-col items-center gap-4">
        {quote && !error && (
          <button onClick={handleExportPDF} className="btn-glossy btn-glossy-gold font-bold py-3 px-8 rounded-full transition w-full sm:w-auto font-sans">
            Export as PDF
          </button>
        )}
        <button onClick={onReset} className="btn-glossy btn-glossy-silver font-bold py-3 px-8 rounded-full transition w-full sm:w-auto font-sans">
            Create a New Quote
        </button>
      </div>
      <div className="text-center mt-6">
        <button onClick={onBack} className="text-sm font-semibold text-studio-text-dark/60 dark:text-studio-text-light/60 hover:text-studio-gold dark:hover:text-studio-gold transition">
            &larr; Go back to make changes
        </button>
      </div>

    </div>
  );
};