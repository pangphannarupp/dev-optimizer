import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const ElegantTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-[#fdfbf7] font-serif shadow-sm p-12 border-t-8 border-gray-900">
            <header className="text-center mb-12">
                {data.personal.photo && (
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border border-gray-200">
                        <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                )}
                <h1 className="text-5xl font-normal tracking-tight mb-4 font-serif">{data.personal.fullName}</h1>
                <p style={{ color: design.themeColor }} className="text-lg uppercase tracking-[0.2em] text-xs font-sans mb-6">{data.personal.role}</p>

                <div className="flex justify-center flex-wrap items-center gap-6 text-sm font-sans text-gray-500 border-t border-b border-gray-200 py-3">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.website && <span>{data.personal.website}</span>}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-10 max-w-3xl mx-auto">
                <section>
                    <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-4 text-center">{t('cv.professionalSummary')}</h2>
                    <p className="text-center text-gray-700 leading-8 font-sans">{data.personal.summary}</p>
                </section>

                <div className="w-24 h-px bg-gray-200 mx-auto"></div>

                <section>
                    <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-8 text-center">{t('cv.experience')}</h2>
                    <div className="space-y-10">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="group text-center">
                                <h3 className="text-xl font-medium mb-1 font-serif">{exp.role}</h3>
                                <p className="text-gray-500 font-sans text-sm mb-3 uppercase tracking-wider">{exp.company} <span className="mx-2">•</span> {exp.startDate} - {exp.endDate}</p>
                                <p className="text-gray-600 leading-relaxed font-sans max-w-2xl mx-auto">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {(data.portfolio.length > 0) && (
                    <>
                        <div className="w-24 h-px bg-gray-200 mx-auto"></div>
                        <section>
                            <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-8 text-center">{t('cv.selectedWorks')}</h2>
                            <div className="grid grid-cols-2 gap-8">
                                {data.portfolio.map(item => (
                                    <div key={item.id} className="text-center font-sans">
                                        <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-1">{item.description}</p>
                                        {item.link && <span className="text-xs italic text-gray-400">{item.link}</span>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </>
                )}


                <div className="w-24 h-px bg-gray-200 mx-auto"></div>

                <div className="grid grid-cols-2 gap-12">
                    <section className="text-center">
                        <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-6">{t('cv.education')}</h2>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-gray-800 font-serif">{edu.school}</h3>
                                    <p className="text-gray-600 font-sans text-sm">{edu.degree}</p>
                                    <p className="text-gray-400 font-sans text-xs mt-1">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="text-center">
                        <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-6">{t('cv.expertise')}</h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {data.skills.map(skill => (
                                <span key={skill} className="border border-gray-300 px-3 py-1 rounded-full text-xs font-sans text-gray-600 uppercase tracking-wide">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
