import config from '../config';

/**
 * 
 * @param {string} semesterId 
 * @param {string} subjectId 
 * @returns 
 */
export const getTemplateDlLink = (subjectId, sectionId) => {
    return `${config.api}/teacher/grades/download/template?subject_id=${subjectId}&section_id=${sectionId}`;
};