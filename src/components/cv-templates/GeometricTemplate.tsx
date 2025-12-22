import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

export const GeometricTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <>
            <style>
                {`
                @media print {
                    html, body {
                        min-height: 297mm !important;
                        height: 297mm !important;
                        background: linear-gradient(to right, #1e293b 35%, #0f172a 35%) !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        overflow: hidden !important;
                    }
                }
                `}
            </style>
            <div style={{ ...getStyles(design), minHeight: '296.8mm', background: 'linear-gradient(to right, #1e293b 35%, #0f172a 35%)', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }} className="w-full bg-slate-900 text-white font-sans relative">
                {/* Background Decorations - Fixed position to background layer */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                <div className="relative z-10 flex">
                    {/* Left/Top Header Area - Sidebar */}
                    <div className="w-[35%] bg-slate-800 backdrop-blur-sm border-r border-slate-700/50 p-8 flex flex-col">
                        <div className="mb-8 text-center relative">
                            {data.personal.photo ? (
                                <div className="mx-auto w-32 h-32 mb-4 relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-blue-500 p-1" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                        <div className="w-full h-full bg-slate-900" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                            <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-emerald-500 to-blue-500 mb-6 flex items-center justify-center font-bold text-4xl" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                    {data.personal.fullName.charAt(0)}
                                </div>
                            )}
                            <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">{data.personal.fullName}</h1>
                            <p className="text-emerald-400 font-mono text-sm">{data.personal.role}</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3 text-sm text-slate-300">
                                {data.personal.email && <div className="flex items-center gap-3"><Mail size={14} className="text-emerald-400" /> <span className="break-all">{data.personal.email}</span></div>}
                                {data.personal.phone && <div className="flex items-center gap-3"><Phone size={14} className="text-emerald-400" /> {data.personal.phone}</div>}
                                {data.personal.address && <div className="flex items-center gap-3"><MapPin size={14} className="text-emerald-400" /> {data.personal.address}</div>}
                                {data.personal.website && <div className="flex items-center gap-3"><Globe size={14} className="text-emerald-400" /> <span className="break-all">{data.personal.website}</span></div>}
                            </div>

                            <div className="pt-6 border-t border-slate-700">
                                <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rotate-45"></span> Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.skills.map(s => (
                                        <span key={s} className="text-xs bg-slate-700 border border-slate-600 text-slate-200 px-2 py-1 transform hover:-translate-y-0.5 transition-transform duration-200">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-700">
                                <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-blue-500 rotate-45"></span> Education
                                </h3>
                                <div className="space-y-4">
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="relative pl-4 border-l border-slate-700">
                                            <span className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 bg-blue-500"></span>
                                            <div className="text-sm font-bold">{edu.school}</div>
                                            <div className="text-xs text-slate-400">{edu.degree}</div>
                                            <div className="text-[10px] text-slate-500 font-mono mt-1">{edu.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {data.personal.summary && (
                            <div className="mb-10 bg-slate-800/30 p-6 border-l-2 border-emerald-500">
                                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    Profile
                                </h2>
                                <p className="text-slate-300 leading-relaxed text-sm">{data.personal.summary}</p>
                            </div>
                        )}

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                                Experience <span className="h-px bg-slate-700 flex-1"></span>
                            </h2>

                            <div className="space-y-8">
                                {data.experience.map((exp) => (
                                    <div key={exp.id} className="group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{exp.role}</h3>
                                                <div className="text-emerald-500 font-mono text-sm">{exp.company}</div>
                                            </div>
                                            <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-slate-700">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.portfolio.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                                    Projects <span className="h-px bg-slate-700 flex-1"></span>
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {data.portfolio.map(p => (
                                        <div key={p.id} className="bg-slate-800/50 p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-colors group">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-sm text-white">{p.name}</h3>
                                                {p.link && <ExternalLink size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />}
                                            </div>
                                            <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
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
