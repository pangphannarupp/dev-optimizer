import React from 'react';
import { TemplateProps, getStyles } from './shared';

export const DeveloperTemplate: React.FC<TemplateProps> = ({ data, design }) => {
    return (
        <div className="w-full min-h-[297mm] bg-[#1e1e1e] text-gray-300 font-mono shadow-sm p-8 min-h-[297mm] flex flex-col border-t-8 border-b-8" style={{ ...getStyles(design), borderColor: design.themeColor }}>
            <div className="flex justify-between items-start mb-12 border-b border-gray-700 pb-8">
                <div>
                    <h1 className="text-4xl text-white font-bold mb-2">
                        <span className="text-green-400">&gt;</span> {data.personal.fullName}
                    </h1>
                    <p className="text-xl opacity-80 pl-6 mb-4 text-green-400">
                        // {data.personal.role}
                    </p>
                    <div className="pl-6 text-sm flex flex-col gap-1">
                        {data.personal.email && (
                            <span>
                                <span className="text-blue-400">const</span> email = <span className="text-yellow-300">"{data.personal.email}";</span>
                            </span>
                        )}
                        {data.personal.phone && (
                            <span>
                                <span className="text-blue-400">const</span> phone = <span className="text-yellow-300">"{data.personal.phone}";</span>
                            </span>
                        )}
                        {data.personal.address && (
                            <span>
                                <span className="text-blue-400">const</span> loc = <span className="text-yellow-300">"{data.personal.address}";</span>
                            </span>
                        )}
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
                                <p className="text-sm leading-relaxed text-gray-400">"{data.personal.summary}"</p>
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
                                        <div className="flex justify-between text-xs mb-2 text-gray-500">
                                            <span>at {exp.company}</span>
                                            <span>[{exp.startDate}, {exp.endDate}]</span>
                                        </div>
                                        <p className="text-sm text-gray-400">{exp.description}</p>
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
