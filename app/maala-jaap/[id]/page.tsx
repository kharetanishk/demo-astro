import { Suspense } from "react";
import { notFound } from "next/navigation";
import { JaapSession } from "@/components/jaap/JaapSession";
import { mantra, mantras } from "@/components/jaap/mantras";

export function generateStaticParams() {
  return mantras.map((m) => ({ id: m.id }));
}

// params are read inside Suspense, so navigations stay instant (Cache Components)
export default function JaapSessionPage({ params }: PageProps<"/maala-jaap/[id]">) {
  return (
    <Suspense>
      <Session params={params} />
    </Suspense>
  );
}

async function Session({ params }: { params: PageProps<"/maala-jaap/[id]">["params"] }) {
  const { id } = await params;
  if (!mantra(id)) notFound();
  return <JaapSession id={id} />;
}
