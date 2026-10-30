"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/ornaments";
import { astrologers } from "./astrologers";
import { DEFAULT_FILTERS, GROUPS, SORTS, applyFilters, narrows, type Filters, type GroupId } from "./filters";
import s from "./FilterSheet.module.css";

type Tab = "sort" | GroupId;

const CLOSE_MS = 240; // matches the sheet's closing animation

/* Sort & Filter: a bottom sheet with the subjects on a rail and their options
   beside them. Changes wait for Apply, which says how many it will show; the
   cross leaves everything as it was. A modal <dialog>, so focus stays inside
   and Esc closes it. */
export function FilterSheet({ filters, query, onApply, onClose }: { filters: Filters; query: string; onApply: (f: Filters) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState(filters);
  const [tab, setTab] = useState<Tab>("sort");
  const [closing, setClosing] = useState(false);
  const count = applyFilters(astrologers, draft, query).length;
  const group = GROUPS.find((g) => g.id === tab);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    d.showModal();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
      if (d.open) d.close();
    };
  }, []);

  function leave(then: () => void) {
    setClosing(true);
    setTimeout(then, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : CLOSE_MS);
  }

  const setPicks = (id: GroupId, picks: string[]) => setDraft({ ...draft, picks: { ...draft.picks, [id]: picks } });

  return (
    <dialog
      ref={dialog}
      className={s.sheet}
      data-closing={closing || undefined}
      aria-labelledby="filter-title"
      onCancel={(e) => {
        e.preventDefault();
        leave(onClose);
      }}
      onClick={(e) => {
        if (e.target === dialog.current) leave(onClose); // the dimmed page behind
      }}
    >
      <header className={s.head}>
        <h2 id="filter-title">Sort &amp; Filter</h2>
        <button type="button" className="icon-btn surface" aria-label="Close" onClick={() => leave(onClose)}>
          <Icon name="close" size={18} />
        </button>
      </header>

      <div className={s.body}>
        <div className={s.rail} role="tablist" aria-orientation="vertical" aria-label="Filter by">
          <button type="button" role="tab" aria-selected={tab === "sort"} className={s.tab} onClick={() => setTab("sort")}>
            Sort by
          </button>
          {GROUPS.map((g) => (
            <button key={g.id} type="button" role="tab" aria-selected={tab === g.id} className={s.tab} onClick={() => setTab(g.id)}>
              {g.label}
              {narrows(draft, g.id) && <span className={s.dot} aria-label="Filter set" />}
            </button>
          ))}
        </div>

        <div key={tab} className={s.pane} role="tabpanel">
          {tab === "sort" &&
            SORTS.map((o) => (
              <label key={o.id} className={s.option}>
                <input type="radio" name="filter-sort" className="sr-only" checked={draft.sort === o.id} onChange={() => setDraft({ ...draft, sort: o.id })} />
                <span className={s.radio} aria-hidden />
                <span className={s.optionText}>{o.label}</span>
              </label>
            ))}

          {group && (
            <>
              {"bulk" in group && (
                <div className={s.bulk}>
                  {group.bulk === "both" && (
                    <>
                      <button type="button" onClick={() => setPicks(group.id, group.options.map((o) => o.value))}>
                        Select all
                      </button>
                      <span aria-hidden>·</span>
                    </>
                  )}
                  <button type="button" onClick={() => setPicks(group.id, [])}>
                    Clear
                  </button>
                </div>
              )}
              {(group.options as readonly { value: string; note?: string }[]).map((o) => {
                const picked = draft.picks[group.id];
                const on = picked.includes(o.value);
                return (
                  <label key={o.value} className={s.option}>
                    <input type="checkbox" className="sr-only" checked={on} onChange={() => setPicks(group.id, on ? picked.filter((x) => x !== o.value) : [...picked, o.value])} />
                    <span className={s.check} aria-hidden>
                      <Icon name="check" size={14} />
                    </span>
                    <span className={s.optionText}>
                      {o.value}
                      {o.note && <small>{o.note}</small>}
                    </span>
                  </label>
                );
              })}
            </>
          )}
        </div>
      </div>

      <footer className={s.foot}>
        <button type="button" className={`btn btn-secondary ${s.reset}`} onClick={() => setDraft(DEFAULT_FILTERS)}>
          Reset
        </button>
        <button type="button" className={`btn btn-primary ${s.apply}`} disabled={count === 0} onClick={() => leave(() => onApply(draft))}>
          {count === 0 ? "No matches" : `Show ${count} astrologer${count === 1 ? "" : "s"}`}
        </button>
      </footer>
    </dialog>
  );
}
