import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const SwissTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <>
            <style>
                {`
                @media print {
                    body {
                        background: linear-gradient(to right, #f4f4f4 35%, #ffffff 35%) !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
                `}
            </style>
            <div style={{ ...getStyles(design), minHeight: '296.8mm' }} className="w-full bg-white font-sans text-gray-900 p-0 shadow-sm relative">
                <div className="absolute top-0 left-0 w-[35%] h-full bg-[#f4f4f4] z-0"></div>

                <div className="relative z-10 flex">
                    {/* Sidebar */}
                    <div className="w-[35%] p-10 pt-16 flex flex-col gap-10">
                        <div className="text-left">
                            {data.personal.photo ? (
                                <img src={data.personal.photo} className="w-32 h-32 mb-6 object-cover grayscale" />
                            ) : (
                                <div className="w-32 h-32 mb-6 bg-black text-white flex items-center justify-center text-4xl font-bold">
                                    {data.personal.fullName.charAt(0)}
                                </div>
                            )}

                            <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">{t('cv.contact')}</h3>
                            <div className="text-sm space-y-2 opacity-80">
                                {data.personal.email && <p className="break-all">{data.personal.email}</p>}
                                {data.personal.phone && <p>{data.personal.phone}</p>}
                                {data.personal.address && <p>{data.personal.address}</p>}
                                {data.personal.website && <p>{data.personal.website}</p>}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-white border border-gray-300 px-2 py-1">{skill}</span>
                                ))}
                            </div>
                        </div>

                        {(data.languages.length > 0) && (
                            <div>
                                <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">Languages</h3>
                                <ul className="text-sm space-y-1">
                                    {data.languages.map(l => (
                                        <li key={l.id} className="flex justify-between">
                                            <span>{l.language}</span>
                                            <span className="opacity-60">{l.proficiency}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {(data.certifications.length > 0) && (
                            <div>
                                <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">Certifications</h3>
                                <ul className="text-sm space-y-2">
                                    {data.certifications.map(c => (
                                        <li key={c.id}>
                                            <div className="font-medium">{c.name}</div>
                                            <div className="text-xs opacity-60">{c.year}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Main */}
                    <div className="w-[65%] p-10 pt-16 space-y-12">
                        <header>
                            <h1 className="text-5xl font-bold tracking-tighter leading-none mb-2">{data.personal.fullName}</h1>
                            <p style={{ color: design.themeColor }} className="text-2xl font-light">{data.personal.role}</p>
                            <p className="mt-6 text-sm leading-7 max-w-lg opacity-80">{data.personal.summary}</p>
                        </header>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-8 flex items-center gap-3">Experience <span className="flex-1 h-px bg-gray-200"></span></h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="grid grid-cols-12 gap-4">
                                        <div className="col-span-3 text-xs font-bold opacity-50 pt-1">
                                            {exp.startDate} <br /> {exp.endDate}
                                        </div>
                                        <div className="col-span-9">
                                            <h3 className="font-bold text-lg leading-none mb-1">{exp.role}</h3>
                                            <p className="text-sm font-medium mb-2 opacity-70">{exp.company}</p>
                                            <p className="text-sm leading-relaxed opacity-80">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-black mb-8 flex items-center gap-3">Education <span className="flex-1 h-px bg-gray-200"></span></h2>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id} className="grid grid-cols-12 gap-4">
                                        <div className="col-span-3 text-xs font-bold opacity-50 pt-1">
                                            {edu.year}
                                        </div>
                                        <div className="col-span-9">
                                            <h3 className="font-bold text-lg leading-none mb-1">{edu.school}</h3>
                                            <p className="text-sm opacity-70">{edu.degree}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.portfolio.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-black mb-8 flex items-center gap-3">Portfolio <span className="flex-1 h-px bg-gray-200"></span></h2>
                                <div className="space-y-4">
                                    {data.portfolio.map(item => (
                                        <div key={item.id}>
                                            <h3 className="font-bold">{item.name}</h3>
                                            <p className="text-sm opacity-80">{item.description}</p>
                                            {item.link && <p className="text-xs text-blue-600">{item.link}</p>}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
