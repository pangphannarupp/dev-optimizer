import { useTranslation } from 'react-i18next';
import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, Globe, Briefcase, ExternalLink } from 'lucide-react';

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const { t } = useTranslation();
    return (
        <div style={getStyles(design)} className="relative w-full min-h-[297mm] bg-white font-sans shadow-sm flex flex-row min-h-[297mm] flex-1">
            {/* Fixed Sidebar Background for Print */}
            <div className="absolute inset-y-0 left-0 w-[35%] bg-gray-900 print:fixed print:inset-y-0 print:left-0 print:w-[35%] print:h-auto" />

            {/* Sidebar Content */}
            <div className="relative z-10 w-[35%] shrink-0 text-white p-8 flex flex-col gap-10">
                <div className="text-center">
                    {data.personal.photo ? (
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-700 shadow-xl mb-6">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-6">
                            {data.personal.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                    )}
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-700 pb-6">{t('cv.contact')}</h2>
                    <div className="space-y-4 text-sm text-gray-300 text-left">
                        {data.personal.email && <div className="flex items-center gap-3 break-all"><Mail style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.email}</span></div>}
                        {data.personal.phone && <div className="flex items-center gap-3"><Phone style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.phone}</span></div>}
                        {data.personal.address && <div className="flex items-center gap-3"><MapPin style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.address}</span></div>}
                        {data.personal.website && <div className="flex items-center gap-3"><Globe style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.website}</span></div>}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-700 pb-6">{t('cv.education')}</h2>
                    <div className="space-y-6">
                        {data.education.map(edu => (
                            <div key={edu.id}>
                                <h3 className="font-bold text-white">{edu.school}</h3>
                                <p style={{ color: design.themeColor }} className="text-sm mt-1">{edu.degree}</p>
                                <p className="text-gray-400 text-xs mt-1 bg-gray-800 inline-block px-2 py-0.5 rounded">{edu.year}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-700 pb-6">{t('cv.skills')}</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(skill => (
                            <span key={skill} className="bg-gray-800 text-gray-200 px-3 py-1 rounded text-xs border border-gray-700">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Light */}
            <div className="flex-1 p-10 bg-white">
                <header className="mb-12">
                    <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-2">
                        {data.personal.fullName}
                    </h1>
                    <p style={{ color: design.themeColor }} className="text-2xl font-light tracking-wide uppercase">
                        {data.personal.role}
                    </p>
                </header>

                <div className="space-y-10">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                            <span style={{ backgroundColor: design.themeColor }} className="w-12 h-1 rounded-full"></span>
                            About Me
                        </h2>
                        <p className="leading-8 text-lg font-light opacity-80">
                            {data.personal.summary}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span style={{ backgroundColor: design.themeColor }} className="w-12 h-1 rounded-full"></span>
                            Work Experience
                        </h2>
                        <div className="space-y-10">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="group">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-xl font-bold transition-colors">
                                            {exp.role}
                                        </h3>
                                        <span style={{ color: design.themeColor, borderColor: design.themeColor }} className="font-bold text-sm bg-gray-50 px-3 py-1 rounded-full border opacity-90">
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    <h4 className="font-medium mb-3 flex items-center gap-2 opacity-70">
                                        <Briefcase size={16} /> {exp.company}
                                    </h4>
                                    <p className="leading-relaxed border-l-4 border-gray-100 pl-4 py-1 opacity-80">
                                        {exp.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <span style={{ backgroundColor: design.themeColor }} className="w-12 h-1 rounded-full"></span>
                                Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.portfolio.map(item => (
                                    <div key={item.id} className="bg-gray-50 border border-gray-100 p-4 rounded-xl">
                                        <h3 className="font-bold mb-1">{item.name}</h3>
                                        <p className="text-sm opacity-80 mb-3">{item.description}</p>
                                        {item.link && (
                                            <a href={`https://${item.link}`} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:underline" style={{ color: design.themeColor }}>
                                                View Project <ExternalLink size={10} />
                                            </a>
                                        )}
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
