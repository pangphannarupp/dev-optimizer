import { Severity, IssueCategory } from './codeQualityRules';

export interface ExternalReportIssue {
    ruleId: string;
    message: string;
    line: number;
    column?: number;
    severity: Severity;
    category: IssueCategory;
    filePath: string;
    effort?: number;
}

/**
 * Parses Detekt XML report (Android/Kotlin)
 */
export const parseDetektReport = (xmlString: string): ExternalReportIssue[] => {
    const issues: ExternalReportIssue[] = [];
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const files = xmlDoc.getElementsByTagName('file');

        for (let i = 0; i < files.length; i++) {
            const fileName = files[i].getAttribute('name') || '';
            const errors = files[i].getElementsByTagName('error');
            
            for (let j = 0; j < errors.length; j++) {
                const error = errors[j];
                const source = error.getAttribute('source') || 'detekt';
                const severityStr = error.getAttribute('severity') || 'warning';
                
                issues.push({
                    ruleId: source.split('.').pop() || source,
                    message: error.getAttribute('message') || '',
                    line: parseInt(error.getAttribute('line') || '0', 10),
                    column: parseInt(error.getAttribute('column') || '0', 10),
                    severity: severityStr === 'error' ? 'error' : 'warning',
                    category: 'code_smell', // Detekt is mostly code smells
                    filePath: fileName
                });
            }
        }
    } catch (e) {
        console.error('Error parsing Detekt report:', e);
    }
    return issues;
};

/**
 * Parses SwiftLint JSON report (iOS/Swift)
 */
export const parseSwiftLintReport = (jsonString: string): ExternalReportIssue[] => {
    try {
        const data = JSON.parse(jsonString);
        if (!Array.isArray(data)) return [];

        return data.map((issue: any) => ({
            ruleId: issue.rule_id || 'swiftlint-rule',
            message: issue.reason || '',
            line: issue.line || 0,
            column: issue.character || 0,
            severity: issue.severity === 'Error' ? 'error' : 'warning',
            category: 'code_smell', // SwiftLint is mostly code smells
            filePath: issue.file || ''
        }));
    } catch (e) {
        console.error('Error parsing SwiftLint report:', e);
        return [];
    }
};

/**
 * Parses LCOV report for coverage data.
 */
export interface CoverageData {
    totalLines: number;
    coveredLines: number;
    percentage: number;
}

export const parseLcovReport = (lcovString: string): Map<string, CoverageData> => {
    const coverageMap = new Map<string, CoverageData>();
    const records = lcovString.split('end_of_record');
    
    records.forEach(record => {
        const fileMatch = record.match(/^SF:(.+)$/m);
        if (!fileMatch) return;
        
        const fileName = fileMatch[1];
        const linesFoundMatch = record.match(/^LF:(\d+)$/m);
        const linesHitMatch = record.match(/^LH:(\d+)$/m);
        
        if (linesFoundMatch && linesHitMatch) {
            const totalLines = parseInt(linesFoundMatch[1], 10);
            const coveredLines = parseInt(linesHitMatch[1], 10);
            coverageMap.set(fileName, {
                totalLines,
                coveredLines,
                percentage: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0
            });
        }
    });
    
    return coverageMap;
};

/**
 * Heuristic to calculate maintainability rating (A-E)
 */
export const calculateMaintainabilityRating = (technicalDebtMinutes: number, totalLinesOfCode: number): string => {
    if (totalLinesOfCode === 0) return 'A';
    
    // Maintainability Index (MI) heuristic inspired by SonarQube
    // Debt density: minutes of debt per line of code
    const density = technicalDebtMinutes / totalLinesOfCode;
    
    if (density < 0.1) return 'A';
    if (density < 0.2) return 'B';
    if (density < 0.5) return 'C';
    if (density < 1.0) return 'D';
    return 'E';
};
