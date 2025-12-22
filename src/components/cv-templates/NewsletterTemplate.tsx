import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const NewsletterTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-orange-50/30 font-serif shadow-sm p-12 min-h-[297mm] flex flex-col">
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
