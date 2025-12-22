import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm flex flex-col">
            <header style={{ backgroundColor: design.themeColor }} className="text-white p-10 flex items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight uppercase mb-2">{data.personal.fullName}</h1>
                    <p className="text-xl font-medium tracking-wide opacity-90">{data.personal.role}</p>
                    <div className="flex flex-wrap gap-6 mt-6 text-sm opacity-80">
                        {data.personal.email && <div className="flex items-center gap-2"><Mail size={16} /> {data.personal.email}</div>}
                        {data.personal.phone && <div className="flex items-center gap-2"><Phone size={16} /> {data.personal.phone}</div>}
                        {data.personal.address && <div className="flex items-center gap-2"><MapPin size={16} /> {data.personal.address}</div>}
                    </div>
                </div>
                {data.personal.photo && (
                    <img src={data.personal.photo} alt="Profile" className="w-32 h-32 rounded-lg object-cover border-4 border-white/20" />
                )}
            </header>

            <div className="flex-1 p-10 grid grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="col-span-8 space-y-8">
                    <section>
                        <h2 style={{ color: design.themeColor, borderColor: design.themeColor }} className="text-xl font-bold border-b-2 pb-2 mb-4 flex items-center gap-2">
                            <span style={{ backgroundColor: design.themeColor }} className="text-white w-6 h-6 flex items-center justify-center rounded text-sm">P</span> Profile
                        </h2>
                        <p className="leading-relaxed text-sm opacity-90">{data.personal.summary}</p>
                    </section>

                    <section>
                        <h2 style={{ color: design.themeColor, borderColor: design.themeColor }} className="text-xl font-bold border-b-2 pb-2 mb-6 flex items-center gap-2">
                            <span style={{ backgroundColor: design.themeColor }} className="text-white w-6 h-6 flex items-center justify-center rounded text-sm">E</span> Experience
                        </h2>
                        <div className="space-y-6">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200">
                                    <div style={{ borderColor: design.themeColor }} className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 bg-white"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-lg">{exp.role}</h3>
                                        <span className="text-sm font-medium opacity-60 bg-gray-100 px-3 py-1 rounded-full">{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <h4 className="font-semibold mb-2 opacity-80">{exp.company}</h4>
                                    <p className="text-sm whitespace-pre-wrap opacity-90">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 style={{ color: design.themeColor, borderColor: design.themeColor }} className="text-xl font-bold border-b-2 pb-2 mb-4 flex items-center gap-2">
                                <span style={{ backgroundColor: design.themeColor }} className="text-white w-6 h-6 flex items-center justify-center rounded text-sm">W</span> Portfolio
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.portfolio.map(item => (
                                    <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-bold text-sm mb-1">{item.name}</h3>
                                        <p className="text-xs opacity-80 mb-2">{item.description}</p>
                                        {item.link && <span className="text-xs text-blue-600 underline">{item.link}</span>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar */}
                <div className="col-span-4 space-y-8">
                    <section className="bg-gray-50 p-6 rounded-xl">
                        <h2 style={{ color: design.themeColor }} className="text-lg font-bold mb-4 uppercase tracking-wider">{t('cv.education')}</h2>
                        <div className="space-y-4">
                            {data.education.map(edu => (
                                <div key={edu.id} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                                    <h3 className="font-bold">{edu.school}</h3>
                                    <p className="text-sm font-medium opacity-80">{edu.degree}</p>
                                    <p className="text-xs opacity-60 mt-1">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 style={{ color: design.themeColor }} className="text-lg font-bold mb-4 uppercase tracking-wider">{t('cv.skills')}</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} style={{ backgroundColor: design.themeColor }} className="text-white px-3 py-1.5 rounded text-xs font-medium shadow-sm opacity-90">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h2 style={{ color: design.themeColor }} className="text-lg font-bold mb-4 uppercase tracking-wider">{t('cv.languages')}</h2>
                            <ul className="space-y-2 text-sm opacity-80">
                                {data.languages.map(l => <li key={l.id} className="flex justify-between"><span>{l.language}</span> <span className="opacity-60">{l.proficiency}</span></li>)}
                            </ul>
                        </section>
                    )}

                    {data.personal.website && (
                        <section>
                            <h2 style={{ color: design.themeColor }} className="text-lg font-bold mb-4 uppercase tracking-wider">Links</h2>
                            <div className="flex items-center gap-2 text-sm underline opacity-80">
                                <Globe size={14} /> {data.personal.website}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
