import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-serif p-10 shadow-sm leading-relaxed">
            <div className="flex flex-col items-center border-b pb-6 mb-8 text-center" style={{ borderBottomColor: design.themeColor }}>
                {data.personal.photo && (
                    <img src={data.personal.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" />
                )}
                <h1 className="text-3xl font-bold">{data.personal.fullName}</h1>
                <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm italic opacity-80">
                    {data.personal.address && <span>{data.personal.address}</span>}
                    {data.personal.phone && <span>• {data.personal.phone}</span>}
                    {data.personal.email && <span>• {data.personal.email}</span>}
                </div>
            </div>

            <section className="mb-6">
                <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">{t('cv.professionalSummary')}</h2>
                <p className="text-sm opacity-90">{data.personal.summary}</p>
            </section>

            <section className="mb-6">
                <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-4 uppercase tracking-wider text-sm">{t('cv.experience')}</h2>
                <div className="space-y-5">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between font-bold text-sm">
                                <span>{exp.company}, {exp.role}</span>
                                <span className="opacity-80 font-normal">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-sm mt-1 whitespace-pre-wrap opacity-90">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-6">
                <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">{t('cv.education')}</h2>
                {data.education.map(edu => (
                    <div key={edu.id} className="flex justify-between text-sm mb-1">
                        <span className="font-bold">{edu.school} — {edu.degree}</span>
                        <span className="opacity-80">{edu.year}</span>
                    </div>
                ))}
            </section>

            {(data.skills.length > 0 || data.languages.length > 0 || data.certifications.length > 0) && (
                <section className="mb-6">
                    <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">{t('cv.skills')}</h2>
                    <div className="text-sm opacity-90 space-y-2">
                        {data.skills.length > 0 && <p><span className="font-bold">Skills:</span> {data.skills.join(', ')}</p>}
                        {data.languages.length > 0 && <p><span className="font-bold">Languages:</span> {data.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}</p>}
                        {data.certifications.length > 0 && <p><span className="font-bold">Certifications:</span> {data.certifications.map(c => c.name).join(', ')}</p>}
                    </div>
                </section>
            )}
            {data.references.length > 0 && (
                <section>
                    <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">{t('cv.references')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.references.map(ref => (
                            <div key={ref.id} className="text-sm">
                                <span className="font-bold block">{ref.name}</span>
                                <span className="opacity-80 text-xs block">{ref.company}</span>
                                <span className="opacity-80 text-xs block">{ref.email}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
