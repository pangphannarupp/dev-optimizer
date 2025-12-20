
// --- Types ---
// --- Types ---
export interface DesignSettings {
    font: string;
    fontSize: string; // 'small', 'medium', 'large'
    textColor: string;
    themeColor: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
}

export interface PortfolioItem {
    id: string;
    name: string;
    link: string;
    description: string;
}

export interface Reference {
    id: string;
    name: string;
    company: string;
    phone: string;
    email: string;
}

export interface Language {
    id: string;
    language: string;
    proficiency: string; // e.g., 'Fluent', 'Intermediate'
}

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    year: string;
}

export interface CvData {
    personal: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
        website: string;
        summary: string;
        role: string;
        photo?: string; // Base64 or URL
    };
    experience: Experience[];
    education: Education[];
    skills: string[];
    portfolio: PortfolioItem[];
    references: Reference[];
    languages: Language[];
    certifications: Certification[];
}

export const INITIAL_DATA: CvData = {
    personal: {
        fullName: 'John Doe',
        role: 'Software Engineer',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        address: 'San Francisco, CA',
        website: 'linkedin.com/in/johndoe',
        summary: 'Passionate software engineer with 5+ years of experience in building scalable web applications. Expert in React and TypeScript.',
        photo: ''
    },
    experience: [
        {
            id: '1',
            company: 'Tech Corp',
            role: 'Senior Developer',
            startDate: '2020-01',
            endDate: 'Present',
            description: '• Led a team of 5 developers\n• Rebuilt the core product architecture\n• Improved performance by 40%',
        }
    ],
    education: [
        {
            id: '1',
            school: 'University of Technology',
            degree: 'BS in Computer Science',
            year: '2019',
        }
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Docker', 'AWS'],
    portfolio: [
        {
            id: '1',
            name: 'Project Alpha',
            link: 'github.com/johndoe/alpha',
            description: 'A full-stack e-commerce platform built with Next.js.'
        }
    ],
    references: [
        {
            id: '1',
            name: 'Jane Smith',
            company: 'Tech Corp',
            phone: '555-0199',
            email: 'jane@techcorp.com'
        }
    ],
    languages: [
        { id: '1', language: 'English', proficiency: 'Native' },
        { id: '2', language: 'Spanish', proficiency: 'Intermediate' }
    ],
    certifications: [
        { id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2022' }
    ]
};
