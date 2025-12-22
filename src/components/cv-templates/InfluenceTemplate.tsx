import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, MapPin, Globe } from 'lucide-react';

export const InfluenceTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-slate-50 font-sans shadow-sm min-h-[297mm] flex flex-col items-center pt-16 p-8">
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl overflow-hidden mb-8">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                    {data.personal.photo && (
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    )}
                </div>
                <div className="pt-20 pb-8 px-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.personal.fullName}</h1>
                    <p className="text-lg text-purple-600 font-medium mb-6">@{data.personal.role.replace(/\s+/g, '').toLowerCase()}</p>

                    <div className="flex justify-center gap-4 text-sm text-gray-500 mb-8 flex-wrap">
                        {data.personal.email && <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"><Mail size={14} /> {data.personal.email}</span>}
                        {data.personal.website && <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"><Globe size={14} /> {data.personal.website}</span>}
                        {data.personal.address && <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"><MapPin size={14} /> {data.personal.address}</span>}
                    </div>

                    <div className="flex justify-center gap-2 max-w-xl mx-auto flex-wrap">
                        {data.skills.map(skill => (
                            <span key={skill} className="px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200 hover:border-purple-500 hover:text-purple-600 transition-colors cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
                {data.personal.summary && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">About <span className="text-purple-500">.</span></h2>
                        <p className="text-gray-600 leading-relaxed">{data.personal.summary}</p>
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Career Path <span className="text-purple-500">.</span></h2>
                        <div className="space-y-8">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="relative pl-8 border-l-2 border-purple-100">
                                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-white"></span>
                                    <h3 className="font-bold text-lg">{exp.role}</h3>
                                    <p className="text-purple-600 font-medium text-sm mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    {data.education.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Education <span className="text-purple-500">.</span></h2>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold">{edu.school}</div>
                                        <div className="text-sm text-gray-500">{edu.degree}</div>
                                        <div className="text-xs text-purple-500 mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.portfolio.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Highlights <span className="text-purple-500">.</span></h2>
                            <div className="space-y-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <div className="font-bold text-sm underline decoration-purple-200 decoration-2 underline-offset-2">{p.name}</div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
