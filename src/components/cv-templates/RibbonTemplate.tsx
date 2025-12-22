import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, User, Link as LinkIcon } from 'lucide-react';

export const RibbonTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] p-10 relative overflow-hidden">

            <header className="flex gap-8 items-center mb-16">
                {data.personal.photo ? (
                    <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-xl bg-gray-200 shrink-0">
                        <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                ) : (
                    <div className="w-40 h-40 rounded-full flex items-center justify-center bg-gray-100 border-8 border-white shadow-xl shrink-0">
                        <User size={48} className="text-gray-300" />
                    </div>
                )}

                <div>
                    <h1 className="text-6xl font-bold text-gray-900 mb-2 tracking-tight">{data.personal.fullName}</h1>
                    <div className="inline-block bg-gray-900 text-white text-xl font-bold px-6 py-2 uppercase tracking-widest shadow-lg" style={{ backgroundColor: design.themeColor }}>
                        {data.personal.role}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-3 gap-12">
                <div className="col-span-1 space-y-10">
                    <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-gray-900 pl-3" style={{ borderColor: design.themeColor }}>{t('cv.contact')}</h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            {data.personal.email && <div className="flex items-center gap-2"><Mail size={16} className="text-gray-400" /> <span className="break-all">{data.personal.email}</span></div>}
                            {data.personal.phone && <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400" /> {data.personal.phone}</div>}
                            {data.personal.address && <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {data.personal.address}</div>}
                            {data.personal.website && <div className="flex items-center gap-2"><LinkIcon size={16} className="text-gray-400" /> <span className="break-all">{data.personal.website}</span></div>}
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-gray-900 pl-3" style={{ borderColor: design.themeColor }}>Skills</h3>
                        <div className="space-y-2">
                            {data.skills.map(skill => (
                                <div key={skill} className="bg-gray-100 px-4 py-2 rounded text-gray-700 font-medium text-sm flex justify-between group">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.education.length > 0 && (
                        <section>
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest mb-6 border-l-4 border-gray-900 pl-3" style={{ borderColor: design.themeColor }}>Education</h3>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-gray-900">{edu.school}</div>
                                        <div className="text-gray-600 text-sm mb-1">{edu.degree}</div>
                                        <div className="text-xs font-bold text-gray-400">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-2 space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-1 bg-gray-900" style={{ backgroundColor: design.themeColor }}></span>
                                About Me
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-8 h-1 bg-gray-900" style={{ backgroundColor: design.themeColor }}></span>
                                Work Experience
                            </h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="font-bold text-xl text-gray-800">{exp.role}</h3>
                                            <span className="text-sm font-bold text-gray-400">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-gray-900 font-medium mb-3 border-b border-gray-100 pb-2 inline-block hover:text-blue-600 transition-colors" style={{ color: design.themeColor }}>{exp.company}</h4>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                                <span className="w-8 h-1 bg-gray-900" style={{ backgroundColor: design.themeColor }}></span>
                                Featured Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-2">{p.name}</h3>
                                        <p className="text-gray-600 text-sm">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
