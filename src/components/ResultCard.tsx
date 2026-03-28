import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { calculateCGPA, getHonours, ModuleResult } from '@/components/GPAEngine';
import { exportResultCard } from '@/components/ExportModule';
import { GradesByModuleCode, UIProgramme } from '@/lib/types';

interface ResultCardProps {
  programme: UIProgramme;
  grades: GradesByModuleCode;
  studentName: string;
  onStudentNameChange: (value: string) => void;
  onBack: () => void;
  onStartOver: () => void;
}

const honoursStyles: Record<string, string> = {
  distinction: 'bg-bu-gold text-bu-navy',
  merit: 'bg-slate-300 text-slate-800',
  pass: 'bg-slate-500 text-white',
};

const gradeDescriptions: Record<string, string> = {
  'A+': 'Outstanding',
  A: 'Excellent',
  'A-': 'Excellent',
  'B+': 'Good',
  B: 'Good',
  'B-': 'Good',
  'C+': 'Satisfactory',
  C: 'Satisfactory',
  'C-': 'Satisfactory',
  D: 'Marginal Fail',
  E: 'Fail',
  F: 'Fail',
};

export function ResultCard({
  programme,
  grades,
  studentName,
  onStudentNameChange,
  onBack,
  onStartOver,
}: ResultCardProps) {
  const { basePath } = useRouter();
  const qrImageSrc = `${basePath}/qr-code.png`;

  const semesterResults = useMemo(() => {
    return programme.years.map((year) =>
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

  const cgpa = calculateCGPA(semesterResults);
  const honours = getHonours(cgpa);

  const stats = useMemo(() => {
    const modules = semesterResults.flat();
    const activeModules = modules.filter((module) => module.grade !== null && !module.excluded);
    const credits = activeModules.reduce((sum, module) => sum + module.credits, 0);
    return {
      modules: activeModules.length,
      activeModulesList: activeModules,
      credits,
      years: programme.durationYears,
    };
  }, [programme.durationYears, semesterResults]);

  return (
    <>
      {/* Hidden container for full report capture */}
      <div
        id="full-report-capture"
        style={{ position: 'absolute', left: '-9999px', top: 0, width: '850px' }}
        className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-12 font-sans text-slate-900"
      >
        {/* Header */}
        <div className="mb-6 flex items-end justify-between border-b-2 border-slate-300 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-bu-navy tracking-tight">Botho University</h1>
            <p className="text-lg text-slate-600 mt-1">GPA Calculation Report</p>
          </div>
          <div className="text-right text-sm text-slate-500 font-medium">
            Generated on {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        {/* Student Details */}
        <div className="mb-6 grid grid-cols-2 gap-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Student Name</p>
            <p className="text-xl font-bold text-bu-navy">{studentName || 'Guest Student'}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Programme</p>
            <p className="text-lg font-semibold text-slate-800 leading-tight">{programme.name}</p>
          </div>
        </div>

        {/* GPA Summary Area */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-[#1c2941] px-8 pt-6 pb-10 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 transform origin-top-right"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300 mb-2">Cumulative GPA</p>
            <p className="font-sora text-7xl font-bold text-bu-gold leading-none pb-1">{cgpa.toFixed(2)}</p>
            <p className="text-sm font-medium text-slate-300 mt-3">out of 4.00</p>
          </div>
          <div className="relative z-10 text-right flex flex-col items-end">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-300 mb-3">Classification</p>
            <div className="inline-flex items-center justify-center rounded-full px-7 pt-3 pb-4 text-lg font-bold bg-transparent text-white border-2 border-bu-gold leading-none">
              {honours.label}
            </div>
          </div>
        </div>

        {/* Module List */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="mb-4 text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
            Graded Modules ({stats.modules})
          </h3>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-2">Code</th>
                <th className="py-3 px-2">Module Name</th>
                <th className="py-3 px-2 text-center">Credits</th>
                <th className="py-3 px-2 text-center">Grade</th>
                <th className="py-3 px-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.activeModulesList.map((m, i) => (
                <tr key={`${m.code}-${i}`} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="py-4 px-2 font-bold text-slate-800 text-xs">{m.code}</td>
                  <td className="py-4 px-2 text-slate-700 font-medium">{m.name}</td>
                  <td className="py-4 px-2 text-center text-slate-600 font-medium">{m.credits}</td>
                  <td className="py-4 px-2 text-center font-bold text-slate-800">
                    <span className="bg-slate-100 px-3 py-1 rounded-md">{m.grade}</span>
                  </td>
                  <td className="py-4 px-2 text-slate-600">{gradeDescriptions[m.grade as string] || '-'}</td>
                </tr>
              ))}
              {stats.activeModulesList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                    No graded modules included in this report.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-3 gap-6">
           <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Credits</p>
               <p className="text-2xl font-bold text-slate-800">{stats.credits}</p>
             </div>
           </div>
           
           <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Modules</p>
               <p className="text-2xl font-bold text-slate-800">{stats.modules}</p>
             </div>
           </div>
           
           <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Duration</p>
               <p className="text-2xl font-bold text-slate-800">{programme.durationYears} Years</p>
             </div>
           </div>
        </div>

        {/* Footer / QR Code */}
        <div className="flex items-center justify-start gap-6 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="h-24 w-24 bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
               <img 
                 src={qrImageSrc}
                 alt="Scan to calculate yours" 
                 className="h-full w-full object-contain" 
               />
          </div>
          <div>
              <p className="text-xl font-bold text-slate-900">Scan me to calculate your GPA on any device!</p>
              <p className="text-sm text-slate-600 mt-1">
                Access the Botho University GPA calculator on any device!
              </p>
              <p className="text-sm text-slate-500 mt-1 mt-2">100% Private & Browser-based</p>
          </div>
        </div>
      </div>

    <section className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <div className="relative bg-gradient-to-b from-bu-navy to-bu-teal px-5 py-10 text-white sm:px-10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-bu-gold/30" />
        <div className="absolute -left-12 bottom-6 h-28 w-28 rounded-full border border-white/10" />

        <div id="result-card-capture" className="relative rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-200">Cumulative GPA</p>
          <p className="mt-2 font-sora text-6xl font-bold leading-none text-white sm:text-7xl">{cgpa.toFixed(2)}</p>
          <p className="mt-2 text-sm text-slate-200">out of 4.00</p>

          <p className={`mt-5 inline-flex rounded-full px-4 py-1 text-sm font-bold ${honoursStyles[honours.tier]}`}>
            {honours.label}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-slate-100">
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.1em]">Modules</p>
              <p className="font-sora text-xl font-semibold">{stats.modules}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.1em]">Credits</p>
              <p className="font-sora text-xl font-semibold">{stats.credits}</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3">
              <p className="text-xs uppercase tracking-[0.1em]">Years</p>
              <p className="font-sora text-xl font-semibold">{stats.years}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 bg-bu-cream px-5 py-6 sm:px-10">
        <div className="rounded-2xl border border-bu-teal/30 bg-bu-teal/10 p-3 text-sm text-slate-700">
          🔒 Your data is processed locally in your browser.
        </div>

        <div>
          <label htmlFor="student-name" className="mb-1 block text-sm font-semibold text-bu-navy">
            Student Name
          </label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={(event) => onStudentNameChange(event.target.value)}
            placeholder="Enter your name for PDF card"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-bu-navy"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl bg-bu-navy px-5 py-3 font-semibold text-white transition hover:brightness-110"
            onClick={() => exportResultCard('full-report-capture', studentName)}
          >
            Download Result Card (PNG)
          </button>

          <button
            type="button"
            className="rounded-xl border border-slate-400 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            onClick={onBack}
          >
            Back to Grades
          </button>

          <button
            type="button"
            className="rounded-xl border border-slate-400 px-4 py-3 text-slate-700 hover:bg-slate-100"
            onClick={onStartOver}
          >
            Start Over
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
