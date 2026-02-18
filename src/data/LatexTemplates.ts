export interface LatexTemplate {
    id: string;
    name: string;
    description: string;
    code: string;
    category: 'Analysis' | 'Geometry' | 'Algebra' | 'General';
}

export const LATEX_TEMPLATES: LatexTemplate[] = [
    {
        id: 'blank',
        name: 'Blank Document',
        description: 'A minimal setup with standard packages.',
        category: 'General',
        code: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{geometry}

\\title{Untitled Document}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Start typing here...

\\end{document}`
    },
    {
        id: 'homework',
        name: 'Homework Assignment',
        description: 'Clean layout for problem sets.',
        category: 'General',
        code: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath, amssymb, amsthm}
\\usepackage{fancyhdr}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\pagestyle{fancy}
\\fancyhf{}
\\lhead{Course Name}
\\rhead{Student Name}
\\cfoot{\\thepage}

\\title{Homework Assignment 1}
\\author{Student Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section*{Problem 1}
Solution goes here...

\\section*{Problem 2}
Solution goes here...

\\end{document}`
    },
    {
        id: 'cheat_sheet',
        name: 'Cheat Sheet / Formula List',
        description: 'Two-column layout for formulas.',
        category: 'General',
        code: `\\documentclass[10pt,landscape]{article}
\\usepackage{multicol}
\\usepackage{calc}
\\usepackage{ifthen}
\\usepackage[landscape]{geometry}
\\usepackage{amsmath,amsthm,amsfonts,amssymb}
\\usepackage{color,graphicx,overpic}
\\usepackage{hyperref}

\\geometry{top=0.5in,left=0.5in,right=0.5in,bottom=0.5in}

\\pagestyle{empty}
\\makeatletter
\\renewcommand{\\section}{\\@startsection{section}{1}{0mm}%
                                {-1ex plus -.5ex minus -.2ex}%
                                {0.5ex plus .2ex}%x
                                {\\normalfont\\large\\bfseries}}
\\renewcommand{\\subsection}{\\@startsection{subsection}{2}{0mm}%
                                {-1explus -.5ex minus -.2ex}%
                                {0.5ex plus .2ex}%
                                {\\normalfont\\normalsize\\bfseries}}
\\makeatother

\\setcounter{secnumdepth}{0}

\\begin{document}
\\begin{multicols*}{3}

\\section{Algebra}
\\subsection{Quadratic Formula}
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

\\section{Calculus}
\\subsection{Derivatives}
$$ \\frac{d}{dx} x^n = nx^{n-1} $$

\\section{Trigonometry}
$$ \\sin^2 \\theta + \\cos^2 \\theta = 1 $$

\\end{multicols*}
\\end{document}`
    },
    {
        id: 'geometry_proof',
        name: 'Geometry Proof',
        description: 'Template for formal geometric proofs.',
        category: 'Geometry',
        code: `\\documentclass{article}
\\usepackage{amsmath, amssymb, amsthm}
\\usepackage{tikz}

\\newtheorem{theorem}{Theorem}
\\newtheorem{lemma}[theorem]{Lemma}

\\title{Geometry Proof}
\\author{Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Theorem Statement}
\\begin{theorem}
The sum of angles in a triangle is 180 degrees.
\\end{theorem}

\\section{Proof}
\\begin{proof}
Let $\\Delta ABC$ be a triangle...
\\end{proof}

\\section{Diagram}
\\begin{center}
\\begin{tikzpicture}
\\draw (0,0) -- (4,0) -- (2,3) -- cycle;
\\node at (0,0) [below left] {A};
\\node at (4,0) [below right] {B};
\\node at (2,3) [above] {C};
\\end{tikzpicture}
\\end{center}

\\end{document}`
    },
    {
        id: 'math_exam',
        name: 'Math Exam',
        description: 'Exam paper with points and questions.',
        category: 'Algebra',
        code: `\\documentclass[addpoints]{exam}
\\usepackage{amsmath, amssymb}

\\title{Midterm Exam}
\\author{Professor Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{center}
\\fbox{\\fbox{\\parbox{5.5in}{\\centering
Answer the questions in the spaces provided. If you run out of room for an answer,
continue on the back of the page.}}}
\\end{center}

\\vspace{0.1in}
\\makebox[\\textwidth]{Name:\\enspace\\hrulefill}

\\vspace{0.2in}

\\begin{questions}

\\question[10]
Solve the following quadratic equation:
$$ x^2 - 5x + 6 = 0 $$
\\vspace{1in}

\\question[15]
Calculate the integral:
$$ \\int_{0}^{1} x^2 e^x dx $$
\\vspace{1in}

\\end{questions}

\\end{document}`
    },
    {
        id: 'presentation',
        name: 'Slide Presentation (Beamer)',
        description: 'Standard presentation layout with slides.',
        category: 'General',
        code: `\\documentclass{beamer}
\\usepackage[utf8]{inputenc}
\\usetheme{Madrid}
\\usecolortheme{default}

\\title{Presentation Title}
\\subtitle{Subtitle Here}
\\author{Author Name}
\\institute{Institute Name}
\\date{\\today}

\\begin{document}

\\frame{\\titlepage}

\\begin{frame}
\\frametitle{Table of Contents}
\\tableofcontents
\\end{frame}

\\section{Introduction}
\\begin{frame}
\\frametitle{Introduction}
\\begin{itemize}
    \\item First point about the topic
    \\item Second point with \\textbf{bold text}
    \\item Third point with \\textit{italics}
\\end{itemize}
\\end{frame}

\\section{Main Content}
\\begin{frame}
\\frametitle{Slide with Math}
Here is an important equation:
$$ E = mc^2 $$
\\begin{block}{Observation}
    This is a block of text to highlight key information.
\\end{block}
\\end{frame}

\\begin{frame}
\\frametitle{Two Columns}
\\begin{columns}
\\column{0.5\\textwidth}
    This is the first column text.
\\column{0.5\\textwidth}
    This is the second column text.
\\end{columns}
\\end{frame}

\\begin{frame}
\\frametitle{Conclusion}
\\centering
\\huge Thank You!
\\end{frame}

\\end{document}`
    },
    {
        id: 'lab_report',
        name: 'Scientific Lab Report',
        description: 'Standard format for experimental results.',
        category: 'Analysis',
        code: `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}
\\usepackage[margin=1in]{geometry}

\\title{Determination of Gravitational Acceleration}
\\author{Lab Partner 1, Lab Partner 2}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
In this experiment, we determined the local gravitational acceleration $g$ using a simple pendulum. Our measured value was $9.81 \\pm 0.05 \\text{ m/s}^2$, which agrees with the accepted value.
\\end{abstract}

\\section{Introduction}
The objective of this experiment is to measure $g$ by observing the period $T$ of a simple pendulum of length $L$. The theoretical relationship is given by:
$$ T = 2\\pi \\sqrt{\\frac{L}{g}} $$

\\section{Method}
We measured the length of the string using a meter stick and the period of oscillation using a stopwatch. We varied $L$ from 0.5m to 1.5m.

\\section{Results}
The following data was collected:

\\begin{table}[h]
    \\centering
    \\begin{tabular}{|c|c|}
        \\hline
        Length (m) & Period (s) \\\\
        \\hline
        0.50 & 1.42 \\\\
        0.75 & 1.73 \\\\
        1.00 & 2.01 \\\\
        \\hline
    \\end{tabular}
\\end{table}

\\section{Conclusion}
Our results confirm the theoretical model within experimental error.

\\end{document}`
    },
    {
        id: 'research_paper',
        name: 'IEEE Research Paper',
        description: 'Two-column academic paper format.',
        category: 'General',
        code: `\\documentclass[twocolumn]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{Novel Approaches to Quantum Computing}
\\author{Jane Doe, John Smith}
\\date{\\today}

\\begin{document}

\\maketitle

\\begin{abstract}
We present a new algorithm for error correction in quantum circuits. Our method improves fidelity by 15\\% compared to standard approaches. This paper discusses the theoretical bounds and experimental results.
\\end{abstract}

\\section{Introduction}
Quantum computing promises exponential speedup for certain problems \\cite{shor1994}. However, decoherence remains a major challenge.

\\section{Proposed Method}
Our approach relies on the surface code architecture. The error rate $P$ is defined as:
$$ P = \\sum_{i} |\\psi_i|^2 e^{-\\Gamma t} $$

\\section{Experiments}
We simulated the circuit using Qiskit. The results show a clear improvement in stability.

\\section{Conclusion}
Future work will focus on scaling this to 50+ qubits.

\\begin{thebibliography}{9}
\\bibitem{shor1994}
Shor, P.W. (1994). Algorithms for quantum computation: discrete logarithms and factoring.
\\bibitem{nielsen2010}
Nielsen, M. A., & Chuang, I. L. (2010). Quantum Computation and Quantum Information.
\\end{thebibliography}

\\end{document}`
    },
    {
        id: 'resume',
        name: 'Professional Resume',
        description: 'Clean, modern CV layout.',
        category: 'General',
        code: `\\documentclass{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{titlesec}

\\begin{document}

\\begin{center}
    {\\huge \\textbf{Alex Johnson}} \\\\
    \\vspace{0.1in}
    email@example.com | (555) 123-4567 | San Francisco, CA
\\end{center}

\\hrule
\\vspace{0.2in}

\\section*{Experience}
\\textbf{Senior Software Engineer} \\hfill 2020 - Present \\\\
\\textit{Tech Corp, San Francisco}
\\begin{itemize}
    \\item Led development of the core payment processing engine, handling $1B+ annually.
    \\item Reduced latency by 40\\% by optimizing database queries.
    \\item Mentored 5 junior engineers and conducted code reviews.
\\end{itemize}

\\vspace{0.1in}

\\textbf{Software Developer} \\hfill 2017 - 2020 \\\\
\\textit{Startup Inc, New York}
\\begin{itemize}
    \\item Built a React-based dashboard for real-time data visualization.
    \\item Implemented CI/CD pipelines using GitHub Actions.
\\end{itemize}

\\section*{Education}
\\textbf{B.S. Computer Science} \\hfill 2013 - 2017 \\\\
\\textit{University of Technology}
\\begin{itemize}
    \\item GPU: 3.8/4.0
    \\item President of the Robotics Club
\\end{itemize}

\\section*{Skills}
\\textbf{Languages:} TypeScript, Python, Rust, C++ \\\\
\\textbf{Tools:} Docker, Kubernetes, AWS, Git

\\end{document}`
    }
];
