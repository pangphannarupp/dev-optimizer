import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Briefcase, User, Award, Book, GraduationCap } from 'lucide-react';

export const TimelineTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-slate-50 font-sans shadow-sm p-12">
            <header className="text-center mb-16">
                {data.personal.photo && (
                    <div className="w-24 h-24 mx-auto mb-4 p-1 bg-white shadow-lg rounded-full">
                        <img src={data.personal.photo} className="w-full h-full rounded-full object-cover" />
                    </div>
                )}
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{data.personal.fullName}</h1>
                <p style={{ color: design.themeColor }} className="text-xl uppercase tracking-widest font-medium text-xs mb-4">{data.personal.role}</p>
                <div className="flex justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.address && <span>{data.personal.address}</span>}
                </div>
            </header>

            <div className="relative">
                {/* Central Line */}
                <div className="absolute left-0 h-full w-px bg-slate-300 ml-4"></div>

                <div className="space-y-12 ml-10">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                            <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                <User size={16} />
                            </span>
                            Profile
                        </h2>
                        <p className="text-slate-600 leading-relaxed bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                            {data.personal.summary}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                            <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                <Briefcase size={16} />
                            </span>
                            Experience
                        </h2>
                        <div className="space-y-8">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    <div className="absolute -left-[30px] top-2 w-3 h-3 rounded-full border-2 border-white bg-slate-400 z-10"></div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                                                <p style={{ color: design.themeColor }} className="font-medium text-sm">{exp.company}</p>
                                            </div>
                                            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                            <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                <GraduationCap size={16} />
                            </span>
                            Education
                        </h2>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id} className="relative">
                                    <div className="absolute -left-[30px] top-2 w-3 h-3 rounded-full border-2 border-white bg-slate-400 z-10"></div>
                                    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{edu.school}</h3>
                                            <p className="text-sm text-slate-500">{edu.degree}</p>
                                        </div>
                                        <span className="font-bold text-slate-900">{edu.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                    <Award size={16} />
                                </span>
                                Skills
                            </h2>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {(data.languages.length > 0 || data.portfolio.length > 0) && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                        <Book size={16} />
                                    </span>
                                    Extras
                                </h2>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 space-y-4">
                                    {data.languages.length > 0 && (
                                        <div>
                                            <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Languages</h4>
                                            <div className="space-y-1 text-sm">
                                                {data.languages.map(l => <div key={l.id} className="flex justify-between"><span>{l.language}</span> <span className="opacity-50">{l.proficiency}</span></div>)}
                                            </div>
                                        </div>
                                    )}
                                    {data.portfolio.length > 0 && (
                                        <div>
                                            <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Portfolio</h4>
                                            <div className="text-sm space-y-1">
                                                {data.portfolio.slice(0, 3).map(p => <div key={p.id} className="font-bold text-slate-700">{p.name}</div>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
