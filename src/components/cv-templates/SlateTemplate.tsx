import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const SlateTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans flex flex-col shadow-sm">
            {/* Top Bar */}
            <div className="h-4 bg-[#6B7C8C] w-full" />

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-[30%] bg-[#f8f9fa] pt-12 pb-8 px-6 flex flex-col border-r border-gray-100">
                    <div className="mb-10 text-center">
                        {data.personal.photo ? (
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md">
                                <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#6B7C8C] flex items-center justify-center text-white border-4 border-white shadow-md">
                                <span className="text-4xl font-bold">{data.personal.fullName.charAt(0)}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-10">
                        <section>
                            <h3 className="flex items-center gap-2 font-bold text-gray-800 border-l-4 border-[#6B7C8C] pl-3 mb-4 text-sm uppercase tracking-wider">{t('cv.contact')}</h3>
                            <div className="space-y-3 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone size={12} className="text-[#6B7C8C]" /> {data.personal.phone}
                                </div>
                                <div className="flex items-center gap-2 break-all">
                                    <Mail size={12} className="text-[#6B7C8C]" /> {data.personal.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe size={12} className="text-[#6B7C8C]" /> {data.personal.website}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={12} className="text-[#6B7C8C]" /> {data.personal.address}
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 font-bold text-gray-800 border-l-4 border-[#6B7C8C] pl-3 mb-4 text-sm uppercase tracking-wider">Education</h3>
                            <div className="space-y-4">
                                {data.education.map((edu, index) => (
                                    <div key={index} className="text-xs">
                                        <div className="font-bold text-gray-800">{edu.degree}</div>
                                        <div className="text-gray-600">{edu.school}</div>
                                        <div className="text-gray-500 mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 font-bold text-gray-800 border-l-4 border-[#6B7C8C] pl-3 mb-4 text-sm uppercase tracking-wider">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                    <span key={index} className="text-xs text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded-sm shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-10 pt-16">
                    <header className="mb-12 border-b border-gray-200 pb-8">
                        <h1 className="text-4xl font-bold text-gray-900 tracking-widest uppercase mb-3 flex flex-col">
                            {data.personal.fullName.split(' ').map((part, i) => (
                                <span key={i} className={i === 1 ? "font-light" : ""}>{part}</span>
                            ))}
                        </h1>
                        <p className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">{data.personal.role}</p>
                    </header>

                    <section className="mb-10">
                        <div className="flex items-center gap-3 mb-4 text-[#6B7C8C]">
                            <div className="w-4 h-4 bg-[#6B7C8C]" />
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-800">About Me</h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed text-justify">
                            {data.personal.summary}
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6 text-[#6B7C8C]">
                            <div className="w-4 h-4 bg-[#6B7C8C]" />
                            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-800">Experience</h3>
                        </div>
                        <div className="space-y-8">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-bold text-gray-900">{exp.role}</h4>
                                        <span className="text-xs font-medium text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-sm text-[#6B7C8C] mb-2 font-medium">{exp.company}</div>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside marker:text-[#6B7C8C]">
                                        {exp.description.split('\n').map((line, i) => (
                                            line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
            {/* Bottom Bar */}
            <div className="h-4 bg-[#6B7C8C] w-full mt-auto" />
        </div>
    );
};
