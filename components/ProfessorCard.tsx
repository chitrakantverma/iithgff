import React from 'react';
import type { Professor } from '../types';

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
    <div className="text-sm text-gray-300 space-y-1">{children}</div>
  </div>
);

// Fix: Defined ProfessorCardProps interface
interface ProfessorCardProps {
  professor: Professor;
}

const ProfessorCard: React.FC<ProfessorCardProps> = ({ professor }) => {
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.replace(/Dr\.?\s*/, '').split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-sky-500/50">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center font-bold text-sky-400">
            {getInitials(professor.Name)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{professor.Name}</h2>
            <p className="text-sm text-sky-400 font-medium">{professor.Designation}</p>
            <p className="text-xs text-gray-400">{professor.Institute}</p>
          </div>
        </div>
        
        <div className="space-y-4 flex-grow">
            <InfoSection title="Summary">
                <p>{professor.Summary || "Not available."}</p>
            </InfoSection>
            <InfoSection title="Research Interests">
                <p>{professor['Research Interests'] || "Not available."}</p>
            </InfoSection>
             {professor['Internship/Outreach'] && (
                <InfoSection title="Internship/Outreach">
                    <p>{professor['Internship/Outreach']}</p>
                </InfoSection>
            )}
        </div>

        <div className="border-t border-gray-800 mt-6 pt-4 flex justify-end items-center gap-4">
          {professor.Email && (
            <a href={`mailto:${professor.Email}`} title={professor.Email} className="text-gray-400 hover:text-sky-400 transition-colors">
              <i data-lucide="mail" className="w-5 h-5"></i>
            </a>
          )}
          {professor.LinkedIn && (
            <a href={professor.LinkedIn} target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="text-gray-400 hover:text-sky-400 transition-colors">
              <i data-lucide="linkedin" className="w-5 h-5"></i>
            </a>
          )}
          {professor['Institute Website'] && professor['Institute Website'] !== 'Link not working' && (
             <a href={professor['Institute Website']} target="_blank" rel="noopener noreferrer" title="Institute Website" className="text-gray-400 hover:text-sky-400 transition-colors">
               <i data-lucide="university" className="w-5 h-5"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorCard;
