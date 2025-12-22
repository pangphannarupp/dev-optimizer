import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-serif p-12 shadow-sm leading-relaxed">
            <header className="border-b-2 border-gray-800 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.personal.fullName}</h1>
                <div className="text-sm space-y-1">
                    <p>{data.personal.role}</p>
                    <div className="flex justify-center gap-4">
                        {data.personal.email && <span>{data.personal.email}</span>}
                        {data.personal.phone && <span>{data.personal.phone}</span>}
                        {data.personal.website && <span>{data.personal.website}</span>}
                    </div>
                    {data.personal.address && <p>{data.personal.address}</p>}
                </div>
            </header>

            <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">{t('cv.education')}</h2>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id} className="flex justify-between">
                            <div>
                                <h3 className="font-bold">{edu.school}</h3>
                                <p className="italic">{edu.degree}</p>
                            </div>
                            <span className="font-medium">{edu.year}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">{t('cv.research')}</h2>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between font-bold mb-1">
                                <span>{exp.role}</span>
                                <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="italic mb-2">{exp.company}</p>
                            <p className="text-sm text-justify opacity-90">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {data.portfolio.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">Publications & {t('cv.projects')}</h2>
                    <ul className="list-disc ml-5 space-y-2">
                        {data.portfolio.map(item => (
                            <li key={item.id} className="text-sm">
                                <span className="font-bold">{item.name}</span>. {item.description}
                                {item.link && <span className="block text-xs italic text-blue-800">{item.link}</span>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {(data.certifications.length > 0) && (
                    <section>
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">{t('cv.awards')}</h2>
                        <ul className="space-y-2">
                            {data.certifications.map(c => (
                                <li key={c.id} className="text-sm flex justify-between">
                                    <span>{c.name} ({c.issuer})</span>
                                    <span>{c.year}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {(data.languages.length > 0 || data.skills.length > 0) && (
                    <section>
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">{t('cv.skills')} & {t('cv.languages')}</h2>
                        <div className="space-y-2 text-sm">
                            {data.skills.length > 0 && (
                                <p><span className="font-bold">Skills:</span> {data.skills.join(', ')}</p>
                            )}
                            {data.languages.length > 0 && (
                                <p><span className="font-bold">Languages:</span> {data.languages.map(l => l.language).join(', ')}</p>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {data.references.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">{t('cv.references')}</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {data.references.map(ref => (
                            <div key={ref.id} className="text-sm">
                                <p className="font-bold">{ref.name}</p>
                                <p className="italic">{ref.company}</p>
                                <p>{ref.email}</p>
                                <p>{ref.phone}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
