import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const GlitchTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-neutral-900 text-green-400 font-mono shadow-sm min-h-[297mm] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-pink-500"></div>
            <div className="border-4 border-green-500/50 h-full p-8 relative">
                <div className="absolute top-4 right-4 w-4 h-4 bg-pink-500 animate-pulse"></div>

                <header className="mb-16 border-b border-green-500/30 pb-8">
                    <h1 className="text-6xl font-bold mb-2 uppercase tracking-tighter mix-blend-screen" style={{ textShadow: '2px 2px 0px #ec4899' }}>
                        {data.personal.fullName}
                    </h1>
                    <p className="text-xl text-pink-500 uppercase tracking-widest">{data.personal.role}</p>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 border-r border-green-500/30 pr-8 space-y-12">
                        <section>
                            <h2 className="text-sm font-bold bg-green-500/10 text-green-300 inline-block px-2 py-1 mb-4 uppercase tracking-widest">[Contact_Info]</h2>
                            <ul className="space-y-4 text-sm opacity-80">
                                {data.personal.email && <li className="break-all">&gt; {data.personal.email}</li>}
                                {data.personal.phone && <li>&gt; {data.personal.phone}</li>}
                                {data.personal.address && <li>&gt; {data.personal.address}</li>}
                                {data.personal.website && <li className="break-all">&gt; {data.personal.website}</li>}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-sm font-bold bg-green-500/10 text-green-300 inline-block px-2 py-1 mb-4 uppercase tracking-widest">[Skills_Set]</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="border border-green-500/50 px-2 py-1 text-xs hover:bg-green-500 hover:text-black transition-colors cursor-pointer">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold bg-green-500/10 text-green-300 inline-block px-2 py-1 mb-4 uppercase tracking-widest">[Education_Log]</h2>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="opacity-90">
                                            <div className="font-bold text-pink-500">{edu.school}</div>
                                            <div className="text-xs">{edu.degree}</div>
                                            <div className="text-xs mt-1 border border-pink-500/30 inline-block px-1 text-pink-300">{edu.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-8 space-y-12">
                        {data.personal.summary && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-pink-500"></span>
                                    SYSTEM_PROFILE
                                </h2>
                                <p className="text-green-200 leading-relaxed font-light border-l border-green-500/20 pl-4">
                                    {data.personal.summary}
                                </p>
                            </section>
                        )}

                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-pink-500"></span>
                                    WORK_HISTORY
                                </h2>
                                <div className="space-y-10">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="relative group">
                                            <div className="absolute -left-2 top-0 w-1 h-full bg-pink-500/0 group-hover:bg-pink-500 transition-colors"></div>
                                            <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                                            <div className="flex justify-between text-sm mb-4 border-b border-green-500/30 pb-2">
                                                <span className="text-pink-400">{exp.company}</span>
                                                <span className="opacity-60">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm text-green-100 opacity-80 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
