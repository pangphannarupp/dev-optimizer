import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const NoirTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white text-black font-sans shadow-sm min-h-[297mm] flex flex-col items-center p-16 border-[16px] border-black">
            <header className="text-center mb-16 max-w-2xl">
                <h1 className="text-7xl font-black uppercase tracking-tighter mb-4 leading-[0.8]">
                    {data.personal.fullName.split(' ').map((n, i) => (
                        <span key={i} className={i % 2 === 1 ? "outline-text text-transparent stroke-black stroke-2" : "block"}>{n}</span>
                    ))}
                </h1>
                <div className="inline-block bg-black text-white px-6 py-2 text-xl font-bold uppercase tracking-widest mt-4 transform -rotate-2">
                    {data.personal.role}
                </div>
            </header>

            <div className="grid grid-cols-[1fr_2fr] gap-12 w-full flex-1">
                <div className="space-y-12">
                    <section>
                        <h2 className="text-lg font-black uppercase mb-4 border-b-4 border-black pb-1">{t('cv.contact')}</h2>
                        <ul className="space-y-2 text-sm font-bold">
                            {data.personal.email && <li className="hover:line-through cursor-crosshair">{data.personal.email}</li>}
                            {data.personal.phone && <li className="hover:line-through cursor-crosshair">{data.personal.phone}</li>}
                            {data.personal.address && <li className="hover:line-through cursor-crosshair">{data.personal.address}</li>}
                            {data.personal.website && <li className="hover:line-through cursor-crosshair text-blue-600 underline decoration-2 decoration-wavy">{data.personal.website}</li>}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black uppercase mb-4 border-b-4 border-black pb-1">{t('cv.skills')}</h2>
                        <div className="flex flex-col gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="font-mono text-sm bg-gray-100 px-2 py-1 border-l-4 border-black">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-black uppercase mb-4 border-b-4 border-black pb-1">{t('cv.education')}</h2>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-black text-lg leading-tight">{edu.school.toUpperCase()}</div>
                                        <div className="text-sm font-bold opacity-60 italic">{edu.degree}</div>
                                        <div className="text-xs font-mono mt-1">[{edu.year}]</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12 border-l-4 border-black pl-12 -ml-6">
                    {data.personal.summary && (
                        <section>
                            <p className="text-xl font-bold leading-relaxed indent-12 text-justify">
                                {data.personal.summary}
                            </p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-4xl font-black uppercase mb-8">{t('cv.experience')}</h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative">
                                        <div className="absolute -left-[59px] top-2 w-6 h-6 bg-black rounded-full border-4 border-white"></div>
                                        <h3 className="text-2xl font-black uppercase mb-1">{exp.role}</h3>
                                        <div className="flex justify-between items-center border-b-2 border-black border-dashed pb-2 mb-3">
                                            <span className="font-bold text-lg">{exp.company}</span>
                                            <span className="font-mono text-sm bg-black text-white px-2">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="font-medium text-gray-800">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Signature */}

                    <div className="font-script text-4xl transform -rotate-6">{data.personal.fullName}</div>
                </div>
            </div>

            <style>{`
                    .outline-text {
                        -webkit-text-stroke: 2px black;
                    }
                `}</style>
        </div>
    );
};
