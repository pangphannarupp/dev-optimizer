import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Briefcase } from 'lucide-react';

export const ManhattanTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <>
            <style>
                {`
                @media print {
                    body {
                        background: linear-gradient(to right, #ffffff 30%, #f8fafc 30%) !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
                `}
            </style>
            <div style={{ ...getStyles(design), minHeight: '296.8mm' }} className="w-full bg-slate-50 font-sans shadow-sm flex flex-row">
                <div className="w-[30%] bg-white border-r border-gray-200 pt-16 pb-8 px-6 flex flex-col gap-8 text-right">
                    <div className="mb-8">
                        {data.personal.photo ? (
                            <div className="w-32 h-32 ml-auto rounded-xl overflow-hidden shadow-lg rotate-3 mb-6 border-4 border-white ring-1 ring-gray-100">
                                <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                            </div>
                        ) : (
                            <div className="w-24 h-24 ml-auto bg-gray-900 rounded-xl flex items-center justify-center text-3xl font-bold text-white mb-6 rotate-3 shadow-lg">
                                {data.personal.fullName.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50">{t('cv.contact')}</h2>
                        <div className="space-y-3 text-sm text-gray-600">
                            {data.personal.email && <div className="break-all font-medium hover:text-black transition-colors">{data.personal.email}</div>}
                            {data.personal.phone && <div>{data.personal.phone}</div>}
                            {data.personal.address && <div>{data.personal.address}</div>}
                            {data.personal.website && <div className="text-blue-600 underline decoration-blue-200 underline-offset-2">{data.personal.website}</div>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50 relative inline-block">Education <span className="absolute -bottom-1 right-0 w-8 h-1 bg-black"></span></h2>
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                <p className="text-xs uppercase tracking-wide mt-1 mb-1" style={{ color: design.themeColor }}>{edu.degree}</p>
                                <p className="text-xs text-gray-400">{edu.year}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50 relative inline-block">Expertise <span className="absolute -bottom-1 right-0 w-8 h-1 bg-black"></span></h2>
                        <div className="flex flex-wrap justify-end gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-semibold hover:bg-black hover:text-white transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-16 pt-24 bg-slate-50 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
                    <div className="absolute top-0 left-12 w-2 h-32 bg-black"></div>

                    <header className="mb-20 pl-8">
                        <h1 className="text-6xl font-black tracking-tighter uppercase mb-4 leading-none" style={{ color: design.themeColor }}>{data.personal.fullName}</h1>
                        <p className="text-xl font-medium tracking-widest text-gray-500 uppercase">{data.personal.role}</p>
                    </header>

                    <div className="space-y-16 pl-8 border-l border-gray-200">
                        <section className="relative">
                            <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-white border-4 border-black box-content"></span>
                            <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">About</h2>
                            <p className="text-lg leading-relaxed font-light text-gray-600 max-w-2xl">{data.personal.summary}</p>
                        </section>

                        <section className="relative">
                            <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-white border-4 border-black box-content"></span>
                            <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">{t('cv.experience')}</h2>
                            <div className="space-y-12">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative group">
                                        <div className="absolute -left-12 -top-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                                            <Briefcase size={12} />
                                        </div>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-xl font-bold">{exp.role}</h3>
                                            <span className="font-mono text-sm text-gray-400">{exp.startDate} / {exp.endDate}</span>
                                        </div>
                                        <h4 className="font-bold text-sm uppercase tracking-wide mb-4" style={{ color: design.themeColor }}>{exp.company}</h4>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};
