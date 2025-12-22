import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

export const ModernTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans p-8 shadow-sm">
            <header style={{ borderBottomColor: design.themeColor }} className="border-b-2 pb-4 mb-6 flex justify-between items-center gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold uppercase tracking-wide">{data.personal.fullName}</h1>
                    <p style={{ color: design.themeColor }} className="text-xl font-medium mt-1">{data.personal.role}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
                        {data.personal.email && <div className="flex items-center gap-1"><Mail size={14} /> {data.personal.email}</div>}
                        {data.personal.phone && <div className="flex items-center gap-1"><Phone size={14} /> {data.personal.phone}</div>}
                        {data.personal.address && <div className="flex items-center gap-1"><MapPin size={14} /> {data.personal.address}</div>}
                        {data.personal.website && <div className="flex items-center gap-1"><Globe size={14} /> {data.personal.website}</div>}
                    </div>
                </div>
                {data.personal.photo && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0">
                        <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                    </div>
                )}
            </header>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.profile')}</h2>
                        <p className="leading-relaxed text-sm whitespace-pre-wrap">{data.personal.summary}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.experience')}</h2>
                        <div className="space-y-4">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold">{exp.role}</h3>
                                        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded opacity-70">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p style={{ color: design.themeColor }} className="font-medium text-sm mb-1">{exp.company}</p>
                                    <p className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.portfolio')}</h2>
                            <div className="space-y-3">
                                {data.portfolio.map(item => (
                                    <div key={item.id}>
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-sm">{item.name}</h3>
                                            {item.link && <a href={`https://${item.link}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1"><ExternalLink size={10} /> {item.link}</a>}
                                        </div>
                                        <p className="text-sm opacity-80 leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.skills')}</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{skill}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.education')}</h2>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-sm">{edu.school}</h3>
                                    <p className="text-sm opacity-80">{edu.degree}</p>
                                    <span className="text-xs opacity-60">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.languages')}</h2>
                            <ul className="space-y-1 text-sm">
                                {data.languages.map(lang => (
                                    <li key={lang.id} className="flex justify-between">
                                        <span className="font-medium">{lang.language}</span>
                                        <span className="opacity-60 text-xs">{lang.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.certifications')}</h2>
                            <div className="space-y-2">
                                {data.certifications.map(cert => (
                                    <div key={cert.id} className="text-sm">
                                        <p className="font-medium">{cert.name}</p>
                                        <div className="flex justify-between text-xs opacity-60 mt-0.5">
                                            <span>{cert.issuer}</span>
                                            <span>{cert.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.references.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">{t('cv.references')}</h2>
                            <div className="space-y-3">
                                {data.references.map(ref => (
                                    <div key={ref.id} className="text-sm">
                                        <p className="font-bold">{ref.name}</p>
                                        <p className="opacity-80 text-xs">{ref.company}</p>
                                        <div className="mt-1 opacity-60 text-xs flex flex-col">
                                            <span>{ref.email}</span>
                                            <span>{ref.phone}</span>
                                        </div>
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
