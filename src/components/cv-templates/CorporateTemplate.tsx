import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe, Briefcase, User, Layout } from 'lucide-react';

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <>
            <style>
                {`
                @media print {
                    body {
                        background: linear-gradient(to right, #1e293b 32%, #ffffff 32%) !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
                `}
            </style>
            <div style={{ ...getStyles(design), minHeight: '296.8mm' }} className="w-full bg-white font-sans shadow-sm flex flex-row">
                <div className="w-[32%] text-white p-8 pt-12 flex flex-col gap-8" style={{ backgroundColor: '#1e293b' }}>
                    <div className="text-center mb-4">
                        {data.personal.photo ? (
                            <div className="w-40 h-40 mx-auto rounded-full border-4 border-white/20 mb-6 overflow-hidden">
                                <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold mb-6">
                                {data.personal.fullName.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 text-sm opacity-90">
                        <h3 className="uppercase tracking-widest text-xs font-bold text-white/50 border-b border-white/10 pb-2 mb-4">{t('cv.contact')}</h3>
                        {data.personal.email && <div className="flex items-center gap-3"><Mail size={16} /> <span className="break-all">{data.personal.email}</span></div>}
                        {data.personal.phone && <div className="flex items-center gap-3"><Phone size={16} /> <span>{data.personal.phone}</span></div>}
                        {data.personal.address && <div className="flex items-center gap-3"><MapPin size={16} /> <span>{data.personal.address}</span></div>}
                        {data.personal.website && <div className="flex items-center gap-3"><Globe size={16} /> <span className="break-all">{data.personal.website}</span></div>}
                    </div>

                    {data.education.length > 0 && (
                        <div>
                            <h3 className="uppercase tracking-widest text-xs font-bold text-white/50 border-b border-white/10 pb-2 mb-4">Education</h3>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold">{edu.school}</div>
                                        <div className="text-sm opacity-80 mb-1">{edu.degree}</div>
                                        <div className="text-xs bg-white/10 inline-block px-2 py-0.5 rounded">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="uppercase tracking-widest text-xs font-bold text-white/50 border-b border-white/10 pb-2 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-white/10 px-3 py-1 rounded text-sm">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-12">
                    <header className="mb-12 border-b-2 border-gray-100 pb-8">
                        <h1 className="text-4xl font-bold uppercase text-gray-800 mb-2" style={{ color: design.themeColor }}>{data.personal.fullName}</h1>
                        <p className="text-xl tracking-widest text-gray-500 uppercase">{data.personal.role}</p>
                    </header>

                    <div className="space-y-10">
                        {data.personal.summary && (
                            <section>
                                <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-3 text-gray-800">
                                    <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500"><User size={16} /></span>
                                    Profile
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-justify">{data.personal.summary}</p>
                            </section>
                        )}

                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-3 text-gray-800">
                                    <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500"><Briefcase size={16} /></span>
                                    Experience
                                </h2>
                                <div className="space-y-8 border-l-2 border-gray-100 ml-4 pl-8">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="relative">
                                            <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-gray-300"></div>
                                            <div className="flex justify-between items-baseline mb-2">
                                                <h3 className="font-bold text-lg">{exp.role}</h3>
                                                <span className="text-sm font-bold opacity-50 bg-gray-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <h4 className="text-sm font-bold uppercase mb-3 opacity-70" style={{ color: design.themeColor }}>{exp.company}</h4>
                                            <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.portfolio.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-3 text-gray-800">
                                    <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500"><Layout size={16} /></span>
                                    Projects
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {data.portfolio.map(p => (
                                        <div key={p.id} className="bg-gray-50 p-4 rounded border border-gray-100 hover:border-blue-200 transition-colors">
                                            <h3 className="font-bold text-gray-800 mb-1">{p.name}</h3>
                                            <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
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
