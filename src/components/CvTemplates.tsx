
import React from 'react';
import { CvData, DesignSettings } from '../types/CvTypes';
import { Mail, Phone, MapPin, Globe, Briefcase, User, Award, Book, ExternalLink, GraduationCap, Zap, Layout, Code } from 'lucide-react';

interface TemplateProps {
    data: CvData;
    design: DesignSettings;
}

const getStyles = (design: DesignSettings) => ({
    fontFamily: design.font,
    fontSize: design.fontSize === 'small' ? '0.875rem' : design.fontSize === 'medium' ? '1rem' : '1.125rem',
    color: design.textColor,
});

export const ModernTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans p-8 shadow-sm">
            <header style={{ borderBottomColor: design.themeColor }} className="border-b-2 pb-4 mb-6 flex justify-between items-center gap-6">
                <div className="flex-1">
                    <h1 className="text-4xl font-bold uppercase tracking-wide">{data.personal.fullName}</h1>
                    <p style={{ color: design.themeColor }} className="text-xl font-medium mt-1">{data.personal.role}</p>
                    <div className="flex flex-wrap gap-4 mt-4 text-sm opacity-80">
                        {data.personal.email && <div className="flex items-center gap-1"><Mail size={14} /> {data.personal.email}</div>}
                        {data.personal.phone && <div className="flex items-center gap-1"><Phone size={14} /> {data.personal.phone}</div>}
                        {data.personal.address && <div className="flex items-center gap-1"><MapPin size={14} /> {data.personal.address}</div>}
                        {data.personal.website && <div className="flex items-center gap-1"><Globe size={14} /> {data.personal.website}</div>}
                    </div>
                </div>
                {data.personal.photo && (
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex-shrink-0">
                        <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                    </div>
                )}
            </header>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-6">
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">Profile</h2>
                        <p className="leading-relaxed text-sm whitespace-pre-wrap">{data.personal.summary}</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">Experience</h2>
                        <div className="space-y-4">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold">{exp.role}</h3>
                                        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded opacity-70">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p style={{ color: design.themeColor }} className="font-medium text-sm mb-1">{exp.company}</p>
                                    <p className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">Portfolio</h2>
                            <div className="space-y-3">
                                {data.portfolio.map(item => (
                                    <div key={item.id}>
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold text-sm">{item.name}</h3>
                                            {item.link && <a href={`https://${item.link}`} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1"><ExternalLink size={10} /> {item.link}</a>}
                                        </div>
                                        <p className="text-sm opacity-80 leading-relaxed">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-6">
                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold">{skill}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">Education</h2>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-sm">{edu.school}</h3>
                                    <p className="text-sm opacity-80">{edu.degree}</p>
                                    <span className="text-xs opacity-60">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">Languages</h2>
                            <ul className="space-y-1 text-sm">
                                {data.languages.map(lang => (
                                    <li key={lang.id} className="flex justify-between">
                                        <span className="font-medium">{lang.language}</span>
                                        <span className="opacity-60 text-xs">{lang.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {data.certifications.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">Certifications</h2>
                            <div className="space-y-2">
                                {data.certifications.map(cert => (
                                    <div key={cert.id} className="text-sm">
                                        <p className="font-medium">{cert.name}</p>
                                        <div className="flex justify-between text-xs opacity-60 mt-0.5">
                                            <span>{cert.issuer}</span>
                                            <span>{cert.year}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.references.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase border-b border-gray-200 pb-1 mb-3">References</h2>
                            <div className="space-y-3">
                                {data.references.map(ref => (
                                    <div key={ref.id} className="text-sm">
                                        <p className="font-bold">{ref.name}</p>
                                        <p className="opacity-80 text-xs">{ref.company}</p>
                                        <div className="mt-1 opacity-60 text-xs flex flex-col">
                                            <span>{ref.email}</span>
                                            <span>{ref.phone}</span>
                                        </div>
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

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-serif p-10 shadow-sm leading-relaxed">
            <div className="flex flex-col items-center border-b pb-6 mb-8 text-center" style={{ borderBottomColor: design.themeColor }}>
                {data.personal.photo && (
                    <img src={data.personal.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-4 shadow-sm" />
                )}
                <h1 className="text-3xl font-bold">{data.personal.fullName}</h1>
                <div className="flex justify-center flex-wrap gap-4 mt-2 text-sm italic opacity-80">
                    {data.personal.address && <span>{data.personal.address}</span>}
                    {data.personal.phone && <span>• {data.personal.phone}</span>}
                    {data.personal.email && <span>• {data.personal.email}</span>}
                </div>
            </div>

            <section className="mb-6">
                <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">Professional Summary</h2>
                <p className="text-sm opacity-90">{data.personal.summary}</p>
            </section>

            <section className="mb-6">
                <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-4 uppercase tracking-wider text-sm">Experience</h2>
                <div className="space-y-5">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between font-bold text-sm">
                                <span>{exp.company}, {exp.role}</span>
                                <span className="opacity-80 font-normal">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <p className="text-sm mt-1 whitespace-pre-wrap opacity-90">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-6">
                <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">Education</h2>
                {data.education.map(edu => (
                    <div key={edu.id} className="flex justify-between text-sm mb-1">
                        <span className="font-bold">{edu.school} — {edu.degree}</span>
                        <span className="opacity-80">{edu.year}</span>
                    </div>
                ))}
            </section>

            {(data.skills.length > 0 || data.languages.length > 0 || data.certifications.length > 0) && (
                <section className="mb-6">
                    <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">Skills & Additional Info</h2>
                    <div className="text-sm opacity-90 space-y-2">
                        {data.skills.length > 0 && <p><span className="font-bold">Skills:</span> {data.skills.join(', ')}</p>}
                        {data.languages.length > 0 && <p><span className="font-bold">Languages:</span> {data.languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}</p>}
                        {data.certifications.length > 0 && <p><span className="font-bold">Certifications:</span> {data.certifications.map(c => c.name).join(', ')}</p>}
                    </div>
                </section>
            )}
            {data.references.length > 0 && (
                <section>
                    <h2 style={{ borderBottomColor: design.themeColor }} className="text-lg font-bold border-b mb-3 uppercase tracking-wider text-sm">References</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.references.map(ref => (
                            <div key={ref.id} className="text-sm">
                                <span className="font-bold block">{ref.name}</span>
                                <span className="opacity-80 text-xs block">{ref.company}</span>
                                <span className="opacity-80 text-xs block">{ref.email}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans p-10 shadow-sm">
            <header className="mb-8 flex gap-8 items-start">
                {data.personal.photo && (
                    <img src={data.personal.photo} alt="Profile" className="w-28 h-28 object-cover rounded-none grayscale" />
                )}
                <div>
                    <h1 className="text-5xl font-light mb-2">{data.personal.fullName}</h1>
                    <p style={{ color: design.themeColor }} className="text-xl font-light mb-4">{data.personal.role}</p>
                    <div className="text-sm opacity-60 space-y-1">
                        <p>{data.personal.email}</p>
                        <p>{data.personal.phone}</p>
                        <p>{data.personal.address}</p>
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">About</h3>
                    <p className="leading-7 opacity-80">{data.personal.summary}</p>
                </section>

                <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Experience</h3>
                    <div className="space-y-6 border-l border-gray-100 pl-6">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="relative">
                                <div className="absolute -left-[29px] top-1.5 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                <h4 className="font-medium">{exp.role}</h4>
                                <p style={{ color: design.themeColor }} className="text-sm mb-2 opacity-80">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                                <p className="text-sm leading-6 whitespace-pre-wrap opacity-80">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Education</h3>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <h4 className="font-medium">{edu.school}</h4>
                                        <p className="text-sm opacity-80">{edu.degree}</p>
                                        <p className="text-xs mt-0.5 opacity-60">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        {data.certifications.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Certifications</h3>
                                <ul className="space-y-2 text-sm opacity-80">
                                    {data.certifications.map(c => <li key={c.id}>{c.name} ({c.year})</li>)}
                                </ul>
                            </section>
                        )}
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-80">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-gray-50 px-2 py-1 rounded">{skill}</span>
                                ))}
                            </div>
                        </section>
                        {data.languages.length > 0 && (
                            <section>
                                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4">Languages</h3>
                                <ul className="space-y-1 text-sm opacity-80">
                                    {data.languages.map(l => <li key={l.id}>{l.language} - {l.proficiency}</li>)}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm flex flex-col">
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
                        <h2 style={{ color: design.themeColor }} className="text-lg font-bold mb-4 uppercase tracking-wider">Education</h2>
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
                        <h2 style={{ color: design.themeColor }} className="text-lg font-bold mb-4 uppercase tracking-wider">Skills</h2>
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
                            <h2 style={{ color: design.themeColor }} className="text-lg font-bold mb-4 uppercase tracking-wider">Languages</h2>
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

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="relative w-full min-h-full bg-white font-sans shadow-sm flex flex-row min-h-[297mm] flex-1">
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
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-700 pb-6">Contact</h2>
                    <div className="space-y-4 text-sm text-gray-300 text-left">
                        {data.personal.email && <div className="flex items-center gap-3 break-all"><Mail style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.email}</span></div>}
                        {data.personal.phone && <div className="flex items-center gap-3"><Phone style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.phone}</span></div>}
                        {data.personal.address && <div className="flex items-center gap-3"><MapPin style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.address}</span></div>}
                        {data.personal.website && <div className="flex items-center gap-3"><Globe style={{ color: design.themeColor }} className="flex-shrink-0" size={16} /> <span>{data.personal.website}</span></div>}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-700 pb-6">Education</h2>
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
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-gray-700 pb-6">Skills</h2>
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

export const ElegantTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-[#fdfbf7] font-serif shadow-sm p-12 border-t-8 border-gray-900">
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
                    <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-4 text-center">Professional Profile</h2>
                    <p className="text-center text-gray-700 leading-8 font-sans">{data.personal.summary}</p>
                </section>

                <div className="w-24 h-px bg-gray-200 mx-auto"></div>

                <section>
                    <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-8 text-center">Work Experience</h2>
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
                            <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-8 text-center">Selected Works</h2>
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
                        <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-6">Education</h2>
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
                        <h2 style={{ color: design.themeColor }} className="text-xl italic font-serif opacity-60 mb-6">Expertise</h2>
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

export const TechTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    const accentColor = design.themeColor;
    return (
        <div style={{ ...getStyles(design), color: '#d1d5db', backgroundColor: '#1e1e1e', borderLeftColor: accentColor }} className="w-full min-h-full font-mono shadow-sm p-8 border-l-4">
            <header className="mb-8 border-b border-gray-700 pb-8 flex justify-between items-start">
                <div>
                    <div style={{ color: accentColor }} className="flex items-center gap-2 mb-2 text-sm">
                        <span>$</span>
                        <span className="animate-pulse">_</span>
                        <span>whoami</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">{data.personal.fullName}</h1>
                    <p style={{ color: accentColor }} className="text-xl mb-6 opacity-80">{`> ${data.personal.role}`}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-sans">
                        {data.personal.email && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>@</span> {data.personal.email}</div>}
                        {data.personal.phone && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>#</span> {data.personal.phone}</div>}
                        {data.personal.website && <div className="flex items-center gap-2"><span style={{ color: accentColor }}>/</span> {data.personal.website}</div>}
                    </div>
                </div>
                {data.personal.photo && (
                    <div className="w-24 h-24 border-2 border-dashed p-1" style={{ borderColor: accentColor }}>
                        <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover opacity-80" />
                    </div>
                )}
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">SUMMARY</h2>
                        <div className="bg-[#252526] p-4 rounded border border-gray-700 text-sm leading-relaxed font-sans">
                            {data.personal.summary}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">GIT_REPOS</h2>
                            <div className="space-y-3">
                                {data.portfolio.map(item => (
                                    <div key={item.id} className="bg-[#252526] p-3 rounded border border-gray-700 font-sans">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-white text-sm">{item.name}</h3>
                                            {item.link && <a href={`https://${item.link}`} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: accentColor }}>{item.link}</a>}
                                        </div>
                                        <p className="text-xs text-gray-400">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">EXPERIENCE_LOG</h2>
                        <div className="space-y-6">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="relative pl-6 border-l border-gray-700">
                                    <div style={{ backgroundColor: accentColor }} className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-white font-bold">{exp.role}</h3>
                                        <span className="text-xs text-gray-500 font-mono">[{exp.startDate} :: {exp.endDate}]</span>
                                    </div>
                                    <div style={{ color: accentColor }} className="text-sm mb-2 opacity-80">{`const company = "${exp.company}";`}</div>
                                    <p className="text-sm text-gray-400 font-sans leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="col-span-4 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">SKILLS_ARRAY</h2>
                        <div className="flex flex-wrap gap-2 font-sans">
                            {data.skills.map(skill => (
                                <span key={skill} style={{ color: accentColor, borderColor: `${accentColor}40`, backgroundColor: `${accentColor}20` }} className="border px-2 py-1 rounded text-xs transition-colors cursor-default">
                                    {`"${skill}"`}
                                </span>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">LANGUAGES</h2>
                            <div className="space-y-2 font-mono text-xs text-gray-400">
                                {data.languages.map(l => (
                                    <div key={l.id} className="flex justify-between">
                                        <span>"{l.language}"</span>
                                        <span style={{ color: accentColor }}>: "{l.proficiency}"</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">Badges</h2>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id} className="bg-[#2d2d2d] p-3 rounded border border-gray-700">
                                    <h3 className="font-bold text-white text-sm">{edu.school}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{edu.degree}</p>
                                    <p style={{ color: accentColor }} className="text-[10px] mt-2 text-right">pass: {edu.year}</p>
                                </div>
                            ))}
                            {data.certifications.map(cert => (
                                <div key={cert.id} className="bg-[#2d2d2d] p-3 rounded border border-gray-700">
                                    <h3 className="font-bold text-white text-sm">{cert.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{cert.issuer}</p>
                                    <p style={{ color: accentColor }} className="text-[10px] mt-2 text-right">issued: {cert.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.references.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 before:content-['//'] before:text-gray-600 before:mr-2">REFS</h2>
                            <div className="space-y-2 text-xs text-gray-400 font-mono">
                                {data.references.map(ref => (
                                    <div key={ref.id}>{`// ${ref.name} @ ${ref.company}`}</div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export const CompactTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm p-6">
            <header className="flex justify-between items-start border-b-4 pb-4 mb-4" style={{ borderBottomColor: design.themeColor }}>
                <div className="flex gap-4 items-center">
                    {data.personal.photo && (
                        <img src={data.personal.photo} alt="Profile" className="w-16 h-16 rounded object-cover" />
                    )}
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{data.personal.fullName}</h1>
                        <p style={{ color: design.themeColor }} className="text-lg font-bold uppercase">{data.personal.role}</p>
                    </div>
                </div>
                <div className="text-right text-xs font-medium opacity-60 leading-relaxed">
                    <p>{data.personal.email}</p>
                    <p>{data.personal.phone}</p>
                    <p>{data.personal.address}</p>
                    {data.personal.website && <p>{data.personal.website}</p>}
                </div>
            </header>

            <div className="flex gap-6">
                <div className="w-1/3 space-y-6">
                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Summary</h3>
                        <p className="text-xs text-justify leading-5 opacity-80">{data.personal.summary}</p>
                    </section>

                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Skills</h3>
                        <div className="flex flex-wrap gap-1">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-700 border border-gray-200">{skill}</span>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Education</h3>
                        <div className="space-y-3">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h4 className="font-bold text-xs">{edu.school}</h4>
                                    <p className="text-[10px] opacity-80">{edu.degree}</p>
                                    <p className="text-[10px] opacity-60 italic">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Languages</h3>
                            <ul className="space-y-1 text-[10px] opacity-80">
                                {data.languages.map(l => <li key={l.id} className="flex justify-between"><b>{l.language}</b> {l.proficiency}</li>)}
                            </ul>
                        </section>
                    )}

                    {data.certifications.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-2 pb-1">Certifications</h3>
                            <ul className="space-y-1 text-[10px] opacity-80">
                                {data.certifications.map(c => <li key={c.id}>{c.name}</li>)}
                            </ul>
                        </section>
                    )}
                </div>

                <div className="w-2/3 border-l border-gray-100 pl-6 space-y-6">
                    <section>
                        <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-4 pb-1">Professional Experience</h3>
                        <div className="space-y-4">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-sm">{exp.role}</h4>
                                        <span className="text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p style={{ color: design.themeColor }} className="text-xs font-bold mb-1 opacity-80">{exp.company}</p>
                                    <p className="text-xs opacity-80 leading-5 text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-4 pb-1">Portfolio</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {data.portfolio.map(item => (
                                    <div key={item.id} className="bg-gray-50 p-2 rounded">
                                        <h4 className="font-bold text-xs">{item.name}</h4>
                                        <p className="text-[10px] opacity-80 leading-tight">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.references.length > 0 && (
                        <section>
                            <h3 className="font-black text-sm uppercase border-b-2 border-gray-200 mb-4 pb-1">References</h3>
                            <div className="grid grid-cols-2 gap-3 text-[10px]">
                                {data.references.map(ref => (
                                    <div key={ref.id}>
                                        <p className="font-bold">{ref.name}</p>
                                        <p className="opacity-80">{ref.company}</p>
                                        <p className="opacity-60">{ref.email}</p>
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

export const AcademicTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-serif p-12 shadow-sm leading-relaxed">
            <header className="border-b-2 border-gray-800 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.personal.fullName}</h1>
                <div className="text-sm space-y-1">
                    <p>{data.personal.role}</p>
                    <div className="flex justify-center gap-4">
                        {data.personal.email && <span>{data.personal.email}</span>}
                        {data.personal.phone && <span>{data.personal.phone}</span>}
                        {data.personal.website && <span>{data.personal.website}</span>}
                    </div>
                    {data.personal.address && <p>{data.personal.address}</p>}
                </div>
            </header>

            <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">Education</h2>
                <div className="space-y-4">
                    {data.education.map(edu => (
                        <div key={edu.id} className="flex justify-between">
                            <div>
                                <h3 className="font-bold">{edu.school}</h3>
                                <p className="italic">{edu.degree}</p>
                            </div>
                            <span className="font-medium">{edu.year}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">Research & Experience</h2>
                <div className="space-y-6">
                    {data.experience.map(exp => (
                        <div key={exp.id}>
                            <div className="flex justify-between font-bold mb-1">
                                <span>{exp.role}</span>
                                <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <p className="italic mb-2">{exp.company}</p>
                            <p className="text-sm text-justify opacity-90">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {data.portfolio.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">Publications & Projects</h2>
                    <ul className="list-disc ml-5 space-y-2">
                        {data.portfolio.map(item => (
                            <li key={item.id} className="text-sm">
                                <span className="font-bold">{item.name}</span>. {item.description}
                                {item.link && <span className="block text-xs italic text-blue-800">{item.link}</span>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {(data.certifications.length > 0) && (
                    <section>
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">Awards & Certifications</h2>
                        <ul className="space-y-2">
                            {data.certifications.map(c => (
                                <li key={c.id} className="text-sm flex justify-between">
                                    <span>{c.name} ({c.issuer})</span>
                                    <span>{c.year}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {(data.languages.length > 0 || data.skills.length > 0) && (
                    <section>
                        <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">Skills & Languages</h2>
                        <div className="space-y-2 text-sm">
                            {data.skills.length > 0 && (
                                <p><span className="font-bold">Skills:</span> {data.skills.join(', ')}</p>
                            )}
                            {data.languages.length > 0 && (
                                <p><span className="font-bold">Languages:</span> {data.languages.map(l => l.language).join(', ')}</p>
                            )}
                        </div>
                    </section>
                )}
            </div>

            {data.references.length > 0 && (
                <section className="mt-8">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-4 uppercase">References</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {data.references.map(ref => (
                            <div key={ref.id} className="text-sm">
                                <p className="font-bold">{ref.name}</p>
                                <p className="italic">{ref.company}</p>
                                <p>{ref.email}</p>
                                <p>{ref.phone}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export const SwissTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans text-gray-900 p-0 shadow-sm relative">
            <div className="absolute top-0 left-0 w-[35%] h-full bg-[#f4f4f4] z-0"></div>

            <div className="relative z-10 flex min-h-full">
                {/* Sidebar */}
                <div className="w-[35%] p-10 pt-16 flex flex-col gap-10">
                    <div className="text-left">
                        {data.personal.photo ? (
                            <img src={data.personal.photo} className="w-32 h-32 mb-6 object-cover grayscale" />
                        ) : (
                            <div className="w-32 h-32 mb-6 bg-black text-white flex items-center justify-center text-4xl font-bold">
                                {data.personal.fullName.charAt(0)}
                            </div>
                        )}

                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">Contact</h3>
                        <div className="text-sm space-y-2 opacity-80">
                            {data.personal.email && <p className="break-all">{data.personal.email}</p>}
                            {data.personal.phone && <p>{data.personal.phone}</p>}
                            {data.personal.address && <p>{data.personal.address}</p>}
                            {data.personal.website && <p>{data.personal.website}</p>}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-white border border-gray-300 px-2 py-1">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {(data.languages.length > 0) && (
                        <div>
                            <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">Languages</h3>
                            <ul className="text-sm space-y-1">
                                {data.languages.map(l => (
                                    <li key={l.id} className="flex justify-between">
                                        <span>{l.language}</span>
                                        <span className="opacity-60">{l.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(data.certifications.length > 0) && (
                        <div>
                            <h3 className="font-bold uppercase tracking-wider text-sm border-b border-black pb-2 mb-4">Certifications</h3>
                            <ul className="text-sm space-y-2">
                                {data.certifications.map(c => (
                                    <li key={c.id}>
                                        <div className="font-medium">{c.name}</div>
                                        <div className="text-xs opacity-60">{c.year}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Main */}
                <div className="w-[65%] p-10 pt-16 space-y-12">
                    <header>
                        <h1 className="text-5xl font-bold tracking-tighter leading-none mb-2">{data.personal.fullName}</h1>
                        <p style={{ color: design.themeColor }} className="text-2xl font-light">{data.personal.role}</p>
                        <p className="mt-6 text-sm leading-7 max-w-lg opacity-80">{data.personal.summary}</p>
                    </header>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-8 flex items-center gap-3">Experience <span className="flex-1 h-px bg-gray-200"></span></h2>
                        <div className="space-y-8">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="grid grid-cols-12 gap-4">
                                    <div className="col-span-3 text-xs font-bold opacity-50 pt-1">
                                        {exp.startDate} <br /> {exp.endDate}
                                    </div>
                                    <div className="col-span-9">
                                        <h3 className="font-bold text-lg leading-none mb-1">{exp.role}</h3>
                                        <p className="text-sm font-medium mb-2 opacity-70">{exp.company}</p>
                                        <p className="text-sm leading-relaxed opacity-80">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-8 flex items-center gap-3">Education <span className="flex-1 h-px bg-gray-200"></span></h2>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id} className="grid grid-cols-12 gap-4">
                                    <div className="col-span-3 text-xs font-bold opacity-50 pt-1">
                                        {edu.year}
                                    </div>
                                    <div className="col-span-9">
                                        <h3 className="font-bold text-lg leading-none mb-1">{edu.school}</h3>
                                        <p className="text-sm opacity-70">{edu.degree}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold text-black mb-8 flex items-center gap-3">Portfolio <span className="flex-1 h-px bg-gray-200"></span></h2>
                            <div className="space-y-4">
                                {data.portfolio.map(item => (
                                    <div key={item.id}>
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-sm opacity-80">{item.description}</p>
                                        {item.link && <p className="text-xs text-blue-600">{item.link}</p>}
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

export const TimelineTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-slate-50 font-sans shadow-sm p-12">
            <header className="text-center mb-16">
                {data.personal.photo && (
                    <div className="w-24 h-24 mx-auto mb-4 p-1 bg-white shadow-lg rounded-full">
                        <img src={data.personal.photo} className="w-full h-full rounded-full object-cover" />
                    </div>
                )}
                <h1 className="text-4xl font-bold text-slate-800 mb-2">{data.personal.fullName}</h1>
                <p style={{ color: design.themeColor }} className="text-xl uppercase tracking-widest font-medium text-xs mb-4">{data.personal.role}</p>
                <div className="flex justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.address && <span>{data.personal.address}</span>}
                </div>
            </header>

            <div className="relative">
                {/* Central Line */}
                <div className="absolute left-0 h-full w-px bg-slate-300 ml-4"></div>

                <div className="space-y-12 ml-10">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                            <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                <User size={16} />
                            </span>
                            Profile
                        </h2>
                        <p className="text-slate-600 leading-relaxed bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                            {data.personal.summary}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                            <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                <Briefcase size={16} />
                            </span>
                            Experience
                        </h2>
                        <div className="space-y-8">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    <div className="absolute -left-[30px] top-2 w-3 h-3 rounded-full border-2 border-white bg-slate-400 z-10"></div>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 transition-shadow hover:shadow-md">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                                                <p style={{ color: design.themeColor }} className="font-medium text-sm">{exp.company}</p>
                                            </div>
                                            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center">
                            <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                <GraduationCap size={16} />
                            </span>
                            Education
                        </h2>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id} className="relative">
                                    <div className="absolute -left-[30px] top-2 w-3 h-3 rounded-full border-2 border-white bg-slate-400 z-10"></div>
                                    <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="font-bold text-slate-800">{edu.school}</h3>
                                            <p className="text-sm text-slate-500">{edu.degree}</p>
                                        </div>
                                        <span className="font-bold text-slate-900">{edu.year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                    <Award size={16} />
                                </span>
                                Skills
                            </h2>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-xs font-bold">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {(data.languages.length > 0 || data.portfolio.length > 0) && (
                            <section>
                                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                                    <span className="absolute left-0 w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white z-10">
                                        <Book size={16} />
                                    </span>
                                    Extras
                                </h2>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100 space-y-4">
                                    {data.languages.length > 0 && (
                                        <div>
                                            <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Languages</h4>
                                            <div className="space-y-1 text-sm">
                                                {data.languages.map(l => <div key={l.id} className="flex justify-between"><span>{l.language}</span> <span className="opacity-50">{l.proficiency}</span></div>)}
                                            </div>
                                        </div>
                                    )}
                                    {data.portfolio.length > 0 && (
                                        <div>
                                            <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Portfolio</h4>
                                            <div className="text-sm space-y-1">
                                                {data.portfolio.slice(0, 3).map(p => <div key={p.id} className="font-bold text-slate-700">{p.name}</div>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StartupTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white text-gray-800 p-8 font-sans">
            <div className="flex gap-8 min-h-full">
                {/* Sidebar */}
                <div className="w-1/3 space-y-8">
                    <div className="space-y-4">
                        {data.personal.photo && (
                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-6">
                                <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight">{data.personal.fullName}</h1>
                            <p className="text-lg text-gray-500 font-medium mt-1">{data.personal.role}</p>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            {data.personal.email && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Mail size={14} /> {data.personal.email}</div>}
                            {data.personal.phone && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Phone size={14} /> {data.personal.phone}</div>}
                            {data.personal.website && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><Globe size={14} /> {data.personal.website}</div>}
                            {data.personal.address && <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"><MapPin size={14} /> {data.personal.address}</div>}
                        </div>
                    </div>

                    {data.skills.length > 0 && (
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Skills & Tools</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md text-xs font-semibold border border-gray-200">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {(data.languages.length > 0 || data.certifications.length > 0) && (
                        <div className="space-y-6">
                            {data.languages.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Languages</h3>
                                    <div className="space-y-2">
                                        {data.languages.map(l => (
                                            <div key={l.id} className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">{l.language}</span>
                                                <span className="text-gray-400">{l.proficiency}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-10 pt-2">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span> About
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">{data.personal.summary}</p>
                        </section>
                    )}

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Experience
                        </h2>
                        <div className="space-y-8 border-l-2 border-gray-100 pl-6 ml-1">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-gray-200 ring-1 ring-gray-100"></span>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-gray-900">{exp.role}</h3>
                                        <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{exp.startDate} — {exp.endDate}</span>
                                    </div>
                                    <div className="text-blue-600 font-medium mb-3 text-sm">{exp.company}</div>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Selected Work
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="border border-gray-100 hover:border-gray-200 rounded-xl p-4 transition-colors bg-gray-50/50">
                                        <div className="font-bold text-gray-900 mb-1">{p.name}</div>
                                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                                        {p.link && <a href={`https://${p.link}`} className="text-xs text-blue-600 font-medium hover:underline">View Project →</a>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span> Education
                        </h2>
                        <div className="grid gap-4">
                            {data.education.map(edu => (
                                <div key={edu.id} className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.school}</h3>
                                        <p className="text-sm text-gray-500">{edu.degree}</p>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export const NewspaperTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-[#fdfbf7] text-[#1a1a1a] p-8 font-serif leading-relaxed">
            <header className="border-b-4 border-double border-black pb-4 mb-4 text-center">
                <h1 className="text-6xl font-black mb-2 uppercase tracking-tighter" style={{ fontFamily: 'Georgia, serif' }}>{data.personal.fullName}</h1>
                <div className="flex justify-center items-center gap-4 text-sm font-bold uppercase tracking-widest border-t border-black pt-2 mx-auto max-w-2xl">
                    <span>{data.personal.role}</span>
                    <span>•</span>
                    <span>{data.personal.email}</span>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-6 min-h-full">
                {/* Left Column (Narrow) */}
                <div className="col-span-3 border-r border-[#e5e5e5] pr-6 flex flex-col gap-6 text-sm text-justify">
                    {data.personal.photo && (
                        <div className="w-full aspect-[3/4] overflow-hidden grayscale contrast-125 border border-black mb-2">
                            <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="border-t border-black pt-2">
                        <h3 className="font-black uppercase tracking-wider mb-2 text-xs">Contact Details</h3>
                        <div className="space-y-1 text-xs">
                            {data.personal.phone && <div><span className="font-bold">T:</span> {data.personal.phone}</div>}
                            {data.personal.website && <div><span className="font-bold">W:</span> {data.personal.website}</div>}
                            {data.personal.address && <div><span className="font-bold">L:</span> {data.personal.address}</div>}
                        </div>
                    </div>

                    <div className="border-t border-black pt-2">
                        <h3 className="font-black uppercase tracking-wider mb-2 text-xs">Core Competencies</h3>
                        <ul className="list-disc pl-3 space-y-1">
                            {data.skills.map(s => <li key={s} className="pl-1">{s}</li>)}
                        </ul>
                    </div>
                </div>

                {/* Center Column (Wide) */}
                <div className="col-span-6 border-r border-[#e5e5e5] pr-6 flex flex-col gap-4">
                    {data.personal.summary && (
                        <div className="mb-4">
                            <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 text-justify">
                                {data.personal.summary}
                            </p>
                        </div>
                    )}

                    <div>
                        <h2 className="text-2xl font-bold uppercase border-b-2 border-black mb-4">Latest Experience</h2>
                        <div className="space-y-6">
                            {data.experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline border-b border-dotted border-gray-400 mb-2">
                                        <h3 className="font-bold text-lg">{exp.role}</h3>
                                        <span className="italic font-bold text-xs">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="font-bold text-sm mb-2 uppercase tracking-wide">{exp.company}</div>
                                    <p className="text-sm text-justify">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Narrow) */}
                <div className="col-span-3 flex flex-col gap-6">
                    <div>
                        <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Education</h2>
                        <div className="space-y-4">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <h3 className="font-bold leading-tight">{edu.school}</h3>
                                    <p className="text-sm italic">{edu.degree}</p>
                                    <span className="text-xs font-bold">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {data.portfolio.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Portfolio</h2>
                            <div className="space-y-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <h3 className="font-bold text-sm">{p.name}</h3>
                                        <p className="text-xs text-justify line-clamp-3 mb-1">{p.description}</p>
                                        {p.link && <a href={`https://${p.link}`} className="text-[10px] uppercase font-bold underline">Visit Link</a>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <footer className="border-t-2 border-black mt-auto pt-2 text-center">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Curriculum Vitae • {new Date().getFullYear()} Edition</p>
            </footer>
        </div>
    );
};

export const GeometricTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-slate-900 text-white font-sans relative">
            {/* Background Decorations - Fixed position to background layer */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

            <div className="relative z-10 flex min-h-full">
                {/* Left/Top Header Area - Sidebar */}
                <div className="w-[35%] bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 p-8 flex flex-col">
                    <div className="mb-8 text-center relative">
                        {data.personal.photo ? (
                            <div className="mx-auto w-32 h-32 mb-4 relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-blue-500 p-1" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                    <div className="w-full h-full bg-slate-900" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                        <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-emerald-500 to-blue-500 mb-6 flex items-center justify-center font-bold text-4xl" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                                {data.personal.fullName.charAt(0)}
                            </div>
                        )}
                        <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">{data.personal.fullName}</h1>
                        <p className="text-emerald-400 font-mono text-sm">{data.personal.role}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3 text-sm opacity-80">
                            {data.personal.email && <div className="flex items-center gap-3"><Mail size={14} className="text-emerald-400" /> {data.personal.email}</div>}
                            {data.personal.phone && <div className="flex items-center gap-3"><Phone size={14} className="text-emerald-400" /> {data.personal.phone}</div>}
                            {data.personal.address && <div className="flex items-center gap-3"><MapPin size={14} className="text-emerald-400" /> {data.personal.address}</div>}
                            {data.personal.website && <div className="flex items-center gap-3"><Globe size={14} className="text-emerald-400" /> {data.personal.website}</div>}
                        </div>

                        <div className="pt-6 border-t border-slate-700">
                            <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rotate-45"></span> Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(s => (
                                    <span key={s} className="text-xs bg-slate-700/50 border border-slate-600 px-2 py-1 transform hover:-translate-y-0.5 transition-transform duration-200">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-700">
                            <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rotate-45"></span> Education
                            </h3>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id} className="relative pl-4 border-l border-slate-700">
                                        <span className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 bg-blue-500"></span>
                                        <div className="text-sm font-bold">{edu.school}</div>
                                        <div className="text-xs text-slate-400">{edu.degree}</div>
                                        <div className="text-[10px] text-slate-500 font-mono mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    {data.personal.summary && (
                        <div className="mb-10 bg-slate-800/30 p-6 border-l-2 border-emerald-500">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                Profile
                            </h2>
                            <p className="text-slate-300 leading-relaxed text-sm">{data.personal.summary}</p>
                        </div>
                    )}

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                            Experience <span className="h-px bg-slate-700 flex-1"></span>
                        </h2>

                        <div className="space-y-8">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{exp.role}</h3>
                                            <div className="text-emerald-500 font-mono text-sm">{exp.company}</div>
                                        </div>
                                        <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-400 border border-slate-700">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-slate-700">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                                Projects <span className="h-px bg-slate-700 flex-1"></span>
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="bg-slate-800/50 p-4 border border-slate-700/50 hover:border-emerald-500/50 transition-colors group">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-sm text-white">{p.name}</h3>
                                            {p.link && <ExternalLink size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />}
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
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

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-serif shadow-sm p-12 min-h-[297mm] flex flex-col">
            <header className="border-b-4 pb-8 mb-8 text-center" style={{ borderColor: design.themeColor }}>
                <h1 className="text-5xl font-bold mb-4 uppercase tracking-wider">{data.personal.fullName}</h1>
                <p className="text-xl tracking-widest uppercase mb-4 opacity-75">{data.personal.role}</p>
                <div className="flex justify-center flex-wrap gap-6 text-sm font-sans opacity-80">
                    {data.personal.email && <span className="flex items-center gap-2"><Mail size={14} /> {data.personal.email}</span>}
                    {data.personal.phone && <span className="flex items-center gap-2"><Phone size={14} /> {data.personal.phone}</span>}
                    {data.personal.address && <span className="flex items-center gap-2"><MapPin size={14} /> {data.personal.address}</span>}
                    {data.personal.website && <span className="flex items-center gap-2"><Globe size={14} /> {data.personal.website}</span>}
                </div>
            </header>

            <div className="flex gap-12 flex-1">
                <div className="flex-1 space-y-8">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <User size={18} /> Executive Summary
                            </h2>
                            <p className="leading-relaxed opacity-80 text-justify">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <Briefcase size={18} /> Professional Experience
                            </h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-lg">{exp.role}</h3>
                                            <span className="text-sm font-sans font-medium opacity-60 bg-gray-100 px-3 py-1 rounded-full">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="font-semibold mb-2 opacity-75" style={{ color: design.themeColor }}>{exp.company}</p>
                                        <p className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <Layout size={18} /> Key Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="bg-gray-50 p-4 border-l-4" style={{ borderColor: design.themeColor }}>
                                        <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                                        <p className="text-xs opacity-70 mb-2 line-clamp-2">{p.description}</p>
                                        {p.link && <a href={`https://${p.link}`} className="text-xs font-bold underline decoration-2 underline-offset-2" style={{ color: design.themeColor }}>View Case Study</a>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="w-64 shrink-0 space-y-8">
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <GraduationCap size={18} /> Education
                            </h2>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <h3 className="font-bold leading-tight mb-1">{edu.school}</h3>
                                        <p className="text-sm opacity-80 mb-1">{edu.degree}</p>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded inline-block">{edu.year}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                            <Code size={18} /> Expertise
                        </h2>
                        <div className="space-y-3">
                            {data.skills.map(skill => (
                                <div key={skill}>
                                    <span className="block text-sm font-medium mb-1">{skill}</span>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${Math.random() * 40 + 60}%`, backgroundColor: design.themeColor }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {data.languages.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b pb-2 flex items-center gap-2" style={{ color: design.themeColor, borderColor: 'rgba(0,0,0,0.1)' }}>
                                <Globe size={18} /> Languages
                            </h2>
                            <ul className="space-y-2">
                                {data.languages.map(l => (
                                    <li key={l.id} className="flex justify-between text-sm">
                                        <span className="font-medium">{l.language}</span>
                                        <span className="opacity-60">{l.proficiency}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ManhattanTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-slate-50 font-sans shadow-sm min-h-[297mm] flex flex-row">
            <div className="w-[30%] bg-white border-r border-gray-200 pt-16 pb-8 px-6 flex flex-col gap-8 text-right min-h-full">
                <div className="mb-8">
                    {data.personal.photo ? (
                        <div className="w-32 h-32 ml-auto rounded-xl overflow-hidden shadow-lg rotate-3 mb-6 border-4 border-white ring-1 ring-gray-100">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 ml-auto bg-gray-900 rounded-xl flex items-center justify-center text-3xl font-bold text-white mb-6 rotate-3 shadow-lg">
                            {data.personal.fullName.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50">Contact</h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        {data.personal.email && <div className="break-all font-medium hover:text-black transition-colors">{data.personal.email}</div>}
                        {data.personal.phone && <div>{data.personal.phone}</div>}
                        {data.personal.address && <div>{data.personal.address}</div>}
                        {data.personal.website && <div className="text-blue-600 underline decoration-blue-200 underline-offset-2">{data.personal.website}</div>}
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50 relative inline-block">Education <span className="absolute -bottom-1 right-0 w-8 h-1 bg-black"></span></h2>
                    {data.education.map(edu => (
                        <div key={edu.id}>
                            <h3 className="font-bold text-gray-900">{edu.school}</h3>
                            <p className="text-xs uppercase tracking-wide mt-1 mb-1" style={{ color: design.themeColor }}>{edu.degree}</p>
                            <p className="text-xs text-gray-400">{edu.year}</p>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50 relative inline-block">Expertise <span className="absolute -bottom-1 right-0 w-8 h-1 bg-black"></span></h2>
                    <div className="flex flex-wrap justify-end gap-2">
                        {data.skills.map(skill => (
                            <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-xs font-semibold hover:bg-black hover:text-white transition-colors cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-16 pt-24 bg-slate-50 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
                <div className="absolute top-0 left-12 w-2 h-32 bg-black"></div>

                <header className="mb-20 pl-8">
                    <h1 className="text-6xl font-black tracking-tighter uppercase mb-4 leading-none" style={{ color: design.themeColor }}>{data.personal.fullName}</h1>
                    <p className="text-xl font-medium tracking-widest text-gray-500 uppercase">{data.personal.role}</p>
                </header>

                <div className="space-y-16 pl-8 border-l border-gray-200">
                    <section className="relative">
                        <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-white border-4 border-black box-content"></span>
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">About</h2>
                        <p className="text-lg leading-relaxed font-light text-gray-600 max-w-2xl">{data.personal.summary}</p>
                    </section>

                    <section className="relative">
                        <span className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-white border-4 border-black box-content"></span>
                        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Experience</h2>
                        <div className="space-y-12">
                            {data.experience.map(exp => (
                                <div key={exp.id} className="relative group">
                                    <div className="absolute -left-12 -top-1 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                                        <Briefcase size={12} />
                                    </div>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-xl font-bold">{exp.role}</h3>
                                        <span className="font-mono text-sm text-gray-400">{exp.startDate} / {exp.endDate}</span>
                                    </div>
                                    <h4 className="font-bold text-sm uppercase tracking-wide mb-4" style={{ color: design.themeColor }}>{exp.company}</h4>
                                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export const DeveloperTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div className="w-full min-h-full bg-[#1e1e1e] text-gray-300 font-mono shadow-sm p-8 min-h-[297mm] flex flex-col border-t-8 border-b-8" style={{ ...getStyles(design), borderColor: design.themeColor }}>
            <div className="flex justify-between items-start mb-12 border-b border-gray-700 pb-8">
                <div>
                    <h1 className="text-4xl text-white font-bold mb-2">
                        <span className="text-green-400">&gt;</span> {data.personal.fullName}
                    </h1>
                    <p className="text-xl opacity-80 pl-6 mb-4 text-green-400">
                        // {data.personal.role}
                    </p>
                    <div className="pl-6 text-sm opacity-60 flex flex-col gap-1">
                        {data.personal.email && <span>const email = "{data.personal.email}";</span>}
                        {data.personal.phone && <span>const phone = "{data.personal.phone}";</span>}
                        {data.personal.address && <span>const loc = "{data.personal.address}";</span>}
                    </div>
                </div>
                {data.personal.photo && (
                    <div className="w-32 h-32 border-2 border-green-500/50 rounded overflow-hidden opacity-90 grayscale hover:grayscale-0 transition-all">
                        <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                    </div>
                )}
            </div>

            <div className="flex gap-8 flex-1">
                <div className="w-[60%] space-y-10">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <span className="text-pink-500">function</span> about() &#123;
                            </h2>
                            <div className="pl-6 border-l border-gray-700">
                                <p className="text-sm leading-relaxed opacity-80">"{data.personal.summary}"</p>
                            </div>
                            <div className="mt-2 text-white">&#125;</div>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <span className="text-pink-500">class</span> Experience &#123;
                            </h2>
                            <div className="pl-6 border-l border-gray-700 space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative">
                                        <div className="absolute -left-[30px] top-1 w-3 h-3 rounded-full bg-gray-700 border border-gray-500"></div>
                                        <h3 className="text-green-400 font-bold mb-1">{exp.role}</h3>
                                        <div className="flex justify-between text-xs mb-2 opacity-60">
                                            <span>at {exp.company}</span>
                                            <span>[{exp.startDate}, {exp.endDate}]</span>
                                        </div>
                                        <p className="text-sm opacity-80">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-white">&#125;</div>
                        </section>
                    )}
                </div>

                <div className="flex-1 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-white mb-4">
                            <span className="text-blue-400">const</span> stack = [
                        </h2>
                        <div className="pl-4">
                            {data.skills.map((skill, i) => (
                                <div key={skill} className="text-sm">
                                    <span className="text-yellow-300">"{skill}"</span>{i < data.skills.length - 1 ? ',' : ''}
                                </div>
                            ))}
                        </div>
                        <div className="text-white">];</div>
                    </section>

                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold text-white mb-4">
                                <span className="text-blue-400">interface</span> Education &#123;
                            </h2>
                            <div className="pl-4 space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id} className="bg-gray-800/50 p-3 rounded border border-gray-700">
                                        <div className="text-sm font-bold text-gray-200">{edu.school}</div>
                                        <div className="text-xs text-green-400">{edu.degree}</div>
                                        <div className="text-xs opacity-50">// {edu.year}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-2 text-white">&#125;</div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export const HeroTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm min-h-[297mm] flex flex-col">
            <header className="bg-black text-white p-16 pb-24 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: design.themeColor }}></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-4 border-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <h1 className="text-7xl font-black uppercase tracking-tighter mb-4">{data.personal.fullName}</h1>
                <div className="inline-block px-4 py-1 border-2 border-white/30 rounded-full text-lg tracking-widest font-medium uppercase mb-8">
                    {data.personal.role}
                </div>

                <div className="flex justify-center flex-wrap gap-8 text-sm font-medium text-gray-400">
                    {data.personal.email && <span>{data.personal.email}</span>}
                    {data.personal.phone && <span>{data.personal.phone}</span>}
                    {data.personal.address && <span>{data.personal.address}</span>}
                </div>
            </header>

            <div className="max-w-4xl mx-auto -mt-16 w-full px-8 flex-1 flex flex-col gap-12 mb-16">
                {data.personal.summary && (
                    <div className="bg-white p-8 shadow-lg border-t-8 rounded-lg text-center" style={{ borderColor: design.themeColor }}>
                        <p className="text-xl leading-relaxed text-gray-700">{data.personal.summary}</p>
                    </div>
                )}

                <div className="grid grid-cols-[2fr_1fr] gap-12">
                    <div className="space-y-12">
                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-4">
                                    Work <span className="h-2 flex-1 bg-gray-100 rounded-full"></span>
                                </h2>
                                <div className="space-y-12 border-l-2 border-gray-100 pl-8 ml-3">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="relative">
                                            <span className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-white border-4 border-gray-900"></span>
                                            <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="font-bold text-sm uppercase opacity-60" style={{ color: design.themeColor }}>{exp.company}</span>
                                                <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 bg-gray-100 font-bold text-sm border-b-2 border-gray-300 hover:bg-black hover:text-white hover:border-black transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2 inline-block">Education</h2>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <h3 className="font-bold text-lg leading-tight">{edu.school}</h3>
                                            <p className="text-sm font-medium mt-1 mb-1 opacity-60">{edu.degree}</p>
                                            <p className="text-xs font-bold mt-1" style={{ color: design.themeColor }}>{edu.year}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const NewsletterTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-orange-50/30 font-serif shadow-sm p-12 min-h-[297mm] flex flex-col">
            <header className="border-b-4 border-black pb-4 mb-2 flex justify-between items-end">
                <div>
                    <h1 className="text-6xl font-black uppercase leading-none tracking-tighter" style={{ fontFamily: 'Times New Roman' }}>The Resume</h1>
                    <p className="text-sm uppercase tracking-widest mt-2 font-sans font-bold">Vol. 1 &nbsp;•&nbsp; {new Date().getFullYear()} Edition &nbsp;•&nbsp; {data.personal.role}</p>
                </div>
                <div className="text-right font-sans text-xs font-bold uppercase tracking-wide opacity-60">
                    <div>{data.personal.address}</div>
                    <div>{data.personal.email}</div>
                    <div>{data.personal.website}</div>
                </div>
            </header>
            <div className="border-t border-black mb-8"></div> {/* Double border effect */}

            <div className="grid grid-cols-12 gap-8 flex-1">
                {/* Left Column (Main Article) */}
                <div className="col-span-8 flex flex-col gap-8 pr-8 border-r border-gray-300">
                    <section>
                        <h2 className="text-4xl font-bold mb-4 font-sans uppercase italic">Cover Story: {data.personal.fullName}</h2>
                        {data.personal.photo && (
                            <div className="float-left w-48 h-48 mr-6 mb-2 border border-black p-1 bg-white">
                                <img src={data.personal.photo} className="w-full h-full object-cover grayscale contrast-125" alt="Profile" />
                            </div>
                        )}
                        <p className="text-lg leading-relaxed first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px] text-justify">
                            {data.personal.summary || "Experienced professional seeking new opportunities to leverage skills and drive company growth."}
                        </p>
                    </section>

                    {data.experience.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold uppercase border-b-2 border-black mb-6 pb-1 font-sans">Career Highlights</h3>
                            <div className="columns-1 gap-8 space-y-8">
                                {data.experience.map(exp => (
                                    <article key={exp.id} className="break-inside-avoid">
                                        <h4 className="font-bold text-xl leading-tight mb-1">{exp.role}</h4>
                                        <div className="flex items-center gap-2 text-sm font-sans font-bold mb-2 opacity-70">
                                            <span style={{ color: design.themeColor }}>{exp.company}</span>
                                            <span className="w-1 h-1 rounded-full bg-black"></span>
                                            <span>{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-sm leading-relaxed text-justify opacity-90">{exp.description}</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column (Sidebar/Ads) */}
                <div className="col-span-4 flex flex-col gap-8">
                    <div className="bg-black text-white p-6 text-center rotate-1">
                        <h3 className="text-xl font-bold uppercase mb-4 border-b border-white/30 pb-2">Skills Spotlight</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="text-sm font-mono underline decoration-dotted decoration-white/50">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {data.education.length > 0 && (
                        <section>
                            <h3 className="text-lg font-bold uppercase border-b-2 border-black mb-4 pb-1 font-sans">Education</h3>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <h4 className="font-bold leading-tight">{edu.school}</h4>
                                        <p className="text-sm italic opacity-80">{edu.degree}</p>
                                        <p className="text-xs font-bold mt-1" style={{ color: design.themeColor }}>{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section className="bg-gray-100 p-4 border border-gray-300">
                            <h3 className="text-sm font-bold uppercase mb-3 text-center opacity-50 tracking-widest">Featured Projects</h3>
                            <div className="space-y-3">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <div className="font-bold text-sm truncate">{p.name}</div>
                                        <div className="text-xs line-clamp-2 opacity-70">{p.description}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <footer className="border-t-4 border-black mt-auto pt-4 flex justify-between text-xs font-bold uppercase tracking-widest font-sans opacity-60">
                <span>Page 1 of 1</span>
                <span>Designed by {data.personal.fullName}</span>
                <span>Printed {new Date().toLocaleDateString()}</span>
            </footer>
        </div>
    );
};

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm min-h-[297mm] flex flex-row">
            <div className="w-[32%] text-white p-8 pt-12 flex flex-col gap-8 min-h-full" style={{ backgroundColor: '#1e293b' }}>
                <div className="text-center mb-4">
                    {data.personal.photo ? (
                        <div className="w-40 h-40 mx-auto rounded-full border-4 border-white/20 mb-6 overflow-hidden">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 mx-auto bg-white/10 rounded-full flex items-center justify-center text-4xl font-bold mb-6">
                            {data.personal.fullName.slice(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="space-y-4 text-sm opacity-90">
                    <h3 className="uppercase tracking-widest text-xs font-bold text-white/50 border-b border-white/10 pb-2 mb-4">Contact</h3>
                    {data.personal.email && <div className="flex items-center gap-3"><Mail size={16} /> <span className="break-all">{data.personal.email}</span></div>}
                    {data.personal.phone && <div className="flex items-center gap-3"><Phone size={16} /> <span>{data.personal.phone}</span></div>}
                    {data.personal.address && <div className="flex items-center gap-3"><MapPin size={16} /> <span>{data.personal.address}</span></div>}
                    {data.personal.website && <div className="flex items-center gap-3"><Globe size={16} /> <span className="break-all">{data.personal.website}</span></div>}
                </div>

                {data.education.length > 0 && (
                    <div>
                        <h3 className="uppercase tracking-widest text-xs font-bold text-white/50 border-b border-white/10 pb-2 mb-4">Education</h3>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="font-bold">{edu.school}</div>
                                    <div className="text-sm opacity-80 mb-1">{edu.degree}</div>
                                    <div className="text-xs bg-white/10 inline-block px-2 py-0.5 rounded">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="uppercase tracking-widest text-xs font-bold text-white/50 border-b border-white/10 pb-2 mb-4">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(skill => (
                            <span key={skill} className="bg-white/10 px-3 py-1 rounded text-sm">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-12">
                <header className="mb-12 border-b-2 border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold uppercase text-gray-800 mb-2" style={{ color: design.themeColor }}>{data.personal.fullName}</h1>
                    <p className="text-xl tracking-widest text-gray-500 uppercase">{data.personal.role}</p>
                </header>

                <div className="space-y-10">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-3 text-gray-800">
                                <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500"><User size={16} /></span>
                                Profile
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-justify">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-3 text-gray-800">
                                <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500"><Briefcase size={16} /></span>
                                Experience
                            </h2>
                            <div className="space-y-8 border-l-2 border-gray-100 ml-4 pl-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative">
                                        <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-gray-300"></div>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="font-bold text-lg">{exp.role}</h3>
                                            <span className="text-sm font-bold opacity-50 bg-gray-100 px-2 py-1 rounded">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-sm font-bold uppercase mb-3 opacity-70" style={{ color: design.themeColor }}>{exp.company}</h4>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-lg font-bold uppercase mb-6 flex items-center gap-3 text-gray-800">
                                <span className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500"><Layout size={16} /></span>
                                Projects
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="bg-gray-50 p-4 rounded border border-gray-100 hover:border-blue-200 transition-colors">
                                        <h3 className="font-bold text-gray-800 mb-1">{p.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
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

export const InfluenceTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-slate-50 font-sans shadow-sm min-h-[297mm] flex flex-col items-center pt-16 p-8">
            <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl overflow-hidden mb-8">
                <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                    {data.personal.photo && (
                        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-white">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    )}
                </div>
                <div className="pt-20 pb-8 px-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{data.personal.fullName}</h1>
                    <p className="text-lg text-purple-600 font-medium mb-6">@{data.personal.role.replace(/\s+/g, '').toLowerCase()}</p>

                    <div className="flex justify-center gap-4 text-sm text-gray-500 mb-8 flex-wrap">
                        {data.personal.email && <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"><Mail size={14} /> {data.personal.email}</span>}
                        {data.personal.website && <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"><Globe size={14} /> {data.personal.website}</span>}
                        {data.personal.address && <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full"><MapPin size={14} /> {data.personal.address}</span>}
                    </div>

                    <div className="flex justify-center gap-2 max-w-xl mx-auto flex-wrap">
                        {data.skills.map(skill => (
                            <span key={skill} className="px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200 hover:border-purple-500 hover:text-purple-600 transition-colors cursor-default">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full max-w-3xl grid grid-cols-1 gap-6">
                {data.personal.summary && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">About <span className="text-purple-500">.</span></h2>
                        <p className="text-gray-600 leading-relaxed">{data.personal.summary}</p>
                    </div>
                )}

                {data.experience.length > 0 && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Career Path <span className="text-purple-500">.</span></h2>
                        <div className="space-y-8">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="relative pl-8 border-l-2 border-purple-100">
                                    <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-500 ring-4 ring-white"></span>
                                    <h3 className="font-bold text-lg">{exp.role}</h3>
                                    <p className="text-purple-600 font-medium text-sm mb-2">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                    {data.education.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Education <span className="text-purple-500">.</span></h2>
                            <div className="space-y-4">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold">{edu.school}</div>
                                        <div className="text-sm text-gray-500">{edu.degree}</div>
                                        <div className="text-xs text-purple-500 mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.portfolio.length > 0 && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Highlights <span className="text-purple-500">.</span></h2>
                            <div className="space-y-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <div className="font-bold text-sm underline decoration-purple-200 decoration-2 underline-offset-2">{p.name}</div>
                                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</div>
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

export const AbstractTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm min-h-[297mm] relative overflow-hidden p-12 flex flex-col">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: `${design.themeColor}20` }}></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

            <header className="relative z-10 mb-16">
                <h1 className="text-8xl font-black tracking-tighter opacity-10 absolute -top-8 -left-8 select-none" style={{ color: design.themeColor }}>CV</h1>
                <div className="flex justify-between items-end border-b-4 border-black pb-6">
                    <div>
                        <h1 className="text-5xl font-bold mb-2">{data.personal.fullName}</h1>
                        <p className="text-xl font-medium opacity-60 uppercase tracking-widest">{data.personal.role}</p>
                    </div>
                    <div className="text-right text-sm font-medium opacity-70">
                        <div>{data.personal.email}</div>
                        <div>{data.personal.phone}</div>
                        <div>{data.personal.address}</div>
                    </div>
                </div>
            </header>

            <div className="relative z-10 grid grid-cols-3 gap-12 flex-1">
                <div className="col-span-2 space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <span className="w-12 h-2 bg-black"></span> Summary
                            </h2>
                            <p className="text-lg leading-relaxed font-light">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <span className="w-12 h-2 bg-black"></span> Experience
                            </h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{exp.role}</h3>
                                            <span className="font-mono text-sm bg-black text-white px-2 py-1">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-lg font-medium opacity-60 mb-4">{exp.company}</h4>
                                        <p className="opacity-80 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12 pt-8">
                    <section>
                        <h2 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">Expertise</h2>
                        <ul className="space-y-3">
                            {data.skills.map(skill => (
                                <li key={skill} className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-black rotate-45"></span>
                                    <span className="font-medium">{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">Education</h2>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-lg">{edu.school}</div>
                                        <div className="opacity-60">{edu.degree}</div>
                                        <div className="font-mono text-sm mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-6 border-b-2 border-black pb-2">Projects</h2>
                            <div className="space-y-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="border-l-2 border-gray-200 pl-4 hover:border-black transition-colors">
                                        <div className="font-bold">{p.name}</div>
                                        <div className="text-xs opacity-60 line-clamp-2">{p.description}</div>
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

export const MosaicTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-gray-50 font-sans shadow-sm min-h-[297mm] p-4">
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
                    <h2 className="font-bold uppercase text-xs text-gray-400 mb-4 tracking-wider">About Me</h2>
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

export const NoirTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white text-black font-sans shadow-sm min-h-[297mm] flex flex-col items-center p-16 border-[16px] border-black">
            <header className="text-center mb-16 max-w-2xl">
                <h1 className="text-7xl font-black uppercase tracking-tighter mb-4 leading-[0.8]">
                    {data.personal.fullName.split(' ').map((n, i) => (
                        <span key={i} className={i % 2 === 1 ? "outline-text text-transparent stroke-black stroke-2" : "block"}>{n}</span>
                    ))}
                </h1>
                <div className="inline-block bg-black text-white px-6 py-2 text-xl font-bold uppercase tracking-widest mt-4 transform -rotate-2">
                    {data.personal.role}
                </div>
            </header>

            <div className="grid grid-cols-[1fr_2fr] gap-12 w-full flex-1">
                <div className="space-y-12">
                    <section>
                        <h2 className="text-lg font-black uppercase mb-4 border-b-4 border-black pb-1">Contact</h2>
                        <ul className="space-y-2 text-sm font-bold">
                            {data.personal.email && <li className="hover:line-through cursor-crosshair">{data.personal.email}</li>}
                            {data.personal.phone && <li className="hover:line-through cursor-crosshair">{data.personal.phone}</li>}
                            {data.personal.address && <li className="hover:line-through cursor-crosshair">{data.personal.address}</li>}
                            {data.personal.website && <li className="hover:line-through cursor-crosshair text-blue-600 underline decoration-2 decoration-wavy">{data.personal.website}</li>}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-black uppercase mb-4 border-b-4 border-black pb-1">Skills</h2>
                        <div className="flex flex-col gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="font-mono text-sm bg-gray-100 px-2 py-1 border-l-4 border-black">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-lg font-black uppercase mb-4 border-b-4 border-black pb-1">Education</h2>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-black text-lg leading-tight">{edu.school.toUpperCase()}</div>
                                        <div className="text-sm font-bold opacity-60 italic">{edu.degree}</div>
                                        <div className="text-xs font-mono mt-1">[{edu.year}]</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="space-y-12 border-l-4 border-black pl-12 -ml-6">
                    {data.personal.summary && (
                        <section>
                            <p className="text-xl font-bold leading-relaxed indent-12 text-justify">
                                {data.personal.summary}
                            </p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-4xl font-black uppercase mb-8">Experience</h2>
                            <div className="space-y-10">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="relative">
                                        <div className="absolute -left-[59px] top-2 w-6 h-6 bg-black rounded-full border-4 border-white"></div>
                                        <h3 className="text-2xl font-black uppercase mb-1">{exp.role}</h3>
                                        <div className="flex justify-between items-center border-b-2 border-black border-dashed pb-2 mb-3">
                                            <span className="font-bold text-lg">{exp.company}</span>
                                            <span className="font-mono text-sm bg-black text-white px-2">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="font-medium text-gray-800">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Signature */}

                    <div className="font-script text-4xl transform -rotate-6">{data.personal.fullName}</div>
                </div>
            </div>

            <style>{`
                    .outline-text {
                        -webkit-text-stroke: 2px black;
                    }
                `}</style>
        </div>
    );
};

export const RightTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm min-h-[297mm] flex flex-row">
            <div className="flex-1 p-10 pr-12">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold uppercase tracking-tight text-gray-900 mb-2">{data.personal.fullName}</h1>
                    <p className="text-xl text-gray-500 uppercase tracking-widest font-medium" style={{ color: design.themeColor }}>{data.personal.role}</p>
                </header>

                <div className="space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-100 pb-2">Profile</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">Experience</h2>
                            <div className="space-y-8">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-xl">{exp.role}</h3>
                                            <span className="text-sm font-mono text-gray-400">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-sm font-bold uppercase mb-3 opacity-70" style={{ color: design.themeColor }}>{exp.company}</h4>
                                        <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-100 pb-2">Projects</h2>
                            <div className="space-y-4">
                                {data.portfolio.map(p => (
                                    <div key={p.id}>
                                        <div className="font-bold text-lg mb-1">{p.name}</div>
                                        <p className="text-gray-600">{p.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <div className="w-[30%] bg-gray-50 p-8 pt-12 border-l border-gray-100 flex flex-col gap-10">
                <div className="text-center">
                    {data.personal.photo && (
                        <div className="w-32 h-32 mx-auto rounded-full mb-6 overflow-hidden border-4 border-white shadow-sm">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    )}

                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                        {data.personal.email && <div className="break-all font-medium text-gray-900">{data.personal.email}</div>}
                        {data.personal.phone && <div>{data.personal.phone}</div>}
                        {data.personal.address && <div className="text-center">{data.personal.address}</div>}
                        {data.personal.website && <div className="break-all text-blue-500 underline">{data.personal.website}</div>}
                    </div>
                </div>

                {data.education.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Education</h3>
                        <div className="space-y-6">
                            {data.education.map(edu => (
                                <div key={edu.id}>
                                    <div className="font-bold text-gray-900">{edu.school}</div>
                                    <div className="text-sm text-gray-500 mb-1">{edu.degree}</div>
                                    <div className="text-xs font-bold bg-white inline-block px-2 py-0.5 rounded border border-gray-200 text-gray-400">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 border-b border-gray-200 pb-2">Expertise</h3>
                    <div className="flex flex-col gap-2">
                        {data.skills.map(skill => (
                            <div key={skill} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" style={{ backgroundColor: design.themeColor }}></div>
                                <span className="text-sm font-medium text-gray-700">{skill}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const FluxTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm min-h-[297mm] p-8 relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-blue-100 to-transparent opacity-50 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${design.themeColor}15, transparent)` }}></div>

            <header className="relative z-10 flex flex-col items-center text-center mb-16 pt-8">
                {data.personal.photo && (
                    <div className="w-28 h-28 rounded-2xl bg-white shadow-lg p-1 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src={data.personal.photo} className="w-full h-full object-cover rounded-xl" alt="Profile" />
                    </div>
                )}
                <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-2">{data.personal.fullName}</h1>
                <p className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" style={{ backgroundImage: `linear-gradient(to right, ${design.themeColor}, ${design.themeColor}dd)` }}>
                    {data.personal.role}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500 bg-white/50 backdrop-blur-sm p-2 rounded-full border border-gray-100">
                    {data.personal.email && <span className="px-3 py-1 bg-white rounded-full shadow-sm text-gray-700">{data.personal.email}</span>}
                    {data.personal.phone && <span className="px-3 py-1 bg-white rounded-full shadow-sm text-gray-700">{data.personal.phone}</span>}
                    {data.personal.website && <span className="px-3 py-1 bg-white rounded-full shadow-sm text-gray-700">{data.personal.website}</span>}
                </div>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 gap-12 relative z-10">
                {data.personal.summary && (
                    <div className="bg-white/60 backdrop-blur-md p-8 rounded-3xl border border-white shadow-sm">
                        <p className="text-center text-lg leading-relaxed text-gray-700">{data.personal.summary}</p>
                    </div>
                )}

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        {data.experience.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                        <Briefcase size={20} />
                                    </div>
                                    Experience
                                </h2>
                                <div className="space-y-8">
                                    {data.experience.map((exp, i) => (
                                        <div key={exp.id} className={`pb-8 ${i !== data.experience.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-xl text-gray-900">{exp.role}</h3>
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <div className="text-base font-medium text-gray-500 mb-3">{exp.company}</div>
                                            <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {data.portfolio.length > 0 && (
                            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                        <Layout size={20} />
                                    </div>
                                    Projects
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {data.portfolio.map(p => (
                                        <div key={p.id} className="bg-gray-50 p-4 rounded-2xl hover:bg-gray-100 transition-colors">
                                            <div className="font-bold text-gray-900 mb-1">{p.name}</div>
                                            <div className="text-sm text-gray-500">{p.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50 h-full">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                    <Zap size={16} />
                                </div>
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="px-3 py-1.5 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 border border-gray-100">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {data.education.length > 0 && (
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-50">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600" style={{ color: design.themeColor, backgroundColor: `${design.themeColor}15` }}>
                                        <GraduationCap size={16} />
                                    </div>
                                    Education
                                </h2>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id}>
                                            <div className="font-bold text-gray-900">{edu.school}</div>
                                            <div className="text-sm text-gray-500">{edu.degree}</div>
                                            <div className="text-xs font-bold text-gray-300 mt-1">{edu.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ImpactTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-white font-sans shadow-sm min-h-[297mm] p-16 flex flex-col">
            <header className="border-b-[12px] border-black pb-8 mb-16">
                <h1 className="text-8xl font-black uppercase tracking-tighter leading-none mb-4" style={{ color: design.themeColor }}>
                    {data.personal.fullName}
                </h1>
                <p className="text-3xl font-bold text-black uppercase tracking-tight">{data.personal.role}</p>

                <div className="grid grid-cols-3 gap-8 mt-12 text-sm font-bold uppercase tracking-widest border-t-2 border-black pt-4">
                    {data.personal.email && <div>{data.personal.email}</div>}
                    {data.personal.phone && <div>{data.personal.phone}</div>}
                    {data.personal.address && <div>{data.personal.address}</div>}
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-16">
                <div className="col-span-4 space-y-16 border-r-2 border-gray-200 pr-8">
                    {data.education.length > 0 && (
                        <section>
                            <h2 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">Education</h2>
                            <div className="space-y-8">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-black text-xl mb-1">{edu.school}</div>
                                        <div className="font-bold text-gray-500">{edu.degree}</div>
                                        <div className="font-black text-3xl mt-2 text-gray-200">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section>
                        <h2 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-2 inline-block">Skills</h2>
                        <ul className="space-y-2">
                            {data.skills.map(skill => (
                                <li key={skill} className="font-bold text-lg border-b border-black pb-1">
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="col-span-8 space-y-16">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-black uppercase mb-4 opacity-30">About</h2>
                            <p className="text-2xl font-bold leading-tight indent-8 text-gray-800">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-5xl font-black uppercase mb-12 flex items-center gap-4">
                                Experience <span className="flex-1 h-3 bg-black"></span>
                            </h2>
                            <div className="space-y-12">
                                {data.experience.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-end mb-2 border-b-2 border-black pb-2">
                                            <h3 className="text-3xl font-black uppercase">{exp.role}</h3>
                                            <span className="font-bold text-lg bg-black text-white px-3 mb-1">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <h4 className="text-xl font-bold uppercase mb-4 text-gray-500">{exp.company}</h4>
                                        <p className="text-lg font-medium text-gray-800 leading-relaxed">{exp.description}</p>
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

export const GlitchTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-neutral-900 text-green-400 font-mono shadow-sm min-h-[297mm] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-pink-500"></div>
            <div className="border-4 border-green-500/50 h-full p-8 relative">
                <div className="absolute top-4 right-4 w-4 h-4 bg-pink-500 animate-pulse"></div>

                <header className="mb-16 border-b border-green-500/30 pb-8">
                    <h1 className="text-6xl font-bold mb-2 uppercase tracking-tighter mix-blend-screen" style={{ textShadow: '2px 2px 0px #ec4899' }}>
                        {data.personal.fullName}
                    </h1>
                    <p className="text-xl text-pink-500 uppercase tracking-widest">{data.personal.role}</p>
                </header>

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-4 border-r border-green-500/30 pr-8 space-y-12">
                        <section>
                            <h2 className="text-sm font-bold bg-green-500/10 text-green-300 inline-block px-2 py-1 mb-4 uppercase tracking-widest">[Contact_Info]</h2>
                            <ul className="space-y-4 text-sm opacity-80">
                                {data.personal.email && <li className="break-all">&gt; {data.personal.email}</li>}
                                {data.personal.phone && <li>&gt; {data.personal.phone}</li>}
                                {data.personal.address && <li>&gt; {data.personal.address}</li>}
                                {data.personal.website && <li className="break-all">&gt; {data.personal.website}</li>}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-sm font-bold bg-green-500/10 text-green-300 inline-block px-2 py-1 mb-4 uppercase tracking-widest">[Skills_Set]</h2>
                            <div className="flex flex-wrap gap-2">
                                {data.skills.map(skill => (
                                    <span key={skill} className="border border-green-500/50 px-2 py-1 text-xs hover:bg-green-500 hover:text-black transition-colors cursor-pointer">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {data.education.length > 0 && (
                            <section>
                                <h2 className="text-sm font-bold bg-green-500/10 text-green-300 inline-block px-2 py-1 mb-4 uppercase tracking-widest">[Education_Log]</h2>
                                <div className="space-y-6">
                                    {data.education.map(edu => (
                                        <div key={edu.id} className="opacity-90">
                                            <div className="font-bold text-pink-500">{edu.school}</div>
                                            <div className="text-xs">{edu.degree}</div>
                                            <div className="text-xs mt-1 border border-pink-500/30 inline-block px-1 text-pink-300">{edu.year}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="col-span-8 space-y-12">
                        {data.personal.summary && (
                            <section>
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-pink-500"></span>
                                    SYSTEM_PROFILE
                                </h2>
                                <p className="text-green-200 leading-relaxed font-light border-l border-green-500/20 pl-4">
                                    {data.personal.summary}
                                </p>
                            </section>
                        )}

                        {data.experience.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-pink-500"></span>
                                    WORK_HISTORY
                                </h2>
                                <div className="space-y-10">
                                    {data.experience.map(exp => (
                                        <div key={exp.id} className="relative group">
                                            <div className="absolute -left-2 top-0 w-1 h-full bg-pink-500/0 group-hover:bg-pink-500 transition-colors"></div>
                                            <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                                            <div className="flex justify-between text-sm mb-4 border-b border-green-500/30 pb-2">
                                                <span className="text-pink-400">{exp.company}</span>
                                                <span className="opacity-60">{exp.startDate} - {exp.endDate}</span>
                                            </div>
                                            <p className="text-sm text-green-100 opacity-80 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LeafTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-stone-50 font-sans shadow-sm min-h-[297mm] p-6 flex gap-6">
            <div className="w-[35%] bg-teal-800 text-white rounded-[3rem_0_3rem_0] p-10 flex flex-col min-h-full" style={{ backgroundColor: '#115e59' }}>
                <div className="text-center mb-12">
                    {data.personal.photo ? (
                        <div className="w-40 h-40 mx-auto rounded-[2rem] overflow-hidden border-4 border-teal-600 shadow-xl mb-6 rotate-3">
                            <img src={data.personal.photo} className="w-full h-full object-cover" alt="Profile" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 mx-auto bg-white/10 rounded-[2rem] flex items-center justify-center mb-6">
                            <User size={40} className="text-teal-200" />
                        </div>
                    )}
                    <div className="space-y-1 text-teal-100 text-sm">
                        {data.personal.email && <div className="flex items-center justify-center gap-2"><Mail size={14} /> <span className="truncate max-w-[180px]">{data.personal.email}</span></div>}
                        {data.personal.phone && <div className="flex items-center justify-center gap-2"><Phone size={14} /> {data.personal.phone}</div>}
                        {data.personal.address && <div className="flex items-center justify-center gap-2"><MapPin size={14} /> {data.personal.address}</div>}
                    </div>
                </div>

                <div className="space-y-10 flex-1">
                    <section>
                        <h3 className="text-teal-200 uppercase tracking-widest text-xs font-bold mb-6 border-b border-teal-700 pb-2">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map(skill => (
                                <span key={skill} className="bg-teal-700/50 px-3 py-1.5 rounded-xl text-sm border border-teal-600/50">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {data.education.length > 0 && (
                        <section>
                            <h3 className="text-teal-200 uppercase tracking-widest text-xs font-bold mb-6 border-b border-teal-700 pb-2">Education</h3>
                            <div className="space-y-6">
                                {data.education.map(edu => (
                                    <div key={edu.id}>
                                        <div className="font-bold text-white text-lg">{edu.school}</div>
                                        <div className="text-teal-300 text-sm">{edu.degree}</div>
                                        <div className="text-xs text-teal-400 mt-1">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <div className="flex-1 py-8 pr-6">
                <header className="mb-12 border-b-2 border-stone-200 pb-8">
                    <h1 className="text-5xl font-bold text-teal-900 mb-2" style={{ color: design.themeColor }}>{data.personal.fullName}</h1>
                    <p className="text-xl text-stone-500 font-medium tracking-wide">{data.personal.role}</p>
                </header>

                <div className="space-y-12">
                    {data.personal.summary && (
                        <section>
                            <h2 className="text-2xl font-bold text-teal-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700"><User size={16} /></span>
                                Profile
                            </h2>
                            <p className="text-stone-600 leading-relaxed text-lg">{data.personal.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-teal-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700"><Briefcase size={16} /></span>
                                Experience
                            </h2>
                            <div className="space-y-10 pl-4 border-l-2 border-stone-200">
                                {data.experience.map((exp) => (
                                    <div key={exp.id} className="relative pl-8">
                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-teal-500"></div>
                                        <h3 className="text-xl font-bold text-stone-800">{exp.role}</h3>
                                        <div className="text-teal-600 font-medium mb-2">{exp.company}  |  {exp.startDate} - {exp.endDate}</div>
                                        <p className="text-stone-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {data.portfolio.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-teal-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700"><Layout size={16} /></span>
                                Selected Work
                            </h2>
                            <div className="grid grid-cols-2 gap-6">
                                {data.portfolio.map(p => (
                                    <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
                                        <h3 className="font-bold text-stone-800 mb-1">{p.name}</h3>
                                        <p className="text-stone-500 text-sm line-clamp-3">{p.description}</p>
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

export const SkyTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-full bg-slate-50 font-sans shadow-sm min-h-[297mm] relative overflow-hidden flex flex-col">
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
                            <h2 className="text-xl font-bold text-sky-900 mb-4">About Me</h2>
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
                            <h2 className="text-xl font-bold text-sky-900 mb-6 border-b border-sky-100 pb-2">Education</h2>
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
