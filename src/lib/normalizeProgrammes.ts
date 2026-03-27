import rawData from '@/data/programmes.json';
import {
  UIProgramme,
  UIYear,
  UISemester,
  FacultyKey,
  RawProgrammesDataset,
} from '@/lib/types';

export const FACULTY_STYLES: Record<FacultyKey, { label: string; colorClass: string }> = {
  business: { label: 'Business & Accounting', colorClass: 'bg-bu-maroon' },
  engineering: { label: 'Engineering & Technology', colorClass: 'bg-bu-orange' },
  health: { label: 'Health & Education', colorClass: 'bg-bu-teal' },
  hospitality: { label: 'Hospitality & Tourism', colorClass: 'bg-bu-gold text-bu-navy' },
};

const dataset = rawData as unknown as RawProgrammesDataset;

function buildYears(rawSemesters: { semester: number; modules: any[] }[], durationYears: number): UIYear[] {
  return Array.from({ length: durationYears }, (_, i) => {
    const yearNumber = i + 1;
    const semesterANumber = yearNumber * 2 - 1;
    const semesterBNumber = yearNumber * 2;

    const semesterA = rawSemesters.find((s) => s.semester === semesterANumber);
    const semesterB = rawSemesters.find((s) => s.semester === semesterBNumber);

    const semesters: UISemester[] = [];

    if (semesterA) {
      semesters.push({
        id: semesterANumber,
        name: `Semester ${semesterANumber}`,
        modules: semesterA.modules.map((m) => ({
          code: m.code,
          name: m.name,
          credits: m.credits,
        })),
      });
    }

    if (semesterB) {
      semesters.push({
        id: semesterBNumber,
        name: `Semester ${semesterBNumber}`,
        modules: semesterB.modules.map((m) => ({
          code: m.code,
          name: m.name,
          credits: m.credits,
        })),
      });
    }

    return {
      id: yearNumber,
      name: `Year ${yearNumber}`,
      semesters,
    };
  });
}

export const NORMALIZED_PROGRAMMES: UIProgramme[] = dataset.map((prog) => {
  return {
    id: prog.id,
    code: prog.code,
    name: prog.name,
    faculty: prog.facultyCode as FacultyKey,
    facultyLabel: prog.faculty,
    level: prog.level as 'Bachelors' | 'Diploma',
    durationYears: prog.duration,
    years: buildYears(prog.semesters, prog.duration),
  };
});
