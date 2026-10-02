const stages = [
  {
    n: "01",
    title: "Trigger",
    nodes: ["Gmail Trigger", "Get Full Email"],
    text: "A CRM export arriving by email starts the run. The workflow fetches the full message and its attachment.",
  },
  {
    n: "02",
    title: "Transformations",
    nodes: ["Preprocess Data", "Check For Errors", "Run Formatting"],
    text: "Python cleans the export and calculates KPIs. An if-node checks the result; good data is formatted into the report.",
  },
  {
    n: "03",
    title: "Integrations",
    nodes: ["AI Briefing", "Extract Briefing", "Read File"],
    text: "An HTTP request asks an LLM for a short briefing, the text is extracted, and the formatted report file is loaded for sending.",
  },
  {
    n: "04",
    title: "Outcomes",
    nodes: ["Success Email", "Error Email"],
    text: "Stakeholders get the briefing and report by email. Failed checks take the error branch, so exceptions are never silent.",
  },
];

/** The CRM pipeline explained stage by stage, mapped to the nodes in the n8n workflow image above. */
export function CrmWorkflow() {
  return (
    <div>

      <ol className="grid gap-4 md:grid-cols-4" aria-label="How the workflow runs">
        {stages.map((s, i) => (
          <li key={s.n} className="relative rounded-2xl border hairline bg-paper p-5">
            {i < stages.length - 1 ? <span aria-hidden className="absolute -right-4 top-9 hidden h-px w-4 bg-ink/40 md:block" /> : null}
            <p className="font-mono text-[11px] text-signal">{s.n}</p>
            <h4 className="mt-2 font-serif text-2xl">{s.title}</h4>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {s.nodes.map((node) => (
                <li key={node} className={`rounded-md px-2 py-1 font-mono text-[11px] ${node === "Error Email" ? "bg-signal/10 text-[#b3360b]" : "bg-paper-2"}`}>
                  {node}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[14px] leading-6 text-ink-2">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
