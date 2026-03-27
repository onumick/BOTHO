import { useMemo } from 'react';
import { calculateGPA, GRADE_POINTS, ModuleResult, getGradeFromPercentage } from '@/components/GPAEngine';
import { GradesByModuleCode, Grade, UIProgramme } from '@/lib/types';

interface CourseManagerProps {
  programme: UIProgramme;
  activeYear: number;
  onActiveYearChange: (year: number) => void;
  grades: GradesByModuleCode;
  onGradeChange: (moduleCode: string, grade: Grade | null) => void;
  onExcludeChange: (moduleCode: string, excluded: boolean) => void;
  onViewResult: () => void;
  inputMode: 'grade' | 'percentage';
  onInputModeChange: (mode: 'grade' | 'percentage') => void;
  percentages: Record<string, string>;
  onPercentageChange: (moduleCode: string, percentage: string) => void;
}

const gradeOptions: { value: Grade; label: string }[] = [
  { value: 'A+', label: 'A+ (4.0)' },
  { value: 'A', label: 'A (3.75)' },
  { value: 'A-', label: 'A- (3.5)' },
  { value: 'B+', label: 'B+ (3.25)' },
  { value: 'B', label: 'B (3.0)' },
  { value: 'B-', label: 'B- (2.75)' },
  { value: 'C+', label: 'C+ (2.5)' },
  { value: 'C', label: 'C (2.25)' },
  { value: 'C-', label: 'C- (2.0)' },
  { value: 'D', label: 'D (1.0)' },
  { value: 'E', label: 'E (0.0)' },
  { value: 'F', label: 'F (0.0)' },
];

function truncateName(name: string) {
  if (name.length <= 40) return name;
  return `${name.slice(0, 40)}...`;
}

export function CourseManager({
  programme,
  activeYear,
  onActiveYearChange,
  grades,
  onGradeChange,
  onExcludeChange,
  onViewResult,
  inputMode,
  onInputModeChange,
  percentages,
  onPercentageChange,
}: CourseManagerProps) {
  const allProgrammeModules = useMemo(() => {
    return programme.years.flatMap((year) =>
      year.semesters.flatMap((semester) =>
        semester.modules.map((module) => {
          const state = grades[module.code] ?? { grade: null, excluded: false };
          return {
            code: module.code,
            name: module.name,
            credits: module.credits,
            grade: state.grade,
            excluded: state.excluded,
          } satisfies ModuleResult;
        }),
      ),
    );
  }, [grades, programme.years]);

  const gradedCount = allProgrammeModules.filter((module) => module.grade !== null).length;
  const activeCount = allProgrammeModules.filter((module) => module.grade !== null && !module.excluded).length;
  const runningGPA = calculateGPA(allProgrammeModules);

  const currentYear = programme.years.find((year) => year.id === activeYear) ?? programme.years[0];

  return (
    <section className="space-y-5">
      <div className="sticky top-3 z-10 rounded-2xl bg-bu-navy px-4 py-4 text-white shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Running GPA</p>
            <p className="text-sm text-slate-200">
              {currentYear.name} · {gradedCount} modules graded
            </p>
          </div>

          <div aria-live="polite" className="text-right">
            <p className="font-sora text-3xl font-bold text-bu-gold">{runningGPA.toFixed(2)}</p>
            <p className="text-xs text-slate-200">
              {activeCount === 0 ? 'No modules active' : `${activeCount} active modules`}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft sm:p-6">
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-slate-500">Choose Level</p>
        <div className="flex flex-wrap gap-2">
          {programme.years.map((year) => (
            <button
              key={year.id}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                year.id === currentYear.id
                  ? 'bg-bu-navy text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              onClick={() => onActiveYearChange(year.id)}
            >
              {year.name}
            </button>
          ))}
        </div>        
        <div className="flex items-center gap-2 rounded-xl bg-white p-2 shadow-soft border border-slate-100 text-sm">
           <button
             type="button"
             className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${inputMode === 'grade' ? 'bg-bu-teal/10 text-bu-teal' : 'text-slate-500 hover:bg-slate-50'}`}
             onClick={() => onInputModeChange('grade')}
           >
             Use Grades
           </button>
           <button
             type="button"
             className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${inputMode === 'percentage' ? 'bg-bu-teal/10 text-bu-teal' : 'text-slate-500 hover:bg-slate-50'}`}
             onClick={() => onInputModeChange('percentage')}
           >
             Use Percentages %
           </button>
        </div>      </div>

      <div className="space-y-6">
        {currentYear.semesters.map((semester) => (
          <article key={semester.id} className="rounded-2xl bg-white p-4 shadow-soft sm:p-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {semester.name}
            </h3>

            {semester.modules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                Module data coming soon.
              </div>
            ) : (
              <>
                <div className="hidden sm:block">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.1em] text-slate-500">
                          <th className="px-2 py-2">Module</th>
                          <th className="px-2 py-2">Credits</th>
                          <th className="px-2 py-2">Grade</th>
                          <th className="px-2 py-2 text-right">Points</th>
                          <th className="px-2 py-2 text-center">Retake / Exclude</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.modules.map((module) => {
                          const state = grades[module.code] ?? { grade: null, excluded: false };
                          const points = state.grade ? GRADE_POINTS[state.grade] : null;

                          return (
                            <tr key={`${semester.id}-${module.code}`} className="border-b border-slate-100">
                              <td className="px-2 py-3">
                                <p className="font-semibold text-bu-navy">{module.code}</p>
                                <p title={module.name} className="text-slate-600">
                                  {truncateName(module.name)}
                                </p>
                              </td>
                              <td className="px-2 py-3">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                  {module.credits}
                                </span>
                              </td>
                              <td className="px-2 py-3">
                                <label className="sr-only" htmlFor={`${semester.id}-${module.code}-grade`}>
                                  Grade for {module.code}
                                </label>
                                {inputMode === 'percentage' ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      id={`${semester.id}-${module.code}-percentage`}
                                      min="0"
                                      max="100"
                                      placeholder="%"
                                      value={percentages[module.code] ?? ''}
                                      onChange={(event) => {
                                        let val = event.target.value;
                                        if (parseFloat(val) > 100) val = '100';
                                        if (parseFloat(val) < 0) val = '0';
                                        onPercentageChange(module.code, val);
                                        if (val === '') {
                                          onGradeChange(module.code, null);
                                        } else {
                                          const num = parseFloat(val);
                                          if (!isNaN(num) && num >= 0 && num <= 100) {
                                            const newGrade = getGradeFromPercentage(num);
                                            onGradeChange(module.code, newGrade);
                                          } else if (isNaN(num)) {
                                            onGradeChange(module.code, null);
                                          }
                                        }
                                      }}
                                      className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-bu-navy focus:outline-none"
                                    />
                                    {state.grade && (
                                      <span className="inline-block rounded-md bg-bu-teal/10 px-2 py-1 text-xs font-bold text-bu-teal w-12 text-center">
                                        {state.grade}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <select
                                    id={`${semester.id}-${module.code}-grade`}
                                    value={state.grade ?? ''}
                                    className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-bu-navy focus:outline-none"
                                    onChange={(event) =>
                                      onGradeChange(module.code, (event.target.value as Grade) || null)
                                    }
                                  >
                                    <option value="">Select</option>
                                    {gradeOptions.map((grade) => (
                                      <option key={grade.value} value={grade.value}>
                                        {grade.label}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>
                              <td className="px-2 py-3 text-right font-bold text-bu-navy">
                                {points === null ? '—' : points.toFixed(1)}
                              </td>
                              <td className="px-2 py-3 text-center">
                                <label className="inline-flex cursor-pointer items-center justify-center gap-2 text-xs text-slate-600">
                                  <input
                                    type="checkbox"
                                    checked={state.excluded}
                                    onChange={(event) => onExcludeChange(module.code, event.target.checked)}
                                  />
                                  Exclude
                                </label>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-3 sm:hidden">
                  {semester.modules.map((module) => {
                    const state = grades[module.code] ?? { grade: null, excluded: false };
                    const points = state.grade ? GRADE_POINTS[state.grade] : null;

                    return (
                      <div key={`${semester.id}-${module.code}`} className="rounded-xl border border-slate-200 p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-bu-navy">{module.code}</p>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {module.credits} credits
                          </span>
                        </div>

                        <p title={module.name} className="mb-3 text-sm text-slate-700">
                          {truncateName(module.name)}
                        </p>

                        <div className="flex items-center gap-2">
                          <label className="sr-only" htmlFor={`${semester.id}-${module.code}-grade-mobile`}>
                            Grade for {module.code}
                          </label>
                          
                          {inputMode === 'percentage' ? (
                            <div className="flex w-full items-center gap-2">
                              <input
                                type="number"
                                id={`${semester.id}-${module.code}-percentage-mobile`}
                                min="0"
                                max="100"
                                placeholder="%"
                                value={percentages[module.code] ?? ''}
                                onChange={(event) => {
                                  let val = event.target.value;
                                  if (parseFloat(val) > 100) val = '100';
                                  if (parseFloat(val) < 0) val = '0';
                                  onPercentageChange(module.code, val);
                                  if (val === '') {
                                    onGradeChange(module.code, null);
                                  } else {
                                    const num = parseFloat(val);
                                    if (!isNaN(num) && num >= 0 && num <= 100) {
                                      const newGrade = getGradeFromPercentage(num);
                                      onGradeChange(module.code, newGrade);
                                    } else if (isNaN(num)) {
                                      onGradeChange(module.code, null);
                                    }
                                  }
                                }}
                                className="w-full shrink rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-bu-navy focus:outline-none"
                              />
                              {state.grade && (
                                <span className="inline-block rounded-md bg-bu-teal/10 px-2 py-1 text-xs font-bold text-bu-teal mt-0">
                                  {state.grade}
                                </span>
                              )}
                            </div>
                          ) : (
                            <select
                              id={`${semester.id}-${module.code}-grade-mobile`}
                              value={state.grade ?? ''}
                              className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm"
                              onChange={(event) => onGradeChange(module.code, (event.target.value as Grade) || null)}
                            >
                              <option value="">Select grade</option>
                              {gradeOptions.map((grade) => (
                                <option key={grade.value} value={grade.value}>
                                  {grade.label}
                                </option>
                              ))}
                            </select>
                          )}

                          <p className="w-12 text-right font-bold text-bu-navy">{points === null ? '—' : points}</p>

                          <label className="flex items-center gap-1 text-xs text-slate-600">
                            <input
                              type="checkbox"
                              checked={state.excluded}
                              onChange={(event) => onExcludeChange(module.code, event.target.checked)}
                            />
                            Excl.
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          {activeCount === 0 ? 'No modules active for GPA calculation yet.' : 'GPA updates instantly as you enter grades.'}
        </p>
        <button
          type="button"
          className="rounded-xl bg-bu-gold px-5 py-3 font-semibold text-bu-navy transition hover:brightness-95"
          onClick={onViewResult}
        >
          View My Result →
        </button>
      </div>
    </section>
  );
}
