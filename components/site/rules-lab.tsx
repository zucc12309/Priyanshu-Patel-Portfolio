"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";

type Input = { age: number; salaryL: number; multiple: number; nominee: boolean; pan: string; midTerm: boolean };
type Verdict = "PASS" | "FAIL" | "REFER" | "INFO";
type Check = { id: string; rule: string; verdict: Verdict; code?: string; detail: string };

// Illustrative rules written for this demo — not Digit Life's production rules.
function evaluate(i: Input): { checks: Check[]; decision: "ISSUED" | "REFERRED" | "REJECTED"; status: number } {
  const sa = i.salaryL * i.multiple;
  const checks: Check[] = [
    { id: "R1", rule: "Entry age 18–65", verdict: i.age >= 18 && i.age <= 65 ? "PASS" : "FAIL", code: "AGE_OUT_OF_RANGE", detail: `Member age ${i.age}` },
    { id: "R2", rule: "Cover ≤ 30× annual salary", verdict: i.multiple <= 30 ? "PASS" : "FAIL", code: "SA_EXCEEDS_SALARY_MULTIPLE", detail: `${i.multiple}× salary` },
    { id: "R3", rule: "Valid PAN format", verdict: /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(i.pan) ? "PASS" : "FAIL", code: "INVALID_PAN_FORMAT", detail: i.pan || "empty" },
    { id: "R4", rule: "Nominee captured", verdict: i.nominee ? "PASS" : "FAIL", code: "NOMINEE_MISSING", detail: i.nominee ? "Nominee on record" : "No nominee" },
    { id: "R5", rule: "Free cover limit ₹50L", verdict: sa <= 50 ? "PASS" : "REFER", code: "UW_REFERRAL_FCL", detail: `Sum assured ₹${sa.toLocaleString("en-IN")}L` },
    { id: "R6", rule: "Age 55+ with cover above ₹25L", verdict: i.age > 55 && sa > 25 ? "REFER" : "PASS", code: "UW_REFERRAL_AGE_SA", detail: i.age > 55 ? "Senior member" : "Below 55" },
    { id: "R7", rule: "Mid-term joiner pro-rating", verdict: "INFO", detail: i.midTerm ? "Premium pro-rated from date of joining" : "Full-term premium" },
  ];
  const fail = checks.some((c) => c.verdict === "FAIL");
  const refer = checks.some((c) => c.verdict === "REFER");
  return { checks, decision: fail ? "REJECTED" : refer ? "REFERRED" : "ISSUED", status: fail ? 422 : refer ? 202 : 201 };
}

const uat: { name: string; input: Input; expect: "ISSUED" | "REFERRED" | "REJECTED" }[] = [
  { name: "Happy path", input: { age: 32, salaryL: 12, multiple: 3, nominee: true, pan: "ABCDE1234F", midTerm: false }, expect: "ISSUED" },
  { name: "Age below entry band", input: { age: 17, salaryL: 4, multiple: 2, nominee: true, pan: "ABCDE1234F", midTerm: false }, expect: "REJECTED" },
  { name: "Cover above free cover limit", input: { age: 40, salaryL: 30, multiple: 2, nominee: true, pan: "ABCDE1234F", midTerm: false }, expect: "REFERRED" },
  { name: "Senior member, high cover", input: { age: 58, salaryL: 10, multiple: 3, nominee: true, pan: "ABCDE1234F", midTerm: true }, expect: "REFERRED" },
  { name: "Malformed PAN", input: { age: 29, salaryL: 8, multiple: 2, nominee: true, pan: "ABC1234", midTerm: false }, expect: "REJECTED" },
  { name: "Missing nominee", input: { age: 45, salaryL: 6, multiple: 2, nominee: false, pan: "ABCDE1234F", midTerm: false }, expect: "REJECTED" },
];

const tone: Record<Verdict, string> = {
  PASS: "bg-[#1fbf5b]/15 text-[#178a43]",
  FAIL: "bg-signal/15 text-[#c4380a]",
  REFER: "bg-[#f5b14c]/25 text-[#8a5a09]",
  INFO: "bg-ink/10 text-mute",
};

export function RulesLab() {
  const [input, setInput] = useState<Input>(uat[0].input);
  const [ran, setRan] = useState<boolean[] | null>(null);
  const result = useMemo(() => evaluate(input), [input]);
  const set = <K extends keyof Input>(k: K, v: Input[K]) => setInput((prev) => ({ ...prev, [k]: v }));

  const body =
    result.decision === "REJECTED"
      ? { status: "rejected", errors: result.checks.filter((c) => c.verdict === "FAIL").map((c) => ({ code: c.code, rule: c.id })) }
      : result.decision === "REFERRED"
        ? { status: "referred", queue: "underwriting", reasons: result.checks.filter((c) => c.verdict === "REFER").map((c) => c.code) }
        : { status: "issued", sumAssuredLakh: input.salaryL * input.multiple, proRated: input.midTerm };

  return (
    <div className="mt-20 rounded-3xl border hairline bg-paper-2/60 p-5 sm:p-8" data-reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-mute">Try my job</p>
          <h3 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">
            Validate a Group Life <span className="italic">enrolment.</span>
          </h3>
          <p className="mt-2 max-w-xl text-[15px] leading-6 text-mute">
            The kind of thing I specify every week: business rules, an underwriting referral path and the API contract that goes with them. Change the inputs and watch the rules fire.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRan(uat.map((t) => evaluate(t.input).decision === t.expect))}
          className="btn btn-ink h-11"
        >
          <Play className="size-4" aria-hidden /> Run UAT suite
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)_minmax(0,4fr)]">
        {/* Inputs */}
        <fieldset className="space-y-5">
          <legend className="label text-mute">Member record</legend>
          <Range label="Age" value={input.age} min={16} max={75} suffix="yrs" onChange={(v) => set("age", v)} />
          <Range label="Annual salary" value={input.salaryL} min={2} max={60} prefix="₹" suffix="L" onChange={(v) => set("salaryL", v)} />
          <Range label="Cover multiple" value={input.multiple} min={1} max={40} suffix="× salary" onChange={(v) => set("multiple", v)} />
          <label className="block text-[13px]">
            PAN
            <input
              value={input.pan}
              onChange={(e) => set("pan", e.target.value.toUpperCase().slice(0, 10))}
              className="mt-1 h-11 w-full border-b border-ink/25 bg-transparent font-mono text-base tracking-widest outline-none focus:border-signal"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Toggle label="Nominee added" on={input.nominee} onChange={(v) => set("nominee", v)} />
            <Toggle label="Joined mid-term" on={input.midTerm} onChange={(v) => set("midTerm", v)} />
          </div>
        </fieldset>

        {/* Rule trace */}
        <div>
          <p className="label text-mute">Rule trace</p>
          <ol className="mt-3 divide-y hairline rounded-2xl border hairline bg-paper" aria-live="polite">
            {result.checks.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-4 py-3">
                <span className="font-mono text-[11px] text-mute">{c.id}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px]">{c.rule}</span>
                  <span className="block truncate text-[12px] text-mute">{c.detail}</span>
                </span>
                <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] transition-colors ${tone[c.verdict]}`}>{c.verdict}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Decision + API contract */}
        <div>
          <p className="label text-mute">Decision</p>
          <p className={`mt-3 font-serif text-5xl tracking-tight ${result.decision === "ISSUED" ? "text-[#178a43]" : result.decision === "REFERRED" ? "text-[#8a5a09]" : "text-signal"}`}>
            {result.decision === "ISSUED" ? "Issued" : result.decision === "REFERRED" ? "Referred" : "Rejected"}
          </p>
          <pre className="mt-4 overflow-x-auto rounded-2xl bg-ink p-4 font-mono text-[12px] leading-5 text-paper/85">
            <span className="text-paper/50">POST /v1/group-life/enrolments</span>
            {"\n"}
            <span className="text-signal">HTTP {result.status}</span>
            {"\n"}
            {JSON.stringify(body, null, 2)}
          </pre>
        </div>
      </div>

      {ran ? (
        <div className="fade-up mt-8 rounded-2xl border hairline bg-paper p-4" role="status">
          <p className="flex items-center justify-between text-[14px]">
            <span>UAT suite</span>
            <span className="font-mono text-[13px]">
              {ran.filter(Boolean).length}/{ran.length} passed
            </span>
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {uat.map((t, i) => (
              <li key={t.name}>
                <button type="button" onClick={() => setInput(t.input)} className="flex w-full items-center justify-between gap-2 rounded-xl border hairline px-3 py-2 text-left text-[13px] hover:border-ink">
                  <span>{t.name}</span>
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${ran[i] ? tone.PASS : tone.FAIL}`}>{t.expect}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[12px] text-mute">Click a case to load it into the form.</p>
        </div>
      ) : null}

      <p className="mt-6 text-[12px] text-mute">Illustrative rules written for this demo — not Digit Life&apos;s production rules or data.</p>
    </div>
  );
}

function Range({ label, value, min, max, prefix = "", suffix, onChange }: { label: string; value: number; min: number; max: number; prefix?: string; suffix: string; onChange: (v: number) => void }) {
  return (
    <label className="block text-[13px]">
      <span className="flex justify-between">
        {label}
        <span className="font-mono tabular-nums">
          {prefix}
          {value} {suffix}
        </span>
      </span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[#FF4D12]" />
    </label>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className={`h-10 rounded-full border px-4 text-[13px] transition-colors ${on ? "border-ink bg-ink text-paper" : "hairline"}`}>
      {label}
    </button>
  );
}
