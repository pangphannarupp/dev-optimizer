
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Plus, Trash2, ChevronDown, ChevronRight, User, Briefcase, GraduationCap, Code, Palette, Book, Globe, Award, BadgeCheck, Image as ImageIcon, Layout, Zap, Clock, Grid, PenTool, Rocket, Newspaper, Hexagon, Terminal, Crown, MailOpen, Building2, Share2, Shapes, LayoutGrid, Moon, AlignRight, Activity, Hammer, Cpu, Leaf, Cloud } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
// import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, TextRun, BorderStyle } from 'docx';
// import { saveAs } from 'file-saver';
import { CvData, INITIAL_DATA, Experience, Education, DesignSettings, PortfolioItem, Reference, Language, Certification } from '../types/CvTypes';
import { ModernTemplate, ClassicTemplate, MinimalTemplate, ProfessionalTemplate, CreativeTemplate, ElegantTemplate, TechTemplate, CompactTemplate, AcademicTemplate, SwissTemplate, TimelineTemplate, StartupTemplate, NewspaperTemplate, GeometricTemplate, ExecutiveTemplate, ManhattanTemplate, DeveloperTemplate, HeroTemplate, NewsletterTemplate, CorporateTemplate, InfluenceTemplate, AbstractTemplate, MosaicTemplate, NoirTemplate, RightTemplate, FluxTemplate, ImpactTemplate, GlitchTemplate, LeafTemplate, SkyTemplate } from './CvTemplates';

type TemplateType = 'modern' | 'classic' | 'minimal' | 'professional' | 'creative' | 'elegant' | 'tech' | 'compact' | 'academic' | 'swiss' | 'timeline' | 'startup' | 'newspaper' | 'geometric' | 'executive' | 'manhattan' | 'developer' | 'hero' | 'newsletter' | 'corporate' | 'influence' | 'abstract' | 'mosaic' | 'noir' | 'right' | 'flux' | 'impact' | 'glitch' | 'leaf' | 'sky';
type TemplateCategory = 'Professional' | 'Modern' | 'Creative' | 'Tech' | 'Unique';

interface TemplateMeta {
    id: TemplateType;
    label: string;
    icon: any;
    category: TemplateCategory;
}

const TEMPLATES: TemplateMeta[] = [
    // Professional
    { id: 'classic', icon: Book, label: 'Classic', category: 'Professional' },
    { id: 'professional', icon: Briefcase, label: 'Professional', category: 'Professional' },
    { id: 'elegant', icon: PenTool, label: 'Elegant', category: 'Professional' },
    { id: 'academic', icon: GraduationCap, label: 'Academic', category: 'Professional' },
    { id: 'corporate', icon: Building2, label: 'Corporate', category: 'Professional' },
    { id: 'executive', icon: Award, label: 'Executive', category: 'Professional' },
    { id: 'minimal', icon: Zap, label: 'Minimal', category: 'Professional' },

    // Modern
    { id: 'modern', icon: Layout, label: 'Modern', category: 'Modern' },
    { id: 'compact', icon: FileText, label: 'Compact', category: 'Modern' },
    { id: 'swiss', icon: Grid, label: 'Swiss', category: 'Modern' },
    { id: 'right', icon: AlignRight, label: 'Right', category: 'Modern' },
    { id: 'leaf', icon: Leaf, label: 'Leaf', category: 'Modern' },
    { id: 'sky', icon: Cloud, label: 'Sky', category: 'Modern' },

    // Creative
    { id: 'creative', icon: Palette, label: 'Creative', category: 'Creative' },
    { id: 'geometric', icon: Hexagon, label: 'Geometric', category: 'Creative' },
    { id: 'mosaic', icon: LayoutGrid, label: 'Mosaic', category: 'Creative' },
    { id: 'abstract', icon: Shapes, label: 'Abstract', category: 'Creative' },
    { id: 'flux', icon: Activity, label: 'Flux', category: 'Creative' },
    { id: 'impact', icon: Hammer, label: 'Impact', category: 'Creative' },

    // Tech
    { id: 'tech', icon: Code, label: 'Tech', category: 'Tech' },
    { id: 'startup', icon: Rocket, label: 'Startup', category: 'Tech' },
    { id: 'developer', icon: Terminal, label: 'Developer', category: 'Tech' },
    { id: 'hero', icon: Crown, label: 'Hero', category: 'Tech' },
    { id: 'glitch', icon: Cpu, label: 'Glitch', category: 'Tech' },

    // Unique
    { id: 'timeline', icon: Clock, label: 'Timeline', category: 'Unique' },
    { id: 'newspaper', icon: Newspaper, label: 'Newspaper', category: 'Unique' },
    { id: 'newsletter', icon: MailOpen, label: 'Newsletter', category: 'Unique' },
    { id: 'noir', icon: Moon, label: 'Noir', category: 'Unique' },
    { id: 'influence', icon: Share2, label: 'Influence', category: 'Unique' },
];

const CATEGORIES: TemplateCategory[] = ['Professional', 'Modern', 'Creative', 'Tech', 'Unique'];


export const CvGenerator = () => {
    const [data, setData] = useState<CvData>(INITIAL_DATA);
    const [activeTemplate, setActiveTemplate] = useState<TemplateType>('modern');
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const printRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleNextTemplate = () => {
        const currentIndex = TEMPLATES.findIndex(t => t.id === activeTemplate);
        const nextIndex = (currentIndex + 1) % TEMPLATES.length;
        setActiveTemplate(TEMPLATES[nextIndex].id);
    };

    const handlePrevTemplate = () => {
        const currentIndex = TEMPLATES.findIndex(t => t.id === activeTemplate);
        const prevIndex = (currentIndex - 1 + TEMPLATES.length) % TEMPLATES.length;
        setActiveTemplate(TEMPLATES[prevIndex].id);
    };

    const filteredTemplates = TEMPLATES.filter(t => {
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        const matchesSearch = t.label.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const activeTemplateMeta = TEMPLATES.find(t => t.id === activeTemplate) || TEMPLATES[0];
    const [activeSection, setActiveSection] = useState<string | null>('personal');
    const [design, setDesign] = useState<DesignSettings>({
        font: 'sans',
        fontSize: 'medium',
        textColor: '#374151',
        themeColor: '#2563eb'
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Actions ---
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `${data.personal.fullName.replace(/\s+/g, '_')}_CV`,
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
        // Prevent default browser behavior for drop events
        if ((e as React.DragEvent).dataTransfer) {
            e.preventDefault();
            e.stopPropagation();
        }

        let file: File | undefined;
        if ((e as React.DragEvent).dataTransfer) {
            file = (e as React.DragEvent).dataTransfer.files?.[0];
        } else {
            file = (e as React.ChangeEvent<HTMLInputElement>).target.files?.[0];
        }

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({ ...prev, personal: { ...prev.personal, photo: reader.result as string } }));
            };
            reader.readAsDataURL(file);
        }
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Prevent flickering when dragging over child elements
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
            return;
        }

        setIsDragging(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const _generateWord = async () => {
    //     const sections = [];

    //     // Header
    //     sections.push(
    //         new Paragraph({
    //             text: data.personal.fullName,
    //             heading: HeadingLevel.HEADING_1,
    //             alignment: AlignmentType.CENTER,
    //         }),
    //         new Paragraph({
    //             text: data.personal.role.toUpperCase(),
    //             heading: HeadingLevel.HEADING_2,
    //             alignment: AlignmentType.CENTER,
    //             spacing: { after: 200 }
    //         }),
    //         new Paragraph({
    //             alignment: AlignmentType.CENTER,
    //             children: [
    //                 new TextRun({ text: `${data.personal.email} | ${data.personal.phone}`, size: 20 }),
    //                 new TextRun({ text: `\n${data.personal.address} | ${data.personal.website}`, size: 20, break: 1 })
    //             ],
    //             spacing: { after: 400 }
    //         })
    //     );

    //     // Summary
    //     if (data.personal.summary) {
    //         sections.push(
    //             new Paragraph({
    //                 text: "PROFESSIONAL SUMMARY",
    //                 heading: HeadingLevel.HEADING_3,
    //                 border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
    //                 spacing: { before: 200, after: 100 }
    //             }),
    //             new Paragraph({
    //                 text: data.personal.summary,
    //                 spacing: { after: 300 }
    //             })
    //         );
    //     }

    //     // Experience
    //     if (data.experience.length > 0) {
    //         sections.push(
    //             new Paragraph({
    //                 text: "EXPERIENCE",
    //                 heading: HeadingLevel.HEADING_3,
    //                 border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
    //                 spacing: { before: 200, after: 100 }
    //             })
    //         );

    //         data.experience.forEach(exp => {
    //             sections.push(
    //                 new Paragraph({
    //                     children: [
    //                         new TextRun({ text: exp.role, bold: true, size: 24 }),
    //                         new TextRun({ text: `  |  ${exp.company}`, italics: true })
    //                     ]
    //                 }),
    //                 new Paragraph({
    //                     text: `${exp.startDate} - ${exp.endDate}`,
    //                     spacing: { after: 100 }
    //                 }),
    //                 new Paragraph({
    //                     text: exp.description,
    //                     spacing: { after: 300 }
    //                 })
    //             );
    //         });
    //     }

    //     // Education
    //     if (data.education.length > 0) {
    //         sections.push(
    //             new Paragraph({
    //                 text: "EDUCATION",
    //                 heading: HeadingLevel.HEADING_3,
    //                 border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
    //                 spacing: { before: 200, after: 100 }
    //             })
    //         );
    //         data.education.forEach(edu => {
    //             sections.push(
    //                 new Paragraph({
    //                     children: [
    //                         new TextRun({ text: edu.school, bold: true }),
    //                         new TextRun({ text: ` - ${edu.degree}` })
    //                     ]
    //                 }),
    //                 new Paragraph({
    //                     text: edu.year,
    //                     spacing: { after: 200 }
    //                 })
    //             );
    //         });
    //     }

    //     // Skills
    //     if (data.skills.length > 0) {
    //         sections.push(
    //             new Paragraph({
    //                 text: "SKILLS",
    //                 heading: HeadingLevel.HEADING_3,
    //                 border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
    //                 spacing: { before: 200, after: 100 }
    //             }),
    //             new Paragraph({
    //                 text: data.skills.join(" • "),
    //                 spacing: { after: 300 }
    //             })
    //         );
    //     }

    //     const doc = new Document({
    //         sections: [{
    //             properties: {},
    //             children: sections,
    //         }],
    //     });

    //     const blob = await Packer.toBlob(doc);
    //     saveAs(blob, `${data.personal.fullName.replace(/\s+/g, '_')}_CV.docx`);
    // };

    // --- State Updaters ---

    const updatePersonal = (field: keyof CvData['personal'], value: string) => {
        setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    };

    const addItem = <T extends { id: string }>(key: keyof CvData, item: T) => {
        setData(prev => {
            const list = prev[key];
            if (Array.isArray(list)) {
                return { ...prev, [key]: [...list, item] };
            }
            return prev;
        });
    };

    const updateItem = (key: keyof CvData, id: string, field: string, value: string) => {
        setData(prev => {
            const list = prev[key];
            if (Array.isArray(list)) {
                return {
                    ...prev,
                    [key]: list.map((item: any) => item.id === id ? { ...item, [field]: value } : item)
                };
            }
            return prev;
        });
    };

    const removeItem = (key: keyof CvData, id: string) => {
        setData(prev => ({ ...prev, [key]: (prev[key] as any[]).filter(item => item.id !== id) }));
    };

    // --- Helpers for specific types ---

    const addExperience = () => addItem<Experience>('experience', { id: Date.now().toString(), company: 'New Company', role: 'Role', startDate: '', endDate: '', description: '' });
    const addEducation = () => addItem<Education>('education', { id: Date.now().toString(), school: 'University', degree: 'Degree', year: '2023' });
    const addPortfolio = () => addItem<PortfolioItem>('portfolio', { id: Date.now().toString(), name: 'Project Name', link: 'Link', description: 'Description' });
    const addReference = () => addItem<Reference>('references', { id: Date.now().toString(), name: 'Name', company: 'Company', phone: 'Phone', email: 'Email' });
    const addLanguage = () => addItem<Language>('languages', { id: Date.now().toString(), language: 'Language', proficiency: 'Proficiency' });
    const addCertification = () => addItem<Certification>('certifications', { id: Date.now().toString(), name: 'Name', issuer: 'Issuer', year: 'Year' });


    // --- Renderers ---

    const renderEditor = () => (
        <div className="space-y-4">
            {/* Personal Info Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'personal' ? null : 'personal')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <User size={18} className="text-blue-500" />
                        Personal Information
                    </div>
                    {activeSection === 'personal' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {activeSection === 'personal' && (
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                        <div
                            className={`col-span-2 flex items-center gap-4 mb-4 p-4 rounded-xl border-2 border-dashed transition-all ${isDragging
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleImageUpload}
                        >
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 dark:bg-gray-700 dark:border-gray-600 overflow-hidden flex items-center justify-center">
                                    {data.personal.photo ? (
                                        <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-gray-400 w-10 h-10" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    <ImageIcon className="text-white w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Profile Photo</h3>
                                <p className="text-xs text-gray-500 mb-2">Drag & drop or click to upload</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-xs bg-gray-900 dark:bg-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    {data.personal.photo && (
                                        <button
                                            onClick={() => updatePersonal('photo', '')}
                                            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
                                        >Remove</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <input className="input-field col-span-2" placeholder="Full Name" value={data.personal.fullName} onChange={e => updatePersonal('fullName', e.target.value)} />
                        <input className="input-field" placeholder="Job Title" value={data.personal.role} onChange={e => updatePersonal('role', e.target.value)} />
                        <input className="input-field" placeholder="Email" value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
                        <input className="input-field" placeholder="Phone" value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
                        <input className="input-field" placeholder="Location" value={data.personal.address} onChange={e => updatePersonal('address', e.target.value)} />
                        <input className="input-field col-span-2" placeholder="Website / LinkedIn" value={data.personal.website} onChange={e => updatePersonal('website', e.target.value)} />
                        <textarea className="input-field col-span-2 h-24" placeholder="Professional Summary" value={data.personal.summary} onChange={e => updatePersonal('summary', e.target.value)} />
                    </div>
                )}
            </div>

            {/* Experience Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'exp' ? null : 'exp')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <Briefcase size={18} className="text-amber-500" />
                        Experience
                    </div>
                    {activeSection === 'exp' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {activeSection === 'exp' && (
                    <div className="p-5 space-y-6">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                <button onClick={() => removeItem('experience', exp.id)} className="absolute right-0 top-0 text-red-500 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-2 gap-3 pr-8">
                                    <input className="input-field font-bold" value={exp.role} onChange={e => updateItem('experience', exp.id, 'role', e.target.value)} placeholder="Role" />
                                    <input className="input-field" value={exp.company} onChange={e => updateItem('experience', exp.id, 'company', e.target.value)} placeholder="Company" />
                                    <input className="input-field" value={exp.startDate} onChange={e => updateItem('experience', exp.id, 'startDate', e.target.value)} placeholder="Start Date" />
                                    <input className="input-field" value={exp.endDate} onChange={e => updateItem('experience', exp.id, 'endDate', e.target.value)} placeholder="End Date" />
                                    <textarea className="input-field col-span-2 h-20" value={exp.description} onChange={e => updateItem('experience', exp.id, 'description', e.target.value)} placeholder="Description" />
                                </div>
                            </div>
                        ))}
                        <button onClick={addExperience} className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 transition-colors">
                            <Plus size={16} /> Add Position
                        </button>
                    </div>
                )}
            </div>

            {/* Education Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'edu' ? null : 'edu')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <GraduationCap size={18} className="text-green-500" />
                        Education
                    </div>
                    {activeSection === 'edu' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {activeSection === 'edu' && (
                    <div className="p-5 space-y-6">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                <button onClick={() => removeItem('education', edu.id)} className="absolute right-0 top-0 text-red-500 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-2 gap-3 pr-8">
                                    <input className="input-field font-bold" value={edu.school} onChange={e => updateItem('education', edu.id, 'school', e.target.value)} placeholder="School" />
                                    <input className="input-field" value={edu.degree} onChange={e => updateItem('education', edu.id, 'degree', e.target.value)} placeholder="Degree" />
                                    <input className="input-field" value={edu.year} onChange={e => updateItem('education', edu.id, 'year', e.target.value)} placeholder="Year" />
                                </div>
                            </div>
                        ))}
                        <button onClick={addEducation} className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 transition-colors">
                            <Plus size={16} /> Add Education
                        </button>
                    </div>
                )}
            </div>

            {/* Portfolio Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'portfolio' ? null : 'portfolio')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <Globe size={18} className="text-cyan-500" />
                        Portfolio / Projects
                    </div>
                    {activeSection === 'portfolio' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {activeSection === 'portfolio' && (
                    <div className="p-5 space-y-6">
                        {data.portfolio.map((item) => (
                            <div key={item.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                <button onClick={() => removeItem('portfolio', item.id)} className="absolute right-0 top-0 text-red-500 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-2 gap-3 pr-8">
                                    <input className="input-field font-bold" value={item.name} onChange={e => updateItem('portfolio', item.id, 'name', e.target.value)} placeholder="Project Name" />
                                    <input className="input-field" value={item.link} onChange={e => updateItem('portfolio', item.id, 'link', e.target.value)} placeholder="Link / URL" />
                                    <textarea className="input-field col-span-2 h-16" value={item.description} onChange={e => updateItem('portfolio', item.id, 'description', e.target.value)} placeholder="Short Description" />
                                </div>
                            </div>
                        ))}
                        <button onClick={addPortfolio} className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 transition-colors">
                            <Plus size={16} /> Add Project
                        </button>
                    </div>
                )}
            </div>

            {/* References Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'refs' ? null : 'refs')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <User size={18} className="text-indigo-500" />
                        References
                    </div>
                    {activeSection === 'refs' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {activeSection === 'refs' && (
                    <div className="p-5 space-y-6">
                        {data.references.map((ref) => (
                            <div key={ref.id} className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                                <button onClick={() => removeItem('references', ref.id)} className="absolute right-0 top-0 text-red-500 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                                <div className="grid grid-cols-2 gap-3 pr-8">
                                    <input className="input-field font-bold" value={ref.name} onChange={e => updateItem('references', ref.id, 'name', e.target.value)} placeholder="Name" />
                                    <input className="input-field" value={ref.company} onChange={e => updateItem('references', ref.id, 'company', e.target.value)} placeholder="Company" />
                                    <input className="input-field" value={ref.phone} onChange={e => updateItem('references', ref.id, 'phone', e.target.value)} placeholder="Phone" />
                                    <input className="input-field" value={ref.email} onChange={e => updateItem('references', ref.id, 'email', e.target.value)} placeholder="Email" />
                                </div>
                            </div>
                        ))}
                        <button onClick={addReference} className="w-full py-2 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 transition-colors">
                            <Plus size={16} /> Add Reference
                        </button>
                    </div>
                )}
            </div>

            {/* Languages & Certifications Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'extras' ? null : 'extras')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <Award size={18} className="text-yellow-500" />
                        Languages & Certifications
                    </div>
                    {activeSection === 'extras' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>

                {activeSection === 'extras' && (
                    <div className="p-5 space-y-8">
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Book size={14} /> Languages</h4>
                            <div className="space-y-3">
                                {data.languages.map((lang) => (
                                    <div key={lang.id} className="flex gap-2 relative group">
                                        <input className="input-field flex-1" value={lang.language} onChange={e => updateItem('languages', lang.id, 'language', e.target.value)} placeholder="Language" />
                                        <input className="input-field w-1/3" value={lang.proficiency} onChange={e => updateItem('languages', lang.id, 'proficiency', e.target.value)} placeholder="Level" />
                                        <button onClick={() => removeItem('languages', lang.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button onClick={addLanguage} className="text-sm text-blue-500 hover:underline flex items-center gap-1"><Plus size={14} /> Add Language</button>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><BadgeCheck size={14} /> Certifications</h4>
                            <div className="space-y-3">
                                {data.certifications.map((cert) => (
                                    <div key={cert.id} className="flex gap-2 relative group">
                                        <input className="input-field flex-1" value={cert.name} onChange={e => updateItem('certifications', cert.id, 'name', e.target.value)} placeholder="Certification" />
                                        <input className="input-field w-1/4" value={cert.year} onChange={e => updateItem('certifications', cert.id, 'year', e.target.value)} placeholder="Year" />
                                        <button onClick={() => removeItem('certifications', cert.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button onClick={addCertification} className="text-sm text-blue-500 hover:underline flex items-center gap-1"><Plus size={14} /> Add Certification</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Skills Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'skills' ? null : 'skills')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <Code size={18} className="text-purple-500" />
                        Skills
                    </div>
                    {activeSection === 'skills' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                {activeSection === 'skills' && (
                    <div className="p-5">
                        <textarea
                            className="input-field h-24"
                            value={data.skills.join(', ')}
                            onChange={e => setData({ ...data, skills: e.target.value.split(', ') })}
                            placeholder="React, TypeScript, Node.js (comma separated)"
                        />
                    </div>
                )}
            </div>

            {/* Design & customization Accordion */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                    onClick={() => setActiveSection(activeSection === 'design' ? null : 'design')}
                    className="w-full px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <div className="flex items-center gap-3 font-semibold text-gray-900 dark:text-gray-100">
                        <Palette size={18} className="text-pink-500" />
                        Design & Colors
                    </div>
                    {activeSection === 'design' ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                {activeSection === 'design' && (
                    <div className="p-5 space-y-8 animate-in slide-in-from-top-2">
                        {/* Theme Color */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Palette size={14} /> Theme Color
                            </label>
                            <div className="space-y-3">
                                <div className="flex flex-wrap gap-3">
                                    {['#2563eb', '#dc2626', '#16a34a', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#059669', '#4f46e5', '#0f172a'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setDesign({ ...design, themeColor: color })}
                                            className={`w-8 h-8 rounded-full shadow-sm transition-all ${design.themeColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={design.themeColor}
                                            onChange={e => setDesign({ ...design, themeColor: e.target.value })}
                                            className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                                        />
                                        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 pointer-events-none"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 mb-1">Custom Hex Code</div>
                                        <div className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{design.themeColor}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-100 dark:bg-gray-700"></div>

                        {/* Typography */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText size={14} /> Typography
                            </label>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <span className="text-xs text-gray-400 mb-1.5 block">Font Family</span>
                                    <select
                                        className="input-field"
                                        value={design.font}
                                        onChange={e => setDesign({ ...design, font: e.target.value })}
                                        style={{ fontFamily: design.font === 'sans' ? 'Inter, sans-serif' : design.font }}
                                    >
                                        <optgroup label="Sans Serif">
                                            <option value="sans">System UI (Default)</option>
                                            <option value="'Inter', sans-serif">Inter</option>
                                            <option value="'Roboto', sans-serif">Roboto</option>
                                            <option value="'Open Sans', sans-serif">Open Sans</option>
                                            <option value="'Lato', sans-serif">Lato</option>
                                            <option value="'Montserrat', sans-serif">Montserrat</option>
                                        </optgroup>
                                        <optgroup label="Serif">
                                            <option value="serif">Times New Roman</option>
                                            <option value="'Playfair Display', serif">Playfair Display</option>
                                            <option value="'Merriweather', serif">Merriweather</option>
                                            <option value="'Lora', serif">Lora</option>
                                        </optgroup>
                                        <optgroup label="Monospace">
                                            <option value="mono">Courier New</option>
                                            <option value="'Fira Code', monospace">Fira Code</option>
                                            <option value="'Source Code Pro', monospace">Source Code Pro</option>
                                        </optgroup>
                                    </select>
                                </div>

                                <div>
                                    <span className="text-xs text-gray-400 mb-1.5 block">Text Size</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['small', 'medium', 'large'].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setDesign({ ...design, fontSize: size })}
                                                className={`py-2 px-3 rounded-lg text-sm transition-colors border ${design.fontSize === size
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                                                    : 'bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <span className={size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'}>
                                                    Aa
                                                </span>
                                                <span className="ml-2 capitalize opacity-60 text-xs">{size}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-px bg-gray-100 dark:bg-gray-700"></div>

                        {/* Text Color */}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Palette size={14} /> Text Color
                            </label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={design.textColor}
                                        onChange={e => setDesign({ ...design, textColor: e.target.value })}
                                        className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0 shadow-sm"
                                    />
                                    <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10 pointer-events-none"></div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-gray-500 mb-1">Pick Color</div>
                                    <div className="font-mono text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">{design.textColor}</div>
                                </div>
                                <button
                                    onClick={() => setDesign({ ...design, textColor: '#374151' })}
                                    className="text-xs text-gray-500 hover:text-gray-900 underline"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-64px)] w-full bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row overflow-hidden font-sans">
            <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&family=Lato:ital,wght@0,300;0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:ital,wght@0,300;0,400;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Source+Code+Pro:wght@300;400;500&display=swap" rel="stylesheet" />
            <style>{`
                .input-field {
                    width: 100%;
                    background: transparent;
                    border: 1px solid #e5e7eb;
                    padding: 0.5rem 0.75rem;
                    border-radius: 0.5rem;
                    font-size: 0.875rem;
                    color: #1f2937 !important;
                    transition: all 0.2s;
                }
                .dark .input-field { 
                    border-color: #374151; 
                    color: #f9fafb !important;
                }
                .input-field:focus { outline: none; border-color: #3b82f6; ring: 2px solid #3b82f633; }

                @media print {
                    @page { size: auto; margin: 0mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .print-container {
                        transform: none !important;
                        width: 210mm !important;
                        height: auto !important;
                        margin: 0 auto !important;
                        box-shadow: none !important;
                        overflow: visible !important;
                        display: block !important;
                    }
                }
            `}</style>


            {/* LEFT: Editor Panel */}
            <div className="w-full md:w-[400px] lg:w-[450px] flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-10 shadow-xl">
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                        <FileText className="text-blue-600" /> CV Generator
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
                    {renderEditor()}
                </div>

                <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2.5 rounded-lg font-medium transition-all"
                        >
                            <Printer size={18} /> Save as PDF
                        </button>
                        {/* <button
                            onClick={generateWord}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Download size={18} /> Export Word
                        </button> */}
                    </div>
                </div>
            </div>

            {/* RIGHT: Preview Panel */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-950 p-4 md:p-8 overflow-y-auto flex flex-col">
                {/* Style Switcher Floating Header - Replaced with Control Bar */}
                <div className="mx-auto sticky top-4 z-40 mb-8 max-w-[95%]">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3 pl-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <activeTemplateMeta.icon size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Current Template</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{activeTemplateMeta.label}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevTemplate} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <ChevronDown className="rotate-90" size={20} />
                            </button>

                            <button
                                onClick={() => setIsGalleryOpen(true)}
                                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
                            >
                                <Grid size={18} />
                                <span className="hidden sm:inline">Browse Gallery</span>
                            </button>

                            <button onClick={handleNextTemplate} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Template Gallery Modal */}
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 sticky top-0 z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <LayoutGrid className="text-blue-600" /> Template Gallery
                                    </h2>
                                    <p className="text-gray-500 text-sm">Select from our collection of {TEMPLATES.length} professional designs.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search templates..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl w-64 focus:ring-2 focus:ring-blue-500/50 outline-none"
                                        />
                                        <div className="absolute left-3.5 top-3 text-gray-400">
                                            <div className="w-4 h-4 border-2 border-current rounded-full" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsGalleryOpen(false)}
                                        className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
                                    >
                                        <div className="w-5 h-5 flex items-center justify-center">✕</div>
                                    </button>
                                </div>
                            </div>

                            {/* Categories Tabs */}
                            <div className="px-6 py-4 flex gap-2 overflow-x-auto border-b border-gray-100 dark:border-gray-800 scrollbar-hide">
                                <button
                                    onClick={() => setSelectedCategory('All')}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === 'All'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    All Designs
                                </button>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === cat
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Gallery Grid */}
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 dark:bg-gray-950/50">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {filteredTemplates.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                setActiveTemplate(t.id);
                                                setIsGalleryOpen(false);
                                            }}
                                            className={`
                                                group relative bg-white dark:bg-gray-900 border rounded-2xl p-4 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block
                                                ${activeTemplate === t.id
                                                    ? 'border-blue-500 ring-4 ring-blue-500/10'
                                                    : 'border-gray-200 dark:border-gray-800 hover:border-blue-300'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                h-32 mb-4 rounded-xl flex items-center justify-center mb-4 transition-colors
                                                ${activeTemplate === t.id ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500'}
                                            `}>
                                                <t.icon size={48} strokeWidth={1.5} />
                                            </div>

                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{t.label}</h3>
                                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-md mt-1 inline-block">{t.category}</span>
                                                </div>
                                                {activeTemplate === t.id && (
                                                    <div className="bg-blue-600 text-white p-1 rounded-full">
                                                        <BadgeCheck size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {filteredTemplates.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <p className="text-xl font-medium">No templates found matching "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* A4 Paper Preview */}
                <motion.div
                    layout
                    className="print-container mx-auto bg-white shadow-2xl w-[210mm] min-h-[297mm] origin-top transform scale-75 md:scale-90 lg:scale-100 transition-transform duration-300 flex flex-col"
                    ref={printRef}
                >
                    {activeTemplate === 'modern' && <ModernTemplate data={data} design={design} />}
                    {activeTemplate === 'classic' && <ClassicTemplate data={data} design={design} />}
                    {activeTemplate === 'minimal' && <MinimalTemplate data={data} design={design} />}
                    {activeTemplate === 'professional' && <ProfessionalTemplate data={data} design={design} />}
                    {activeTemplate === 'creative' && <CreativeTemplate data={data} design={design} />}
                    {activeTemplate === 'elegant' && <ElegantTemplate data={data} design={design} />}
                    {activeTemplate === 'tech' && <TechTemplate data={data} design={design} />}
                    {activeTemplate === 'compact' && <CompactTemplate data={data} design={design} />}
                    {activeTemplate === 'academic' && <AcademicTemplate data={data} design={design} />}
                    {activeTemplate === 'swiss' && <SwissTemplate data={data} design={design} />}
                    {activeTemplate === 'timeline' && <TimelineTemplate data={data} design={design} />}
                    {activeTemplate === 'startup' && <StartupTemplate data={data} design={design} />}
                    {activeTemplate === 'newspaper' && <NewspaperTemplate data={data} design={design} />}
                    {activeTemplate === 'geometric' && <GeometricTemplate data={data} design={design} />}
                    {activeTemplate === 'executive' && <ExecutiveTemplate data={data} design={design} />}
                    {activeTemplate === 'manhattan' && <ManhattanTemplate data={data} design={design} />}
                    {activeTemplate === 'developer' && <DeveloperTemplate data={data} design={design} />}
                    {activeTemplate === 'hero' && <HeroTemplate data={data} design={design} />}
                    {activeTemplate === 'newsletter' && <NewsletterTemplate data={data} design={design} />}
                    {activeTemplate === 'corporate' && <CorporateTemplate data={data} design={design} />}
                    {activeTemplate === 'influence' && <InfluenceTemplate data={data} design={design} />}
                    {activeTemplate === 'abstract' && <AbstractTemplate data={data} design={design} />}
                    {activeTemplate === 'mosaic' && <MosaicTemplate data={data} design={design} />}
                    {activeTemplate === 'noir' && <NoirTemplate data={data} design={design} />}
                    {activeTemplate === 'right' && <RightTemplate data={data} design={design} />}
                    {activeTemplate === 'flux' && <FluxTemplate data={data} design={design} />}
                    {activeTemplate === 'impact' && <ImpactTemplate data={data} design={design} />}
                    {activeTemplate === 'glitch' && <GlitchTemplate data={data} design={design} />}
                    {activeTemplate === 'leaf' && <LeafTemplate data={data} design={design} />}
                    {activeTemplate === 'sky' && <SkyTemplate data={data} design={design} />}
                </motion.div>
            </div>
        </div>
    );
};
