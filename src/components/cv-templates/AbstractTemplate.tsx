import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { } from 'lucide-react';

export const AbstractTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] relative overflow-hidden p-12 flex flex-col">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: `${design.themeColor}20` }}></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <header className="relative z-10 mb-16">
                <h1 className="text-8xl font-black tracking-tighter opacity-10 absolute -top-8 -left-8 select-none" style={{ color: design.themeColor }}>CV</h1>
                <div className="flex justify-between items-end border-b-4 border-black pb-6">
                    <div>
                        <h1 className="text-5xl font-bold mb-2">{data.personal.fullName}</h1>
                        <p className="text-xl font-medium opacity-60 uppercase tracking-widest">{data.personal.role}</p>
                    </div>
                    <div className="text-right text-sm font-medium opacity-70">
                        <div>{data.personal.email}</div>
                        <div>{data.personal.phone}</div>
                        <div>{data.personal.address}</div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 grid grid-cols-3 gap-12 flex-1">
                <div className="col-span-2 space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <span className="w-12 h-2 bg-black"></span> Summary
                            </h2>
                            <p className="text-lg leading-relaxed font-light">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <span className="w-12 h-2 bg-black"></span> Experience
                            </h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{exp.role}</h3>
                                            <span className="font-mono text-sm bg-black text-white px-2 py-1">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-lg font-medium opacity-60 mb-4">{exp.company}</h4>
                                        <p className="opacity-80 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12 pt-8">
                    <section>
                        <h2 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">{t('cv.expertise')}</h2>
                        <ul className="space-y-3">
                            {data.skills.map(skill => (
                                <li key={skill} className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-black rotate-45"></span>
                                    <span className="font-medium">{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">{t('cv.education')}</h2>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-lg">{edu.school}</div>
                                        <div className="opacity-60">{edu.degree}</div>
                                        <div className="font-mono text-sm mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">{t('cv.projects')}</h2>
                            <div className="space-y-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="border-l-2 border-gray-200 pl-4 hover:border-black transition-colors">
                                        <div className="font-bold">{p.name}</div>
                                        <div className="text-xs opacity-60 line-clamp-2">{p.description}</div>
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
