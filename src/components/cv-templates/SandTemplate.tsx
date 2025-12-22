import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const SandTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-[#fdfbf7] font-serif shadow-sm min-h-[297mm] p-12">
            <header className="text-center mb-16 border-b border-stone-300 pb-12">
                <h1 className="text-6xl text-stone-900 mb-4 tracking-tight">{data.personal.fullName}</h1>
                <p className="text-xl text-stone-500 italic mb-8">{data.personal.role}</p>

                <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-sm text-stone-600 font-sans uppercase tracking-widest">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.address && <span>{data.personal.address}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.website && <span>{data.personal.website}</span>}
                </div>
            </header>

            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-8 space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-lg font-sans font-bold text-stone-400 uppercase tracking-widest mb-4">{t('cv.about')}</h2>
                            <p className="text-stone-800 leading-relaxed text-lg">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-sans font-bold text-stone-400 uppercase tracking-widest mb-6">{t('cv.experience')}</h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <h3 className="text-2xl text-stone-900 font-medium mb-1">{exp.role}</h3>
                                        <div className="flex items-center gap-3 text-stone-500 text-sm font-sans mb-3">
                                            <span className="font-bold text-stone-700 uppercase">{exp.company}</span>
                                            <span>•</span>
                                            <span>{exp.startDate} — {exp.endDate}</span>
                                        </div>
                                        <p className="text-stone-700 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-sans font-bold text-stone-400 uppercase tracking-widest mb-6">{t('cv.projects')}</h2>
                            <div className="space-y-6">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <h3 className="text-xl text-stone-900 font-medium mb-1">{p.name}</h3>
                                        <p className="text-stone-600">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-4 space-y-12">
                    {data.personal.photo && (
                        <div className="w-full aspect-square bg-stone-200 grayscale contrast-125 mb-8">
                            <img src={data.personal.photo} className="w-full h-full object-cover mix-blend-multiply" alt="Profile" />
                        </div>
                    )}

                    <section>
                        <h2 className="text-lg font-sans font-bold text-stone-400 uppercase tracking-widest mb-4">{t('cv.education')}</h2>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="text-stone-900 font-bold text-lg leading-tight mb-1">{edu.school}</div>
                                    <div className="text-stone-600 italic">{edu.degree}</div>
                                    <div className="text-stone-400 text-sm font-sans mt-1">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-sans font-bold text-stone-400 uppercase tracking-widest mb-4">{t('cv.expertise')}</h2>
                        <ul className="space-y-2">
                            {data.skills.map(skill => (
                                <li key={skill} className="text-stone-700 border-b border-stone-200 pb-2">
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};
