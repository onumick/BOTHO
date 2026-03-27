import { Grade } from '@/lib/types';

export const GRADE_POINTS: Record<Grade, number> = {
  'A+': 4.0,
  A: 3.75,
  'A-': 3.5,
  'B+': 3.25,
  B: 3.0,
  'B-': 2.75,
  'C+': 2.5,
  C: 2.25,
  'C-': 2.0,
  D: 1.0,
  E: 0.0,
  F: 0.0,
};

export interface ModuleResult {
  code: string;
  name: string;
  credits: number;
  grade: Grade | null;
  excluded: boolean;
}

export function calculateGPA(modules: ModuleResult[]): number {
  const active = modules.filter((module) => !module.excluded && module.grade !== null);
  const totalCredits = active.reduce((sum, module) => sum + module.credits, 0);

  if (totalCredits === 0) {
    return 0;
  }

  const weightedPoints = active.reduce((sum, module) => {
    return sum + GRADE_POINTS[module.grade as Grade] * module.credits;
  }, 0);

  return Math.round((weightedPoints / totalCredits) * 100) / 100;
}

export function calculateCGPA(semesterResults: ModuleResult[][]): number {
  return calculateGPA(semesterResults.flat());
}

export function getHonours(cgpa: number): {
  label: string;
  tier: 'distinction' | 'merit' | 'pass';
} {
  if (cgpa >= 3.5) return { label: 'Distinction', tier: 'distinction' };
  if (cgpa >= 2.75) return { label: 'Merit', tier: 'merit' };
  return { label: 'Pass', tier: 'pass' };
}

export function getGradeFromPercentage(mark: number): Grade | null {
  if (mark >= 90) return 'A+';
  if (mark >= 85) return 'A';
  if (mark >= 80) return 'A-';
  if (mark >= 75) return 'B+';
  if (mark >= 70) return 'B';
  if (mark >= 65) return 'B-';
  if (mark >= 60) return 'C+';
  if (mark >= 55) return 'C';
  if (mark >= 50) return 'C-';
  if (mark >= 40) return 'D';
  if (mark >= 20) return 'E';
  if (mark >= 0) return 'F';
  return null;
}
