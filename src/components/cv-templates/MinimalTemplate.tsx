import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans p-10 shadow-sm">
            <header className="mb-8 flex gap-8 items-start">
                {data.personal.photo && (
                    <img src={data.personal.photo} alt="Profile" className="w-28 h-28 object-cover rounded-none grayscale" />
                )}
                <div>
                    <h1 className="text-5xl font-light mb-2">{data.personal.fullName}</h1>
                    <p style={{ color: design.themeColor }} className="text-xl font-light mb-4">{data.personal.role}</p>
                    <div className="text-sm opacity-60 space-y-1">
                        <p>{data.personal.email}</p>
                        <p>{data.personal.phone}</p>
                        <p>{data.personal.address}</p>
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">{t('cv.about')}</h3>
                    <p className="leading-7 opacity-80">{data.personal.summary}</p>
                </section>

                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Experience</h3>
                    <div className="space-y-6 border-l border-gray-100 pl-6">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="relative">
                                <div className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                <h4 className="font-medium">{exp.role}</h4>
                                <p style={{ color: design.themeColor }} className="text-sm mb-2 opacity-80">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                                <p className="text-sm leading-6 whitespace-pre-wrap opacity-80">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Education</h3>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <h4 className="font-medium">{edu.school}</h4>
                                        <p className="text-sm opacity-80">{edu.degree}</p>
                                        <p className="text-xs mt-0.5 opacity-60">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {data.certifications.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Certifications</h3>
                                <ul className="space-y-2 text-sm opacity-80">
                                    {data.certifications.map(c => <li key={c.id}>{c.name} ({c.year})</li>)}
                                </ul>
                            </section>
                        )}
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-80">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-gray-50 px-2 py-1 rounded">{skill}</span>
                                ))}
                            </div>
                        </section>
                        {data.languages.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Languages</h3>
                                <ul className="space-y-1 text-sm opacity-80">
                                    {data.languages.map(l => <li key={l.id}>{l.language} - {l.proficiency}</li>)}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
