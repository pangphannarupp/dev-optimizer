import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe, User } from 'lucide-react';

export const ArcTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans flex flex-col relative overflow-hidden">
            {/* Header Area */}
            <header className="flex items-center gap-8 p-10 pb-4 relative z-10">
                <div className="relative">
                    {/* Blue Circle Background */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#2d6a9f] rounded-full -z-10" />

                    {data.personal.photo ? (
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                            <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-[#f0f4f8] flex items-center justify-center text-[#2d6a9f] border-4 border-white shadow-lg mx-auto">
                            <User size={64} />
                        </div>
                    )}
                </div>

                <div className="flex-1 pt-4">
                    <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-widest mb-2">{data.personal.fullName}</h1>
                    <p className="text-xl text-[#2d6a9f] font-medium tracking-wide">{data.personal.role}</p>
                </div>
            </header>

            <div className="flex flex-1 z-10">
                {/* Left Sidebar */}
                <aside className="w-[32%] bg-[#dae6f0] rounded-tr-[50px] mt-4 pt-12 px-6 pb-8 flex flex-col gap-10">
                    <section>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-gray-900" /> <span>{data.personal.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-gray-900" /> <span>{data.personal.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-gray-900" /> <span>{data.personal.address}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe size={16} className="text-gray-900" /> <span>{data.personal.website}</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-400 pb-2">Education</h3>
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index} className="text-sm">
                                    <div className="font-bold text-gray-900">{edu.degree}</div>
                                    <div className="text-gray-700">{edu.school}</div>
                                    <div className="text-gray-500 text-xs mt-1">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-400 pb-2">Skills</h3>
                        <ul className="space-y-2">
                            {data.skills.map((skill, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-400 pb-2">Language</h3>
                            <div className="space-y-1 text-sm text-gray-700">
                                {data.languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span>{lang.language}</span>
                                        <span className="text-gray-500">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-10 pt-4">
                    <section className="mb-10">
                        <h3 className="font-bold text-lg text-gray-800 mb-4 uppercase">About Me</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {data.personal.summary}
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-gray-800 mb-6 uppercase border-b border-gray-200 pb-2">Work Experience</h3>
                        <div className="space-y-8 relative">
                            {/* Vertical Line ?? Maybe refrain to keep it clean like image */}
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                        <h4 className="font-bold text-gray-900">{exp.role}</h4>
                                        <span className="text-sm text-gray-500 font-medium italic">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-[#2d6a9f] font-medium text-sm mb-2">{exp.company}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line border-l-2 border-gray-100 pl-4">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mt-10">
                        <h3 className="font-bold text-lg text-gray-800 mb-6 uppercase border-b border-gray-200 pb-2">References</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {data.references.map((ref, index) => (
                                <div key={index} className="text-sm">
                                    <div className="font-bold text-gray-900">{ref.name}</div>
                                    <div className="text-[#2d6a9f] font-medium">{ref.company}</div>
                                    <div className="text-gray-500 text-xs mt-1">{ref.email}</div>
                                    <div className="text-gray-500 text-xs">{ref.phone}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};
