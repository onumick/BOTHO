import { useMemo, useState } from 'react';
import { CourseManager } from '@/components/CourseManager';
import { Layout } from '@/components/Layout';
import { ResultCard } from '@/components/ResultCard';
import { SearchEngine } from '@/components/SearchEngine';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { FACULTY_STYLES, NORMALIZED_PROGRAMMES } from '@/lib/normalizeProgrammes';
import { GradesByModuleCode, UIProgramme, Grade } from '@/lib/types';

type Step = 'programme' | 'level' | 'grades' | 'result';

function Stepper({ currentStep }: { currentStep: Step }) {
  const steps: Array<{ key: Step; label: string }> = [
    { key: 'programme', label: 'Select Programme' },
    { key: 'level', label: 'Choose Level' },
    { key: 'grades', label: 'Enter Grades' },
    { key: 'result', label: 'View Result' },
  ];

  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft">
      <ol className="grid gap-3 sm:grid-cols-4">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <li key={step.key} className="flex items-center gap-2 text-sm">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  isDone
                    ? 'bg-bu-teal text-white'
                    : isActive
                      ? 'bg-bu-navy text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </span>
              <span className={isActive ? 'font-semibold text-bu-navy' : 'text-slate-600'}>{step.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function HomePage() {
  const [selectedProgrammeId, setSelectedProgrammeId] = useLocalStorage<string | null>(
    'bu_selected_programme',
    null,
  );
  const [activeYear, setActiveYear] = useLocalStorage<number>('bu_active_year', 1);
  const [grades, setGrades] = useLocalStorage<GradesByModuleCode>('bu_grades', {});
  const [studentName, setStudentName] = useLocalStorage<string>('bu_student_name', '');
  
  const [inputMode, setInputMode] = useLocalStorage<'grade' | 'percentage'>('bu_input_mode', 'grade');
  const [percentages, setPercentages] = useLocalStorage<Record<string, string>>('bu_percentages', {});

  const [showResult, setShowResult] = useState(false);

  const selectedProgramme = useMemo<UIProgramme | null>(() => {
    return NORMALIZED_PROGRAMMES.find((programme) => programme.id === selectedProgrammeId) ?? null;
  }, [selectedProgrammeId]);

  const currentStep: Step = (() => {
    if (!selectedProgramme) return 'programme';
    if (showResult) return 'result';
    return 'grades';
  })();

  const onProgrammeSelect = (programme: UIProgramme) => {
    setSelectedProgrammeId(programme.id);
    setActiveYear(1);
    setShowResult(false);
  };

  const onGradeChange = (moduleCode: string, grade: Grade | null) => {
    setGrades((previous) => ({
      ...previous,
      [moduleCode]: {
        grade,
        excluded: previous[moduleCode]?.excluded ?? false,
      },
    }));
  };

  const onExcludeChange = (moduleCode: string, excluded: boolean) => {
    setGrades((previous) => ({
      ...previous,
      [moduleCode]: {
        grade: previous[moduleCode]?.grade ?? null,
        excluded,
      },
    }));
  };

  const startOver = () => {
    setSelectedProgrammeId(null);
    setActiveYear(1);
    setGrades({});
    setPercentages({});
    setStudentName('');
    setShowResult(false);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('bu_selected_programme');
      localStorage.removeItem('bu_active_year');
      localStorage.removeItem('bu_grades');
      localStorage.removeItem('bu_percentages');
      localStorage.removeItem('bu_student_name');
    }
  };

  const safeActiveYear = selectedProgramme?.years.some((year) => year.id === activeYear) ? activeYear : 1;

  return (
    <Layout>
      <div className="space-y-6">
        <Stepper currentStep={currentStep} />

        {!selectedProgramme && (
          <SearchEngine programmes={NORMALIZED_PROGRAMMES} onSelect={onProgrammeSelect} />
        )}

        {selectedProgramme && (
          <section className="rounded-2xl bg-white p-4 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Selected Programme</p>
                <h2 className="font-sora text-xl font-semibold text-bu-navy">{selectedProgramme.name}</h2>
                <p className="text-sm text-slate-600">{selectedProgramme.facultyLabel}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold text-white ${
                  FACULTY_STYLES[selectedProgramme.faculty].colorClass
                }`}
              >
                {FACULTY_STYLES[selectedProgramme.faculty].label}
              </span>
            </div>
          </section>
        )}

        {selectedProgramme && !showResult && (
          <CourseManager
            programme={selectedProgramme}
            activeYear={safeActiveYear}
            onActiveYearChange={setActiveYear}
            grades={grades}
            onGradeChange={onGradeChange}
            onExcludeChange={onExcludeChange}
            onViewResult={() => setShowResult(true)}
            inputMode={inputMode}
            onInputModeChange={setInputMode}
            percentages={percentages}
            onPercentageChange={(code, val) => setPercentages((prev) => ({ ...prev, [code]: val }))}
          />
        )}

        {selectedProgramme && showResult && (
          <ResultCard
            programme={selectedProgramme}
            grades={grades}
            studentName={studentName}
            onStudentNameChange={setStudentName}
            onBack={() => setShowResult(false)}
            onStartOver={startOver}
          />
        )}
      </div>
    </Layout>
  );
}
