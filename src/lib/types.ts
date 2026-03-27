export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'E' | 'F';

export interface RawModule {
  code: string;
  name: string;
  credits: number;
  type?: 'core' | 'elective';
}

export interface RawSemester {
  semester: number;
  modules: RawModule[];
}

export interface RawProgramme {
  id: string;
  code: string;
  name: string;
  shortName: string;
  faculty: string;
  facultyCode: FacultyKey;
  level: string;
  duration: number;
  durationUnit: string;
  durationSemesters: number;
  description: string;
  semesters: RawSemester[];
}

export type RawProgrammesDataset = RawProgramme[];

export interface GradeState {
  grade: Grade | null;
  excluded: boolean;
}

export type GradesByModuleCode = Record<string, GradeState>;

export interface UIModule {
  code: string;
  name: string;
  credits: number;
}

export interface UISemester {
  id: number;
  name: string;
  modules: UIModule[];
}

export interface UIYear {
  id: number;
  name: string;
  semesters: UISemester[];
}

export type FacultyKey =
  | 'business'
  | 'engineering'
  | 'health'
  | 'hospitality';

export interface UIProgramme {
  id: string;
  code: string;
  name: string;
  faculty: FacultyKey;
  facultyLabel: string;
  level: 'Bachelors' | 'Diploma';
  durationYears: number;
  years: UIYear[];
}
