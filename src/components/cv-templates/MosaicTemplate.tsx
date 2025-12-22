import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Briefcase, User, GraduationCap, Zap, Layout } from 'lucide-react';

export const MosaicTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-gray-50 font-sans shadow-sm min-h-[297mm] p-4">
            <div className="grid grid-cols-4 gap-4 h-full">
                {/* Header Tile */}
                <div className="col-span-3 bg-white p-8 rounded-2xl shadow-sm flex flex-col justify-center">
                    <h1 className="text-4xl font-bold mb-2" style={{ color: design.themeColor }}>{data.personal.fullName}</h1>
                    <p className="text-gray-500 uppercase tracking-widest">{data.personal.role}</p>
                </div>

                {/* Photo Tile */}
                <div className="col-span-1 rounded-2xl overflow-hidden shadow-sm relative group bg-gray-200">
                    {data.personal.photo ? (
                        <img src={data.personal.photo} className="w-full h-full object-cover absolute inset-0 transition-transform group-hover:scale-110" alt="Profile" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={48} />
                        </div>
                    )}
                </div>

                {/* Contact Tile */}
                <div className="col-span-1 bg-gray-900 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-center gap-3 text-sm">
                    {data.personal.email && <div className="truncate"><span className="opacity-50 block text-xs mb-1">Email</span>{data.personal.email}</div>}
                    {data.personal.phone && <div className="truncate"><span className="opacity-50 block text-xs mb-1">Phone</span>{data.personal.phone}</div>}
                    {data.personal.address && <div className="truncate"><span className="opacity-50 block text-xs mb-1">Location</span>{data.personal.address}</div>}
                </div>

                {/* Summary Tile */}
                <div className="col-span-3 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="font-bold uppercase text-xs text-gray-400 mb-4 tracking-wider">{t('cv.about')}</h2>
                    <p className="text-gray-700 leading-relaxed text-lg">{data.personal.summary}</p>
                </div>

                {/* Experience Tile - Spans full width or large area */}
                <div className="col-span-4 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="font-bold uppercase text-xs text-gray-400 mb-6 tracking-wider flex items-center gap-2">
                        <Briefcase size={14} /> Work History
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.experience.map((exp, i) => (
                            <div key={exp.id} className={`p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors ${i === 0 ? 'md:col-span-2 bg-gray-50/50' : ''}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg">{exp.role}</h3>
                                    <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <div className="text-sm font-bold text-blue-600 mb-2">{exp.company}</div>
                                <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills Tile */}
                <div className="col-span-2 row-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 rounded-2xl shadow-sm" style={{ backgroundImage: `linear-gradient(135deg, ${design.themeColor}, ${design.themeColor}dd)` }}>
                    <h2 className="font-bold uppercase text-xs text-white/50 mb-6 tracking-wider flex items-center gap-2">
                        <Zap size={14} /> Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(skill => (
                            <span key={skill} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30 transition-colors">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Key Stats/Education Tile */}
                <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="font-bold uppercase text-xs text-gray-400 mb-6 tracking-wider flex items-center gap-2">
                        <GraduationCap size={14} /> Education
                    </h2>
                    <div className="space-y-4">
                        {data.education.map(edu => (
                            <div key={edu.id} className="flex justify-between items-center border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                <div>
                                    <div className="font-bold">{edu.school}</div>
                                    <div className="text-xs text-gray-500">{edu.degree}</div>
                                </div>
                                <div className="text-xs font-bold text-gray-300">{edu.year}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer/Portfolio Tile */}
                <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="font-bold uppercase text-xs text-gray-400 mb-4 tracking-wider flex items-center gap-2">
                        <Layout size={14} /> Projects
                    </h2>
                    <div className="space-y-3">
                        {data.portfolio.slice(0, 3).map(p => (
                            <div key={p.id}>
                                <div className="font-bold text-sm truncate">{p.name}</div>
                                <div className="text-xs text-gray-500 truncate">{p.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
