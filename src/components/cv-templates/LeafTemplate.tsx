import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Briefcase, User, Layout } from 'lucide-react';

export const LeafTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <>
            <style>
                {`
                @media print {
                    body {
                        background: linear-gradient(to right, #115e59 35%, #fafaf9 35%) !important;
                        -webkit-print-color-adjust: exact;
                    }
                }
                `}
            </style>
            <div style={{ ...getStyles(design), minHeight: '296.8mm', background: 'linear-gradient(to right, #115e59 35%, #fafaf9 35%)', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }} className="w-full font-sans shadow-sm p-6 flex gap-6">
                <div className="w-[35%] text-white p-10 flex flex-col">
                    <div className="text-center mb-12">
                        {data.personal.photo ? (
                            <div className="w-40 h-40 mx-auto rounded-[2rem] overflow-hidden border-4 border-teal-600 shadow-xl mb-6 rotate-3">
                                <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 mx-auto bg-white/10 rounded-[2rem] flex items-center justify-center mb-6">
                                <User size={40} className="text-teal-200" />
                            </div>
                        )}
                        <div className="space-y-1 text-teal-100 text-sm">
                            {data.personal.email && <div className="flex items-center justify-center gap-2"><Mail size={14} /> <span className="truncate max-w-[180px]">{data.personal.email}</span></div>}
                            {data.personal.phone && <div className="flex items-center justify-center gap-2"><Phone size={14} /> {data.personal.phone}</div>}
                            {data.personal.address && <div className="flex items-center justify-center gap-2"><MapPin size={14} /> {data.personal.address}</div>}
                        </div>
                    </div>

                    <div className="space-y-10 flex-1">
                        <section>
                            <h3 className="text-teal-200 uppercase tracking-widest text-xs font-bold mb-6 border-b border-teal-700 pb-2">Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-teal-700/50 px-3 py-1.5 rounded-xl text-sm border border-teal-600/50">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {data.education.length > 0 && (
                            <section>
                                <h3 className="text-teal-200 uppercase tracking-widest text-xs font-bold mb-6 border-b border-teal-700 pb-2">Education</h3>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <div className="font-bold text-white text-lg">{edu.school}</div>
                                            <div className="text-teal-300 text-sm">{edu.degree}</div>
                                            <div className="text-xs text-teal-400 mt-1">{edu.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>

                <div className="flex-1 py-8 pr-6">
                    <header className="mb-12 border-b-2 border-stone-200 pb-8">
                        <h1 className="text-5xl font-bold text-teal-900 mb-2" style={{ color: design.themeColor }}>{data.personal.fullName}</h1>
                        <p className="text-xl text-stone-500 font-medium tracking-wide">{data.personal.role}</p>
                    </header>

                    <div className="space-y-12">
                        {data.personal.summary && (
                            <section>
                                <h2 className="text-2xl font-bold text-teal-900 mb-4 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700"><User size={16} /></span>
                                    Profile
                                </h2>
                                <p className="text-stone-600 leading-relaxed text-lg">{data.personal.summary}</p>
                            </section>
                        )}

                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-teal-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700"><Briefcase size={16} /></span>
                                    Experience
                                </h2>
                                <div className="space-y-10 pl-4 border-l-2 border-stone-200">
                                    {data.experience.map((exp) => (
                                        <div key={exp.id} className="relative pl-8">
                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-teal-500"></div>
                                            <h3 className="text-xl font-bold text-stone-800">{exp.role}</h3>
                                            <div className="text-teal-600 font-medium mb-2">{exp.company}  |  {exp.startDate} - {exp.endDate}</div>
                                            <p className="text-stone-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.portfolio.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-teal-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700"><Layout size={16} /></span>
                                    Selected Work
                                </h2>
                                <div className="grid grid-cols-2 gap-6">
                                    {data.portfolio.map(p => (
                                        <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                            <h3 className="font-bold text-stone-800 mb-1">{p.name}</h3>
                                            <p className="text-stone-500 text-sm line-clamp-3">{p.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
