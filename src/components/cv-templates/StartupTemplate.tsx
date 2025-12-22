import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const StartupTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white text-gray-800 p-8 font-sans">
            <div className="flex gap-8 min-h-[297mm]">
                {/* Sidebar */}
                <div className="w-1/3 space-y-8">
                    <div className="space-y-4">
                        {data.personal.photo && (
                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-6">
                                <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight">{data.personal.fullName}</h1>
                            <p className="text-lg text-gray-500 font-medium mt-1">{data.personal.role}</p>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            {data.personal.email && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Mail size={14} /> {data.personal.email}</div>}
                            {data.personal.phone && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Phone size={14} /> {data.personal.phone}</div>}
                            {data.personal.website && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Globe size={14} /> {data.personal.website}</div>}
                            {data.personal.address && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><MapPin size={14} /> {data.personal.address}</div>}
                        </div>
                    </div>

                    {data.skills.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Skills & Tools</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {(data.languages.length > 0 || data.certifications.length > 0) && (
                        <div className="space-y-6">
                            {data.languages.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Languages</h3>
                                    <div className="space-y-2">
                                        {data.languages.map(l => (
                                            <div key={l.id} className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">{l.language}</span>
                                                <span className="text-gray-400">{l.proficiency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-10 pt-2">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> About
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{data.personal.summary}</p>
                        </section>
                    )}

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Experience
                        </h2>
                        <div className="space-y-8 border-l-2 border-gray-100 pl-6 ml-1">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-gray-200 ring-1 ring-gray-100"></span>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                                        <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{exp.startDate} — {exp.endDate}</span>
                                    </div>
                                    <div className="text-blue-600 font-medium mb-3 text-sm">{exp.company}</div>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Selected Work
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="border border-gray-100 hover:border-gray-200 rounded-xl p-4 transition-colors bg-gray-50/50">
                                        <div className="font-bold text-gray-900 mb-1">{p.name}</div>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                                        {p.link && <a href={`https://${p.link}`} className="text-xs text-blue-600 font-medium hover:underline">View Project →</a>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Education
                        </h2>
                        <div className="grid gap-4">
                            {data.education.map(edu => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                        <p className="text-sm text-gray-500">{edu.degree}</p>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
