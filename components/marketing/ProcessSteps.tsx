/**
 * 01/02/03 markers appear in exactly two places site-wide, both genuine sequences — SPEC §6.4.
 * This is one of them. Numbered markers on a non-sequence are the clearest tell of a
 * templated design, so they are not used anywhere else.
 */
export function ProcessSteps({
  steps,
}: {
  steps: readonly { n: string; title: string; body: string }[];
}) {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <li key={step.n} className="border-t border-navy-600 pt-5">
          <span className="tabular block text-[0.875rem] font-medium text-blue-300">
            {step.n}
          </span>
          <h3 className="mt-3 text-[1.125rem] text-white">{step.title}</h3>
          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-white/70">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
