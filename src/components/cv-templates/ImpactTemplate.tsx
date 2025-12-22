import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const ImpactTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] p-16 flex flex-col">
            <header className="border-b-[12px] border-black pb-8 mb-16">
                <h1 className="text-8xl font-black uppercase tracking-tighter leading-none mb-4" style={{ color: design.themeColor }}>
                    {data.personal.fullName}
                </h1>
                <p className="text-3xl font-bold text-black uppercase tracking-tight">{data.personal.role}</p>

                <div className="grid grid-cols-3 gap-8 mt-12 text-sm font-bold uppercase tracking-widest border-t-2 border-black pt-4">
                    {data.personal.email && <div>{data.personal.email}</div>}
                    {data.personal.phone && <div>{data.personal.phone}</div>}
                    {data.personal.address && <div>{data.personal.address}</div>}
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-16">
                <div className="col-span-4 space-y-16 border-r-2 border-gray-200 pr-8">
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">{t('cv.education')}</h2>
                            <div className="space-y-8">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-black text-xl mb-1">{edu.school}</div>
                                        <div className="font-bold text-gray-500">{edu.degree}</div>
                                        <div className="font-black text-3xl mt-2 text-gray-200">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">{t('cv.skills')}</h2>
                        <ul className="space-y-2">
                            {data.skills.map(skill => (
                                <li key={skill} className="font-bold text-lg border-b border-black pb-1">
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="col-span-8 space-y-16">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-4 opacity-30">About</h2>
                            <p className="text-2xl font-bold leading-tight indent-8 text-gray-800">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-5xl font-black uppercase mb-12 flex items-center gap-4">
                                Experience <span className="flex-1 h-3 bg-black"></span>
                            </h2>
                            <div className="space-y-12">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-end mb-2 border-b-2 border-black pb-2">
                                            <h3 className="text-3xl font-black uppercase">{exp.role}</h3>
                                            <span className="font-bold text-lg bg-black text-white px-3 mb-1">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-xl font-bold uppercase mb-4 text-gray-500">{exp.company}</h4>
                                        <p className="text-lg font-medium text-gray-800 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
