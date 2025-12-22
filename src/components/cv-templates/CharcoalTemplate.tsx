import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const CharcoalTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] flex">
            <div className="w-[35%] bg-zinc-900 text-white p-10 flex flex-col gap-12" style={{ backgroundColor: '#18181b' }}>
                <div className="text-center">
                    {data.personal.photo && (
                        <div className="w-32 h-32 mx-auto rounded-full mb-8 overflow-hidden border-4 border-zinc-700 grayscale">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    )}
                    <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{data.personal.fullName}</h1>
                    <p className="text-zinc-400 uppercase tracking-widest text-sm">{data.personal.role}</p>
                </div>

                <section>
                    <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800 pb-2">Connect</h3>
                    <div className="space-y-3 text-sm text-zinc-300">
                        {data.personal.email && <div className="break-all">{data.personal.email}</div>}
                        {data.personal.phone && <div>{data.personal.phone}</div>}
                        {data.personal.address && <div>{data.personal.address}</div>}
                        {data.personal.website && <div className="break-all text-zinc-400">{data.personal.website}</div>}
                    </div>
                </section>

                <section>
                    <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800 pb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(skill => (
                            <span key={skill} className="bg-zinc-800 px-3 py-1 rounded text-sm text-zinc-300">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800 pb-2">Education</h3>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="font-bold text-white mb-1">{edu.school}</div>
                                    <div className="text-zinc-400 text-sm">{edu.degree}</div>
                                    <div className="text-zinc-600 text-xs mt-1">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div className="flex-1 p-12 bg-white">
                <div className="space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-6 uppercase tracking-tight">Overview</h2>
                            <p className="text-zinc-600 leading-relaxed text-lg">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-8 uppercase tracking-tight">{t('cv.experience')}</h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="font-bold text-xl text-zinc-800">{exp.role}</h3>
                                            <span className="text-sm font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-zinc-500 font-bold uppercase text-sm mb-3 tracking-wide">{exp.company}</h4>
                                        <p className="text-zinc-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-8 uppercase tracking-tight">{t('cv.portfolio')}</h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="border border-zinc-200 p-6 rounded hover:border-zinc-900 transition-colors cursor-default">
                                        <h3 className="font-bold text-zinc-900 mb-2">{p.name}</h3>
                                        <p className="text-zinc-600 text-sm">{p.description}</p>
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
