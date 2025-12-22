import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Briefcase, GraduationCap, Zap, Layout } from 'lucide-react';

export const FluxTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] p-8 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-100 to-transparent opacity-50 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${design.themeColor}15, transparent)` }}></div>

            <header className="relative z-10 flex flex-col items-center text-center mb-16 pt-8">
                {data.personal.photo && (
                    <div className="w-28 h-28 rounded-2xl bg-white shadow-lg p-1 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src={data.personal.photo} className="w-full h-full object-cover rounded-xl" alt="Profile" />
                    </div>
                )}
                <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-2">{data.personal.fullName}</h1>
                <p className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" style={{ backgroundImage: `linear-gradient(to right, ${design.themeColor}, ${design.themeColor}dd)` }}>
                    {data.personal.role}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500 bg-white/50 backdrop-blur-sm p-2 rounded-full border border-gray-100">
                    {data.personal.email && <span className="px-3 py-1 bg-white rounded-full shadow-sm text-gray-700">{data.personal.email}</span>}
                    {data.personal.phone && <span className="px-3 py-1 bg-white rounded-full shadow-sm text-gray-700">{data.personal.phone}</span>}
                    {data.personal.website && <span className="px-3 py-1 bg-white rounded-full shadow-sm text-gray-700">{data.personal.website}</span>}
                </div>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-12 relative z-10">
                {data.personal.summary && (
                    <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white shadow-sm">
                        <p className="text-center text-lg leading-relaxed text-gray-700">{data.personal.summary}</p>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {data.experience.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                        <Briefcase size={20} />
                                    </div>
                                    Experience
                                </h2>
                                <div className="space-y-8">
                                    {data.experience.map((exp, i) => (
                                        <div key={exp.id} className={`pb-8 ${i !== data.experience.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-xl text-gray-900">{exp.role}</h3>
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <div className="text-base font-medium text-gray-500 mb-3">{exp.company}</div>
                                            <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.portfolio.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                        <Layout size={20} />
                                    </div>
                                    Projects
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {data.portfolio.map(p => (
                                        <div key={p.id} className="bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-colors">
                                            <div className="font-bold text-gray-900 mb-1">{p.name}</div>
                                            <div className="text-sm text-gray-500">{p.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 h-full">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                    <Zap size={16} />
                                </div>
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 border border-gray-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {data.education.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                        <GraduationCap size={16} />
                                    </div>
                                    Education
                                </h2>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <div className="font-bold text-gray-900">{edu.school}</div>
                                            <div className="text-sm text-gray-500">{edu.degree}</div>
                                            <div className="text-xs font-bold text-gray-300 mt-1">{edu.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
