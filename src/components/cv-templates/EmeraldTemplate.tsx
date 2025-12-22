import React from 'react';
import { TemplateProps, getStyles } from './shared';
import { Mail, Phone, MapPin, User } from 'lucide-react';

export const EmeraldTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div style={getStyles(design)} className="w-full min-h-[297mm] bg-white font-sans flex text-gray-800">
            {/* Left Sidebar */}
            <aside className="w-[32%] bg-white border-r border-gray-100 flex flex-col pt-8 pb-8">
                <div className="px-6 mb-8">
                    {data.personal.photo ? (
                        <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-md shadow-sm">
                            <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 mx-auto mb-4 bg-teal-100 rounded-md flex items-center justify-center text-teal-600">
                            <User size={48} />
                        </div>
                    )}
                </div>

                <div className="space-y-8 flex-1">
                    <section>
                        <h3 className="bg-[#5D8080] text-white text-center py-2 font-bold tracking-widest text-sm mb-6 uppercase">Profile</h3>
                        <p className="px-6 text-sm leading-relaxed text-gray-600 text-justify">
                            {data.personal.summary}
                        </p>
                    </section>

                    <section>
                        <h3 className="bg-[#5D8080] text-white text-center py-2 font-bold tracking-widest text-sm mb-6 uppercase">Skill</h3>
                        <div className="px-6 space-y-2">
                            {data.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#5D8080]" />
                                    <span>{skill}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="bg-[#5D8080] text-white text-center py-2 font-bold tracking-widest text-sm mb-6 uppercase">Education</h3>
                        <div className="px-6 space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index} className="text-sm">
                                    <div className="font-bold text-gray-800">{edu.degree}</div>
                                    <div className="text-gray-600 italic mb-1">{edu.school}</div>
                                    <div className="text-gray-500 text-xs">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 pt-12">
                <header className="mb-12 border-b-2 border-gray-100 pb-8">
                    <h1 className="text-5xl font-serif text-gray-800 mb-2 uppercase tracking-wide leading-tight">
                        {data.personal.fullName.split(' ')[0]}<br />
                        <span className="font-light">{data.personal.fullName.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="text-xl text-gray-500 italic font-serif mb-6">{data.personal.role}</p>

                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-3">
                            <Phone size={14} className="text-[#5D8080]" /> {data.personal.phone}
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail size={14} className="text-[#5D8080]" /> {data.personal.email}
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin size={14} className="text-[#5D8080]" /> {data.personal.address}
                        </div>
                    </div>
                </header>

                <section>
                    <div className="bg-[#789999] text-white px-4 py-2 font-bold tracking-widest text-sm mb-8 uppercase inline-block w-full">Work Experience</div>
                    <div className="space-y-8 px-2">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="relative pl-4 border-l-2 border-gray-100">
                                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#5D8080]" />
                                <div className="mb-1">
                                    <span className="font-bold text-lg text-gray-800 block">{exp.role}</span>
                                    <span className="text-[#5D8080] font-medium">{exp.company}</span>
                                    <span className="text-gray-400 text-sm ml-2"> | {exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>


            </main>
        </div >
    );
};
