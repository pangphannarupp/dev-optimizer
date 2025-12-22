import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

export const MintTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans shadow-sm min-h-[297mm] flex">
            {/* Sidebar */}
            <div className="w-[35%] bg-emerald-50 p-8 flex flex-col gap-10 border-r border-emerald-100" style={{ backgroundColor: `${design.themeColor}10` }}>
                <div className="text-center">
                    {data.personal.photo && (
                        <div className="w-32 h-32 mx-auto rounded-full mb-6 overflow-hidden border-4 border-white shadow-md">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    )}

                    <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 mb-6 border-b border-emerald-200 pb-2" style={{ color: design.themeColor }}>{t('cv.contact')}</h2>
                    <div className="flex flex-col gap-3 text-sm text-emerald-900">
                        {data.personal.email && <div className="break-all flex items-center gap-2"><Mail size={14} /> {data.personal.email}</div>}
                        {data.personal.phone && <div className="flex items-center gap-2"><Phone size={14} /> {data.personal.phone}</div>}
                        {data.personal.address && <div className="flex items-center gap-2"><MapPin size={14} /> {data.personal.address}</div>}
                        {data.personal.website && <div className="break-all flex items-center gap-2"><LinkIcon size={14} /> {data.personal.website}</div>}
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 mb-6 border-b border-emerald-200 pb-2" style={{ color: design.themeColor }}>{t('cv.education')}</h2>
                    <div className="space-y-6">
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <div className="font-bold text-gray-900">{edu.school}</div>
                                <div className="text-sm text-emerald-700">{edu.degree}</div>
                                <div className="text-xs font-medium text-emerald-500 mt-1">{edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 mb-6 border-b border-emerald-200 pb-2" style={{ color: design.themeColor }}>{t('cv.skills')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(skill => (
                            <span key={skill} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-emerald-800 shadow-sm border border-emerald-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 pt-12">
                <header className="mb-12 border-b-2 border-emerald-100 pb-8" style={{ borderColor: `${design.themeColor}30` }}>
                    <h1 className="text-5xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{data.personal.fullName}</h1>
                    <p className="text-xl text-emerald-600 font-medium tracking-wide uppercase" style={{ color: design.themeColor }}>{data.personal.role}</p>
                </header>

                <div className="space-y-10">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                                <span className="w-2 h-8 bg-emerald-400 rounded-full" style={{ backgroundColor: design.themeColor }}></span>
                                Profile
                            </h2>
                            <p className="text-gray-600 leading-relaxed">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-emerald-400 rounded-full" style={{ backgroundColor: design.themeColor }}></span>
                                Experience
                            </h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative pl-6 border-l-2 border-emerald-100" style={{ borderColor: `${design.themeColor}30` }}>
                                        <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white border-4 border-emerald-200" style={{ borderColor: `${design.themeColor}50` }}></div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-xl text-gray-900">{exp.role}</h3>
                                            <span className="text-sm font-bold text-emerald-500" style={{ color: design.themeColor }}>{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-gray-500 font-medium mb-2">{exp.company}</h4>
                                        <p className="text-gray-600 leading-relaxed text-sm">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-emerald-400 rounded-full" style={{ backgroundColor: design.themeColor }}></span>
                                Projects
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="bg-gray-50 p-5 rounded-lg border-l-4 border-emerald-400" style={{ borderColor: design.themeColor }}>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{p.name}</h3>
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
