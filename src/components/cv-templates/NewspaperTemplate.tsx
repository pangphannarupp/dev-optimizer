import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const NewspaperTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <>
            <style>
                {`
                @media print {
                    html, body {
                        min-height: 297mm !important;
                        height: 297mm !important;
                        background: #fdfbf7 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        overflow: hidden !important;
                    }
                }
                `}
            </style>
            <div style={{ ...getStyles(design), minHeight: '296.8mm', backgroundColor: '#fdfbf7', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }} className="w-full text-[#1a1a1a] p-8 font-serif leading-relaxed">
                <header className="border-b-4 border-double border-black pb-4 mb-4 text-center">
                    <h1 className="text-6xl font-black mb-2 uppercase tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>{data.personal.fullName}</h1>
                    <div className="flex justify-center items-center gap-4 text-sm font-bold uppercase tracking-widest border-t border-black pt-2 mx-auto max-w-2xl">
                        <span>{data.personal.role}</span>
                        <span>•</span>
                        <span>{data.personal.email}</span>
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-6 min-h-[297mm]">
                    {/* Left Column (Narrow) */}
                    <div className="col-span-3 border-r border-[#e5e5e5] pr-6 flex flex-col gap-6 text-sm text-justify">
                        {data.personal.photo && (
                            <div className="w-full aspect-[3/4] overflow-hidden grayscale contrast-125 border border-black mb-2">
                                <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        )}

                        <div className="border-t border-black pt-2">
                            <h3 className="font-black uppercase tracking-wider mb-2 text-xs">{t('cv.contactDetails')}</h3>
                            <div className="space-y-1 text-xs">
                                {data.personal.phone && <div><span className="font-bold">T:</span> {data.personal.phone}</div>}
                                {data.personal.website && <div><span className="font-bold">W:</span> {data.personal.website}</div>}
                                {data.personal.address && <div><span className="font-bold">L:</span> {data.personal.address}</div>}
                            </div>
                        </div>

                        <div className="border-t border-black pt-2">
                            <h3 className="font-black uppercase tracking-wider mb-2 text-xs">{t('cv.coreCompetencies')}</h3>
                            <ul className="list-disc pl-3 space-y-1">
                                {data.skills.map(s => <li key={s} className="pl-1">{s}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* Center Column (Wide) */}
                    <div className="col-span-6 border-r border-[#e5e5e5] pr-6 flex flex-col gap-4">
                        {data.personal.summary && (
                            <div className="mb-4">
                                <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 text-justify">
                                    {data.personal.summary}
                                </p>
                            </div>
                        )}

                        <div>
                            <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4">{t('cv.latestExperience')}</h2>
                            <div className="space-y-6">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline border-b border-dotted border-gray-400 mb-2">
                                            <h3 className="font-bold text-lg">{exp.role}</h3>
                                            <span className="italic font-bold text-xs">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <div className="font-bold text-sm mb-2 uppercase tracking-wide">{exp.company}</div>
                                        <p className="text-sm text-justify">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Narrow) */}
                    <div className="col-span-3 flex flex-col gap-6">
                        <div>
                            <h2 className="text-lg font-bold uppercase border-b border-black mb-3">{t('cv.education')}</h2>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold leading-tight">{edu.school}</h3>
                                        <p className="text-sm italic">{edu.degree}</p>
                                        <span className="text-xs font-bold">{edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {data.portfolio.length > 0 && (
                            <div>
                                <h2 className="text-lg font-bold uppercase border-b border-black mb-3">{t('cv.portfolio')}</h2>
                                <div className="space-y-4">
                                    {data.portfolio.map(p => (
                                        <div key={p.id}>
                                            <h3 className="font-bold text-sm">{p.name}</h3>
                                            <p className="text-xs text-justify line-clamp-3 mb-1">{p.description}</p>
                                            {p.link && <a href={`https://${p.link}`} className="text-[10px] uppercase font-bold underline">Visit Link</a>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="border-t-2 border-black mt-auto pt-2 text-center">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Curriculum Vitae • {new Date().getFullYear()} Edition</p>
                </footer>
            </div>
        </>
    );
};
