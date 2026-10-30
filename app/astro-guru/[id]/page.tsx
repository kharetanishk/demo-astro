import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GuruProfile } from "@/components/guru/GuruProfile";
import { astrologer, astrologers } from "@/components/guru/astrologers";

export function generateStaticParams() {
  return astrologers.map((a) => ({ id: a.id }));
}

// params are read inside Suspense, so navigations stay instant (Cache Components)
export default function GuruPage({ params }: PageProps<"/astro-guru/[id]">) {
  return (
    <Suspense>
      <Guru params={params} />
    </Suspense>
  );
}

async function Guru({ params }: { params: PageProps<"/astro-guru/[id]">["params"] }) {
  const { id } = await params;
  if (!astrologer(id)) notFound();
  return <GuruProfile id={id} />;
}
