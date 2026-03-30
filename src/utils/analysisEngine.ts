import { ProjectFile, QualityIssue } from './codeQualityRules';

/**
 * Detects duplicated code blocks across multiple files.
 * Returns a list of QualityIssue for duplication.
 */
export const detectDuplications = (files: ProjectFile[], minLines: number = 10): QualityIssue[] => {
    const issues: QualityIssue[] = [];
    const blockHashes: Map<string, { fileName: string; line: number }[]> = new Map();

    files.forEach(file => {
        const lines = file.content.split('\n');
        if (lines.length < minLines) return;

        for (let i = 0; i <= lines.length - minLines; i++) {
            // Take N lines, normalize them (remove whitespace/comments)
            const block = lines.slice(i, i + minLines)
                .map(l => l.trim().replace(/\/\/.*$/g, '').replace(/\/\*.*?\*\//g, ''))
                .filter(l => l.length > 0)
                .join('|');

            if (block.length < 50) continue; // Skip very small/trivial blocks

            const hash = block; // Using string as hash for simplicity in this demo
            if (!blockHashes.has(hash)) {
                blockHashes.set(hash, []);
            }
            blockHashes.get(hash)?.push({ fileName: file.name, line: i + 1 });
        }
    });

    // Find blocks appearing more than once
    blockHashes.forEach((occurrences) => {
        if (occurrences.length > 1) {
            occurrences.forEach((occ, idx) => {
                // To avoid reporting the same duplication twice, we only report once per location
                // But we mention where other occurrences are
                const others = occurrences
                    .filter((_, i) => i !== idx)
                    .map(o => `${o.fileName}:L${o.line}`)
                    .slice(0, 3);
                
                // Note: In a real system, we'd attach this to the specific file. 
                // For this unified engine, we return a list of issues.
                issues.push({
                    ruleId: 'code-duplication',
                    message: `Duplicated code block found (${occurrences.length} instances total).`,
                    line: occ.line,
                    severity: 'warning',
                    category: 'duplication',
                    effort: 15,
                    suggestion: `Refactor into a shared component or utility. Other instances: ${others.join(', ')}...`,
                    // We need a way to tell which file this belongs to in the main loop
                    url: occ.fileName // Reusing URL field to stash filename for internal routing
                });
            });
        }
    });

    return issues;
};

/**
 * Calculates cognitive complexity of a code string.
 */
export const calculateComplexity = (code: string): number => {
    let complexity = 0;
    let nesting = 0;

    const lines = code.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        
        // Control flow increases complexity
        const controlFlow = (trimmed.match(/\b(if|else if|for|while|catch|switch|case|\|\||&&|\?)\b/g) || []).length;
        
        if (controlFlow > 0) {
            complexity += controlFlow + nesting;
        }

        // Nesting tracking
        if (trimmed.includes('{')) nesting++;
        if (trimmed.includes('}')) nesting = Math.max(0, nesting - 1);
    });

    return complexity;
};

/**
 * Checks project stats against Quality Gate thresholds.
 */
export interface QualityGateResult {
    passed: boolean;
    conditions: {
        metric: string;
        actual: string;
        expected: string;
        passed: boolean;
    }[];
}

export const checkQualityGate = (stats: any): QualityGateResult => {
    const conditions = [
        {
            metric: 'Reliability Rating',
            actual: stats.reliabilityRating,
            expected: '>= B',
            passed: ['A', 'B'].includes(stats.reliabilityRating)
        },
        {
            metric: 'Security Rating',
            actual: stats.securityRating,
            expected: '>= A',
            passed: stats.securityRating === 'A'
        },
        {
            metric: 'Maintainability Rating',
            actual: stats.maintainabilityRating,
            expected: '>= B',
            passed: ['A', 'B'].includes(stats.maintainabilityRating)
        },
        {
            metric: 'Critical Bugs',
            actual: stats.bugs.toString(),
            expected: '0',
            passed: stats.bugs === 0
        }
    ];

    return {
        passed: conditions.every(c => c.passed),
        conditions
    };
};
