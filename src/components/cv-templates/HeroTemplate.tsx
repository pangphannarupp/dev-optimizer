import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const HeroTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] flex flex-col">
            <header className="bg-black text-white p-16 pb-24 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: design.themeColor }}></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-4 border-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <h1 className="text-7xl font-black uppercase tracking-tighter mb-4">{data.personal.fullName}</h1>
                <div className="inline-block px-4 py-1 border-2 border-white/30 rounded-full text-lg tracking-widest font-medium uppercase mb-8">
                    {data.personal.role}
                </div>

                <div className="flex justify-center flex-wrap gap-8 text-sm font-medium text-gray-400">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.address && <span>{data.personal.address}</span>}
                </div>
            </header>

            <div className="max-w-4xl mx-auto -mt-16 w-full px-8 flex-1 flex flex-col gap-12 mb-16">
                {data.personal.summary && (
                    <div className="bg-white p-8 shadow-lg border-t-8 rounded-lg text-center" style={{ borderColor: design.themeColor }}>
                        <p className="text-xl leading-relaxed text-gray-700">{data.personal.summary}</p>
                    </div>
                )}

                <div className="grid grid-cols-[2fr_1fr] gap-12">
                    <div className="space-y-12">
                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-4">
                                    Work <span className="h-2 flex-1 bg-gray-100 rounded-full"></span>
                                </h2>
                                <div className="space-y-12 border-l-2 border-gray-100 pl-8 ml-3">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="relative">
                                            <span className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-gray-900"></span>
                                            <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-sm uppercase opacity-90" style={{ color: design.themeColor }}>{exp.company}</span>
                                                <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-gray-800 leading-relaxed font-medium">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">{t('cv.skills')}</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-gray-100 font-bold text-sm border-b-2 border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">{t('cv.education')}</h2>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <h3 className="font-bold text-lg leading-tight">{edu.school}</h3>
                                            <p className="text-sm font-medium mt-1 mb-1 opacity-60">{edu.degree}</p>
                                            <p className="text-xs font-bold mt-1" style={{ color: design.themeColor }}>{edu.year}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
