import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe, Briefcase, User } from 'lucide-react';

export const RoseTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans flex text-gray-800">
            {/* Left Column (Narrower) */}
            <aside className="w-[30%] pt-12 px-6 pb-8 flex flex-col">
                <div className="mb-8">
                    {data.personal.photo ? (
                        <div className="w-full aspect-square bg-gray-100 overflow-hidden mb-4">
                            <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-full aspect-square bg-[#E8DCCF] flex items-center justify-center text-gray-500 mb-4">
                            <User size={64} />
                        </div>
                    )}
                </div>

                <div className="space-y-10">
                    <section>
                        <div className="space-y-4 text-sm text-gray-700">
                            <div className="flex items-center gap-3">
                                <Phone size={14} /> <span>{data.personal.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={14} /> <span className="break-all">{data.personal.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe size={14} /> <span>{data.personal.website}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin size={14} /> <span>{data.personal.address}</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Education</h3>
                        {/* Pink Accent Line */}
                        <div className="w-12 h-1 bg-[#dcbca9] mb-4" />

                        <div className="space-y-6">
                            {data.education.map((edu, index) => (
                                <div key={index} className="text-sm">
                                    <div className="font-bold text-gray-800">{edu.degree}</div>
                                    <div className="text-gray-600">{edu.school}</div>
                                    <div className="text-gray-400 text-xs mt-1">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-lg text-gray-900 mb-4">Expertise</h3>
                        <div className="w-12 h-1 bg-[#dcbca9] mb-4" />
                        <ul className="space-y-2 text-sm text-gray-700">
                            {data.skills.map((skill, index) => (
                                <li key={index}>• {skill}</li>
                            ))}
                        </ul>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Language</h3>
                            <div className="w-12 h-1 bg-[#dcbca9] mb-4" />
                            <div className="space-y-1 text-sm text-gray-700">
                                {data.languages.map((lang, index) => (
                                    <div key={index}>{lang.language}</div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </aside>

            {/* Right Column (Wider) */}
            <main className="flex-1 bg-white pt-12 px-8 pb-8">
                {/* Header in main column */}
                <header className="mb-4 bg-[#f4f1ee] p-8 -mt-12 -mx-8">
                    <h1 className="text-4xl font-bold text-gray-900 uppercase tracking-widest mb-2">
                        {data.personal.fullName}
                    </h1>
                    <p className="text-xl text-gray-500 font-light tracking-wide">{data.personal.role}</p>
                </header>

                <div className="space-y-10 mt-8">
                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-4">
                            <User size={18} /> Profile
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {data.personal.summary}
                        </p>
                    </section>

                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-6">
                            <Briefcase size={18} /> Work Experience
                        </h3>
                        <div className="space-y-0 border-l border-gray-200 ml-2 pl-6">
                            {data.experience.map((exp, index) => (
                                <div key={index} className="relative mb-8 last:mb-0">
                                    <div className="absolute -left-[30px] top-1 w-3 h-3 bg-[#dcbca9] rounded-full ring-4 ring-white" />
                                    <div className="flex flex-row justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900 text-lg">{exp.company}</h4>
                                        <span className="text-xs font-bold text-gray-900">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-2 font-medium">{exp.role}</div>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-6">
                            <User size={18} /> References
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {data.references.map((ref, index) => (
                                <div key={index}>
                                    <div className="font-bold text-gray-900 text-sm">{ref.name}</div>
                                    <div className="text-sm text-gray-500">{ref.company}</div>
                                    <div className="text-xs text-gray-400 mt-1">{ref.email} | {ref.phone}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};
