'use client';

import { useMemo, useState } from 'react';
import {
  AGE_GROUPS,
  LENGTHS,
  SUBJECTS,
  generateTest,
  scoreQuiz,
  scorePercentile,
  scoreTier,
  type AgeGroupId,
  type LengthId,
  type Question,
  type SubjectId,
  type TopicResult,
} from '@/lib/diagnostic/questions';
import { StartScreen } from './StartScreen';
import { LeadScreen } from './LeadScreen';
import { QuizScreen } from './QuizScreen';
import { ResultsScreen } from './ResultsScreen';

// Layout direction is a build-time flag, not a user toggle.
// 'A' = centered card, 'B' = split navy/white panel. Flip here (or wire to a feature flag).
const LAYOUT: 'A' | 'B' = 'A';

type Screen = 'start' | 'lead' | 'quiz' | 'results';

export function DiagnosticTest() {
  const [screen, setScreen] = useState<Screen>('start');
  const [ageGroup, setAgeGroup] = useState<AgeGroupId>('elementary');
  const [subject, setSubject] = useState<SubjectId>('math');
  const [length, setLength] = useState<LengthId>(12);

  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [leadError, setLeadError] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const [score, setScore] = useState(0);
  const [percentile, setPercentile] = useState(0);
  const [topicBreakdown, setTopicBreakdown] = useState<TopicResult[]>([]);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [emailedOk, setEmailedOk] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const ageLabel = AGE_GROUPS.find((g) => g.id === ageGroup)?.label ?? '';
  const subjectLabel = SUBJECTS.find((s) => s.id === subject)?.label ?? '';
  const configSummary = `${ageLabel} · ${subjectLabel} · ${length} Questions`;

  const progressPct = useMemo(() => {
    if (screen !== 'quiz' || questions.length === 0) return 0;
    return Math.round((currentIndex / questions.length) * 100);
  }, [screen, questions.length, currentIndex]);

  const progressLabel =
    questions.length > 0
      ? `Question ${Math.min(currentIndex + 1, questions.length)} of ${questions.length}`
      : '';

  const handleChangeField = (field: string, value: string) => {
    setLeadError('');
    if (field === 'parentName') setParentName(value);
    else if (field === 'studentName') setStudentName(value);
    else if (field === 'studentGrade') setStudentGrade(value);
    else if (field === 'email') setEmail(value);
    else if (field === 'phone') setPhone(value);
  };

  const startQuiz = () => {
    if (!parentName.trim() || !studentName.trim() || !email.trim()) {
      setLeadError('Please fill in parent name, student name, and email to begin.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setLeadError('Please enter a valid email address.');
      return;
    }
    const qs = generateTest(ageGroup, subject, length);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentIndex(0);
    setSelectedChoice(null);
    setScreen('quiz');
  };

  const nextQuestion = () => {
    if (selectedChoice === null) return;
    const nextAnswers = answers.slice();
    nextAnswers[currentIndex] = selectedChoice;
    if (currentIndex + 1 < questions.length) {
      setAnswers(nextAnswers);
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
    } else {
      finishQuiz(nextAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: Array<number | null>) => {
    setAnswers(finalAnswers);
    const { score: finalScore, topicBreakdown: breakdown } = scoreQuiz(
      questions,
      finalAnswers,
    );
    const tier = scoreTier(finalScore);
    setScore(finalScore);
    setPercentile(scorePercentile(finalScore));
    setTopicBreakdown(breakdown);
    setScreen('results');
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/diagnostic/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName.trim(),
          studentName: studentName.trim(),
          studentGrade: studentGrade.trim() || null,
          email: email.trim(),
          phone: phone.trim() || null,
          ageGroup,
          subject,
          length,
          score: finalScore,
          tier: tier.label,
          topicBreakdown: breakdown,
          answers: questions.map((q, i) => ({
            prompt: q.prompt,
            topic: q.topic,
            choices: q.choices,
            correctIndex: q.correctIndex,
            selectedIndex: finalAnswers[i],
          })),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || 'Submission failed');
      }
      const body = (await res.json()) as { id: string; emailed: boolean };
      setLeadId(body.id);
      setEmailedOk(body.emailed);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not save results. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setScreen('start');
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedChoice(null);
    setQuestions([]);
    setScore(0);
    setPercentile(0);
    setTopicBreakdown([]);
    setLeadId(null);
    setEmailedOk(false);
    setSubmitError('');
  };

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams();
    if (parentName.trim()) params.set('name', parentName.trim());
    if (email.trim()) params.set('email', email.trim());
    if (leadId) params.set('ref', `diagnostic:${leadId}`);
    const q = params.toString();
    return q ? `/contact?${q}` : '/contact';
  }, [parentName, email, leadId]);

  return (
    <div className="min-h-screen flex flex-col">
      {screen === 'quiz' && questions.length > 0 && (
        <div className="sticky top-0 z-10 bg-card border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-end gap-3">
            <div className="w-40 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground font-semibold whitespace-nowrap">
              {progressLabel}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-stretch justify-center">
        {screen === 'start' && (
          <StartScreen
            layout={LAYOUT}
            ageGroup={ageGroup}
            subject={subject}
            length={length}
            onSelectAge={setAgeGroup}
            onSelectSubject={setSubject}
            onSelectLength={setLength}
            onStart={() => setScreen('lead')}
          />
        )}
        {screen === 'lead' && (
          <LeadScreen
            parentName={parentName}
            studentName={studentName}
            studentGrade={studentGrade}
            email={email}
            phone={phone}
            error={leadError}
            summary={configSummary}
            onChangeField={handleChangeField}
            onSubmit={startQuiz}
            onBack={() => setScreen('start')}
          />
        )}
        {screen === 'quiz' && questions[currentIndex] && (
          <QuizScreen
            question={questions[currentIndex]}
            selected={selectedChoice}
            isLast={currentIndex + 1 >= questions.length}
            onSelect={setSelectedChoice}
            onNext={nextQuestion}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            layout={LAYOUT}
            studentName={studentName}
            email={email}
            score={score}
            percentile={percentile}
            testLength={length}
            tier={scoreTier(score)}
            topics={topicBreakdown}
            emailed={emailedOk}
            submitting={submitting}
            error={submitError}
            bookingHref={bookingHref}
            onRestart={restart}
          />
        )}
      </div>
    </div>
  );
}
