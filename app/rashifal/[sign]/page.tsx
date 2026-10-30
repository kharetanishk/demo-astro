import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SignReading } from "@/components/rashifal/SignReading";
import { sign, signs } from "@/components/rashifal/signs";

export function generateStaticParams() {
  return signs.map((s) => ({ sign: s.id }));
}

// params are read inside Suspense, so navigations stay instant (Cache Components)
export default function SignPage({ params }: PageProps<"/rashifal/[sign]">) {
  return (
    <Suspense>
      <Reading params={params} />
    </Suspense>
  );
}

async function Reading({ params }: { params: PageProps<"/rashifal/[sign]">["params"] }) {
  const { sign: id } = await params;
  const x = sign(id);
  if (!x) notFound();
  return <SignReading sign={x} />;
}
