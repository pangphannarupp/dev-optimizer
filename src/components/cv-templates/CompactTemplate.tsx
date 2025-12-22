import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const CompactTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm p-6">
            <header className="flex justify-between items-start border-b-4 pb-4 mb-4" style={{ borderBottomColor: design.themeColor }}>
                <div className="flex gap-4 items-center">
                    {data.personal.photo && (
                        <img src={data.personal.photo} alt="Profile" className="w-16 h-16 rounded object-cover" />
                    )}
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{data.personal.fullName}</h1>
                        <p style={{ color: design.themeColor }} className="text-lg font-bold uppercase">{data.personal.role}</p>
                    </div>
                </div>
                <div className="text-right text-xs font-medium opacity-60 leading-relaxed">
                    <p>{data.personal.email}</p>
                    <p>{data.personal.phone}</p>
                    <p>{data.personal.address}</p>
                    {data.personal.website && <p>{data.personal.website}</p>}
                </div>
            </header>

            <div className="flex gap-6">
                <div className="w-1/3 space-y-6">
                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">{t('cv.summary')}</h3>
                        <p className="text-xs text-justify leading-5 opacity-80">{data.personal.summary}</p>
                    </section>

                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-700 border border-gray-200">{skill}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Education</h3>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h4 className="font-bold text-xs">{edu.school}</h4>
                                    <p className="text-[10px] opacity-80">{edu.degree}</p>
                                    <p className="text-[10px] opacity-60 italic">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Languages</h3>
                            <ul className="space-y-1 text-[10px] opacity-80">
                                {data.languages.map(l => <li key={l.id} className="flex justify-between"><b>{l.language}</b> {l.proficiency}</li>)}
                            </ul>
                        </section>
                    )}

                    {data.certifications.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Certifications</h3>
                            <ul className="space-y-1 text-[10px] opacity-80">
                                {data.certifications.map(c => <li key={c.id}>{c.name}</li>)}
                            </ul>
                        </section>
                    )}
                </div>

                <div className="w-2/3 border-l border-gray-100 pl-6 space-y-6">
                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-4 pb-1">{t('cv.experience')}</h3>
                        <div className="space-y-4">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-sm">{exp.role}</h4>
                                        <span className="text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p style={{ color: design.themeColor }} className="text-xs font-bold mb-1 opacity-80">{exp.company}</p>
                                    <p className="text-xs opacity-80 leading-5 text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-4 pb-1">Portfolio</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {data.portfolio.map(item => (
                                    <div key={item.id} className="bg-gray-50 p-2 rounded">
                                        <h4 className="font-bold text-xs">{item.name}</h4>
                                        <p className="text-[10px] opacity-80 leading-tight">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.references.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-4 pb-1">References</h3>
                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                {data.references.map(ref => (
                                    <div key={ref.id}>
                                        <p className="font-bold">{ref.name}</p>
                                        <p className="opacity-80">{ref.company}</p>
                                        <p className="opacity-60">{ref.email}</p>
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
