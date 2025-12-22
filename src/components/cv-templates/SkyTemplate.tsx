import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Briefcase } from 'lucide-react';

export const SkyTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-slate-50 font-sans shadow-sm min-h-[297mm] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 w-full h-80 bg-gradient-to-b from-sky-400 to-sky-100 rounded-b-[50%] scale-x-125 z-0" style={{ backgroundImage: `linear-gradient(to bottom, ${design.themeColor}, #e0f2fe)` }}></div>

            <header className="relative z-10 text-center pt-16 mb-16 px-16">
                {data.personal.photo && (
                    <div className="w-36 h-36 mx-auto rounded-full border-8 border-white/30 shadow-2xl mb-6 overflow-hidden bg-white">
                        <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                )}
                <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-md">{data.personal.fullName}</h1>
                <p className="text-xl text-sky-900 font-medium uppercase tracking-widest bg-white/40 inline-block px-6 py-1 rounded-full">{data.personal.role}</p>

                <div className="flex justify-center gap-6 mt-8 text-sky-900 font-medium bg-white/60 backdrop-blur-md inline-flex px-8 py-3 rounded-2xl shadow-sm">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>| {data.personal.phone}</span>}
                    {data.personal.address && <span>| {data.personal.address}</span>}
                </div>
            </header>

            <div className="relative z-10 flex-1 px-16 pb-16 grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    {data.personal.summary && (
                        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-sky-100/50">
                            <h2 className="text-xl font-bold text-sky-900 mb-4">{t('cv.about')}</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{data.personal.summary}</p>
                        </div>
                    )}

                    {data.experience.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-sky-100/50">
                            <h2 className="text-xl font-bold text-sky-900 mb-8 flex items-center gap-3 border-b border-sky-100 pb-4">
                                <Briefcase className="text-sky-500" /> Professional Experience
                            </h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-xl text-gray-800">{exp.role}</h3>
                                            <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-gray-500 font-medium mb-3">{exp.company}</h4>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="col-span-4 space-y-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-sky-100/50">
                        <h2 className="text-xl font-bold text-sky-900 mb-6 border-b border-sky-100 pb-2">Top Skills</h2>
                        <div className="flex flex-col gap-3">
                            {data.skills.map(skill => (
                                <div key={skill} className="flex items-center justify-between group">
                                    <span className="font-medium text-gray-700">{skill}</span>
                                    <div className="w-2 h-2 rounded-full bg-sky-200 group-hover:bg-sky-500 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {data.education.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-lg shadow-sky-100/50">
                            <h2 className="text-xl font-bold text-sky-900 mb-6 border-b border-sky-100 pb-2">{t('cv.education')}</h2>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-gray-800">{edu.school}</div>
                                        <div className="text-sm text-sky-500">{edu.degree}</div>
                                        <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
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
