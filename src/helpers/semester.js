export const formatSemester = (semester) => {
    const { sy_start_year, sy_end_year, term } = semester || {};
    return `S.Y. ${sy_start_year} - ${sy_end_year} | ${term === 1 ? '1st' : '2nd'} Semester`;
};