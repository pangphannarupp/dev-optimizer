import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const RightTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] flex flex-row">
            <div className="flex-1 p-10 pr-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold uppercase tracking-tight text-gray-900 mb-2">{data.personal.fullName}</h1>
                    <p className="text-xl text-gray-500 uppercase tracking-widest font-medium" style={{ color: design.themeColor }}>{data.personal.role}</p>
                </header>

                <div className="space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">{t('cv.profile')}</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">{t('cv.experience')}</h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-xl">{exp.role}</h3>
                                            <span className="text-sm font-mono text-gray-400">{exp.startDate} - {exp.endDate}</span>
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
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">{t('cv.projects')}</h2>
                            <div className="space-y-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <div className="font-bold text-lg mb-1">{p.name}</div>
                                        <p className="text-gray-600">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <div className="w-[30%] bg-gray-50 p-8 pt-12 border-l border-gray-100 flex flex-col gap-10">
                <div className="text-center">
                    {data.personal.photo && (
                        <div className="w-32 h-32 mx-auto rounded-full mb-6 overflow-hidden border-4 border-white shadow-sm">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                        {data.personal.email && <div className="break-all font-medium text-gray-900">{data.personal.email}</div>}
                        {data.personal.phone && <div>{data.personal.phone}</div>}
                        {data.personal.address && <div className="text-center">{data.personal.address}</div>}
                        {data.personal.website && <div className="break-all text-blue-500 underline">{data.personal.website}</div>}
                    </div>
                </div>

                {data.education.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Education</h3>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="font-bold text-gray-900">{edu.school}</div>
                                    <div className="text-sm text-gray-500 mb-1">{edu.degree}</div>
                                    <div className="text-xs font-bold bg-white inline-block px-2 py-0.5 rounded border border-gray-200 text-gray-400">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Expertise</h3>
                    <div className="flex flex-col gap-2">
                        {data.skills.map(skill => (
                            <div key={skill} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" style={{ backgroundColor: design.themeColor }}></div>
                                <span className="text-sm font-medium text-gray-700">{skill}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
