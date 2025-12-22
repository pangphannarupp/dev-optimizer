import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const AzureTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] flex flex-col">
            <header className="bg-blue-600 text-white p-12 flex justify-between items-center" style={{ backgroundColor: design.themeColor }}>
                <div>
                    <h1 className="text-5xl font-bold mb-2">{data.personal.fullName}</h1>
                    <p className="text-2xl text-blue-100 font-light tracking-wide">{data.personal.role}</p>
                </div>
                {data.personal.photo && (
                    <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden shrink-0">
                        <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                )}
            </header>

            <div className="flex-1 flex">
                <div className="w-[30%] bg-gray-50 p-8 border-r border-gray-100">
                    <div className="space-y-10">
                        <section>
                            <h3 className="text-blue-600 font-bold uppercase tracking-wider mb-4 text-sm" style={{ color: design.themeColor }}>{t('cv.contact')}</h3>
                            <div className="flex flex-col gap-3 text-sm text-gray-600">
                                {data.personal.email && <div className="break-all">{data.personal.email}</div>}
                                {data.personal.phone && <div>{data.personal.phone}</div>}
                                {data.personal.address && <div>{data.personal.address}</div>}
                                {data.personal.website && <div className="break-all text-blue-500 hover:underline">{data.personal.website}</div>}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-blue-600 font-bold uppercase tracking-wider mb-4 text-sm" style={{ color: design.themeColor }}>Education</h3>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-gray-900">{edu.school}</div>
                                        <div className="text-sm text-gray-500">{edu.degree}</div>
                                        <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-blue-600 font-bold uppercase tracking-wider mb-4 text-sm" style={{ color: design.themeColor }}>Skills</h3>
                            <div className="flex flex-col gap-2">
                                {data.skills.map(skill => (
                                    <div key={skill} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" style={{ backgroundColor: design.themeColor }}></div>
                                        <span className="text-sm text-gray-700">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <div className="flex-1 p-10 space-y-10">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-light text-gray-800 mb-4 border-b pb-2">{t('cv.profile')}</h2>
                            <p className="text-gray-600 leading-relaxed text-lg font-light">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-light text-gray-800 mb-6 border-b pb-2">{t('cv.experience')}</h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-xl text-gray-900">{exp.role}</h3>
                                            <span className="text-sm font-medium text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-blue-600 font-medium mb-2" style={{ color: design.themeColor }}>{exp.company}</h4>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-light text-gray-800 mb-6 border-b pb-2">{t('cv.projects')}</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{p.name}</h3>
                                        <p className="text-gray-600 text-sm">{p.description}</p>
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
