import { CvData, DesignSettings } from '../../types/CvTypes';

export interface TemplateProps {
    data: CvData;
    design: DesignSettings;
}

export const getStyles = (design: DesignSettings) => ({
    fontFamily: design.font,
    fontSize: design.fontSize === 'small' ? '0.875rem' : design.fontSize === 'medium' ? '1rem' : '1.125rem',
    color: design.textColor,
});
