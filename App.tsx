
import React, { useState, useCallback, useEffect } from 'react';
import type { Professor, SearchParams } from './types';
import { fetchProfessorDetailsStream } from './services/geminiService';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ProfessorCard from './components/ProfessorCard';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';
import ErrorDisplay from './components/ErrorDisplay';

declare global {
    interface Window {
      lucide: {
        createIcons: () => void;
      };
      jspdf: any;
    }
}

const App: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [professors, isLoading]);

  const handleSearch = useCallback(async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setProfessors([]); // Initialize as empty array to receive streamed results
    
    try {
      await fetchProfessorDetailsStream(
        params,
        (newProfessor) => {
          setProfessors((prev) => [...(prev || []), newProfessor]);
        },
        (e) => {
          setError(e.message || 'An unexpected error occurred during streaming.');
        }
      );
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleDownloadPDF = useCallback(() => {
    if (!professors || professors.length === 0) return;
    
    setError(null); // Clear previous errors before attempting to generate.

    try {
        if (!window.jspdf) {
            throw new Error("PDF generation library (jsPDF) could not be loaded.");
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const usableWidth = pageWidth - 2 * margin;
        let yPos = margin;

        const addText = (text: string, x: number, y: number, options?: any) => {
            const lines = doc.splitTextToSize(text, usableWidth - (x > margin ? (x - margin) : 0));
            doc.text(lines, x, y, options);
            return y + (lines.length * 5); // Approximate line height
        };
        
        const checkPageBreak = (requiredHeight: number) => {
            if (yPos + requiredHeight > pageHeight - margin) {
                doc.addPage();
                yPos = margin;
            }
        };

        doc.setFontSize(22).setFont('helvetica', 'bold');
        yPos = addText('Professor Outreach List', margin, yPos);
        yPos += 10;
        
        professors.forEach((prof, index) => {
            checkPageBreak(60); // Check if there's enough space for a new entry
            
            doc.setDrawColor(200);
            doc.line(margin, yPos - 5, pageWidth - margin, yPos - 5);

            doc.setFontSize(16).setFont('helvetica', 'bold');
            yPos = addText(prof.Name, margin, yPos);

            doc.setFontSize(12).setFont('helvetica', 'normal');
            yPos = addText(`${prof.Designation}, ${prof.Institute}`, margin, yPos + 2);

            if (prof.Email) {
                doc.setTextColor(0, 0, 255);
                yPos = addText(prof.Email, margin, yPos + 2);
                doc.link(margin, yPos - 7, 50, 7, { url: `mailto:${prof.Email}` });
                doc.setTextColor(0);
            }

            if (prof.LinkedIn) {
                doc.setTextColor(0, 0, 255);
                yPos = addText(prof.LinkedIn, margin, yPos + 2);
                doc.link(margin, yPos - 7, usableWidth, 7, { url: prof.LinkedIn });
                doc.setTextColor(0);
            }
            
            if (prof['Institute Website'] && prof['Institute Website'] !== 'Link not working') {
                doc.setTextColor(0, 0, 255);
                yPos = addText(prof['Institute Website'], margin, yPos + 2);
                doc.link(margin, yPos - 7, usableWidth, 7, { url: prof['Institute Website'] });
                doc.setTextColor(0);
            }
            
            yPos += 5;
            doc.setFontSize(11).setFont('helvetica', 'bold');
            yPos = addText('Summary:', margin, yPos);
            doc.setFont('helvetica', 'normal');
            yPos = addText(prof.Summary || "N/A", margin, yPos);
            
            yPos += 3;
            doc.setFont('helvetica', 'bold');
            yPos = addText('Research Interests:', margin, yPos);
            doc.setFont('helvetica', 'normal');
            yPos = addText(prof['Research Interests'] || "N/A", margin, yPos);
            
            if (prof['Internship/Outreach']) {
                yPos += 3;
                doc.setFont('helvetica', 'bold');
                yPos = addText('Internship/Outreach:', margin, yPos);
                doc.setFont('helvetica', 'normal');
                yPos = addText(prof['Internship/Outreach'], margin, yPos);
            }
            
            yPos += 10;
        });

        doc.save("professor_outreach_list.pdf");
    } catch (e: any) {
        console.error("Failed to generate PDF:", e);
        setError("Could not generate the PDF. An unexpected error occurred. Please try again.");
    }
  }, [professors]);


  const renderContent = () => {
    // Show spinner ONLY when loading AND there are no results yet.
    if (isLoading && (!professors || professors.length === 0)) {
      return <LoadingSpinner />;
    }
    
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    
    // Display results as they stream in.
    if (professors && professors.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {professors.map((prof, index) => (
            <ProfessorCard key={`${prof.Name}-${index}`} professor={prof} />
          ))}
        </div>
      );
    }
    
    // A search was performed but returned no results.
    if (professors !== null && !isLoading) {
      return <EmptyState isInitial={false} />;
    }
    
    // Initial state before any search.
    return <EmptyState isInitial={true} />;
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      <Header onExport={handleDownloadPDF} isExportDisabled={!professors || professors.length === 0} />
      <main className="container mx-auto p-4 md:p-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
