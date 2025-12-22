import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const TechTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    const accentColor = design.themeColor;
    return (
        <div style={{ ...getStyles(design), color: '#d1d5db', backgroundColor: '#1e1e1e', borderLeftColor: accentColor }} className="w-full min-h-[297mm] font-mono shadow-sm p-8 border-l-4">
            <header className="mb-8 border-b border-gray-700 pb-8 flex justify-between items-start">
                <div>
                    <div style={{ color: accentColor }} className="flex items-center gap-2 mb-2 text-sm">
                        <span>$</span>
                        <span className="animate-pulse">_</span>
                        <span>whoami</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">{data.personal.fullName}</h1>
                    <p style={{ color: accentColor }} className="text-xl mb-6 opacity-80">{`> ${data.personal.role}`}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-sans">
                        {data.personal.email && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>@</span> {data.personal.email}</div>}
                        {data.personal.phone && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>#</span> {data.personal.phone}</div>}
                        {data.personal.website && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>/</span> {data.personal.website}</div>}
                    </div>
                </div>
                {data.personal.photo && (
                    <div className="w-24 h-24 border-2 border-dashed p-1" style={{ borderColor: accentColor }}>
                        <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover opacity-80" />
                    </div>
                )}
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">{t('cv.summary').toUpperCase()}</h2>
                        <div className="bg-[#252526] p-4 rounded border border-gray-700 text-sm leading-relaxed font-sans">
                            {data.personal.summary}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">{t('cv.projects').toUpperCase()}</h2>
                            <div className="space-y-3">
                                {data.portfolio.map(item => (
                                    <div key={item.id} className="bg-[#252526] p-3 rounded border border-gray-700 font-sans">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-white text-sm">{item.name}</h3>
                                            {item.link && <a href={`https://${item.link}`} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: accentColor }}>{item.link}</a>}
                                        </div>
                                        <p className="text-xs text-gray-400">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">{t('cv.experience').toUpperCase()}</h2>
                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="relative pl-6 border-l border-gray-700">
                                    <div style={{ backgroundColor: accentColor }} className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-white font-bold">{exp.role}</h3>
                                        <span className="text-xs text-gray-500 font-mono">[{exp.startDate} :: {exp.endDate}]</span>
                                    </div>
                                    <div style={{ color: accentColor }} className="text-sm mb-2 opacity-80">{`const company = "${exp.company}";`}</div>
                                    <p className="text-sm text-gray-400 font-sans leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="col-span-4 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">{t('cv.skills').toUpperCase()}</h2>
                        <div className="flex flex-wrap gap-2 font-sans">
                            {data.skills.map(skill => (
                                <span key={skill} style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}20` }} className="border px-2 py-1 rounded text-xs transition-colors cursor-default">
                                    {`"${skill}"`}
                                </span>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">{t('cv.languages').toUpperCase()}</h2>
                            <div className="space-y-2 font-mono text-xs text-gray-400">
                                {data.languages.map(l => (
                                    <div key={l.id} className="flex justify-between">
                                        <span>"{l.language}"</span>
                                        <span style={{ color: accentColor }}>: "{l.proficiency}"</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">{t('cv.awards')}</h2>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id} className="bg-[#2d2d2d] p-3 rounded border border-gray-700">
                                    <h3 className="font-bold text-white text-sm">{edu.school}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{edu.degree}</p>
                                    <p style={{ color: accentColor }} className="text-[10px] mt-2 text-right">pass: {edu.year}</p>
                                </div>
                            ))}
                            {data.certifications.map(cert => (
                                <div key={cert.id} className="bg-[#2d2d2d] p-3 rounded border border-gray-700">
                                    <h3 className="font-bold text-white text-sm">{cert.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{cert.issuer}</p>
                                    <p style={{ color: accentColor }} className="text-[10px] mt-2 text-right">issued: {cert.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.references.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">{t('cv.references').toUpperCase()}</h2>
                            <div className="space-y-2 text-xs text-gray-400 font-mono">
                                {data.references.map(ref => (
                                    <div key={ref.id}>{`// ${ref.name} @ ${ref.company}`}</div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
