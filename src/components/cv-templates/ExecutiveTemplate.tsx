import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe, Briefcase, User, GraduationCap, Layout, Code } from 'lucide-react';

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-serif shadow-sm p-12 min-h-[297mm] flex flex-col">
            <header className="border-b-4 pb-8 mb-8 text-center" style={{ borderColor: design.themeColor }}>
                <h1 className="text-5xl font-bold mb-4 uppercase tracking-wider">{data.personal.fullName}</h1>
                <p className="text-xl tracking-widest uppercase mb-4 opacity-75">{data.personal.role}</p>
                <div className="flex justify-center flex-wrap gap-6 text-sm font-sans opacity-80">
                    {data.personal.email && <span className="flex items-center gap-2"><Mail size={14} /> {data.personal.email}</span>}
                    {data.personal.phone && <span className="flex items-center gap-2"><Phone size={14} /> {data.personal.phone}</span>}
                    {data.personal.address && <span className="flex items-center gap-2"><MapPin size={14} /> {data.personal.address}</span>}
                    {data.personal.website && <span className="flex items-center gap-2"><Globe size={14} /> {data.personal.website}</span>}
                </div>
            </header>

            <div className="flex gap-12 flex-1">
                <div className="flex-1 space-y-8">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <User size={18} /> Executive Summary
                            </h2>
                            <p className="leading-relaxed opacity-80 text-justify">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <Briefcase size={18} /> Professional Experience
                            </h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg">{exp.role}</h3>
                                            <span className="text-sm font-sans font-medium opacity-60 bg-gray-100 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="font-semibold mb-2 opacity-75" style={{ color: design.themeColor }}>{exp.company}</p>
                                        <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <Layout size={18} /> Key Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="bg-gray-50 p-4 border-l-4" style={{ borderColor: design.themeColor }}>
                                        <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                                        <p className="text-xs opacity-70 mb-2 line-clamp-2">{p.description}</p>
                                        {p.link && <a href={`https://${p.link}`} className="text-xs font-bold underline decoration-2 underline-offset-2" style={{ color: design.themeColor }}>View Case Study</a>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="w-64 shrink-0 space-y-8">
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <GraduationCap size={18} /> Education
                            </h2>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold leading-tight mb-1">{edu.school}</h3>
                                        <p className="text-sm opacity-80 mb-1">{edu.degree}</p>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded inline-block">{edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                            <Code size={18} /> Expertise
                        </h2>
                        <div className="space-y-3">
                            {data.skills.map(skill => (
                                <div key={skill}>
                                    <span className="block text-sm font-medium mb-1">{skill}</span>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${Math.random() * 40 + 60}%`, backgroundColor: design.themeColor }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <Globe size={18} /> Languages
                            </h2>
                            <ul className="space-y-2">
                                {data.languages.map(l => (
                                    <li key={l.id} className="flex justify-between text-sm">
                                        <span className="font-medium">{l.language}</span>
                                        <span className="opacity-60">{l.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
