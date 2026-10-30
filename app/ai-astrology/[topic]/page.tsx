import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AiChat } from "@/components/ai/AiChat";
import { allTopics, topic } from "@/components/ai/topics";

export function generateStaticParams() {
  return allTopics.map((t) => ({ topic: t.id }));
}

// params are read inside Suspense, so navigations stay instant (Cache Components)
export default function AiChatPage({ params }: PageProps<"/ai-astrology/[topic]">) {
  return (
    <Suspense>
      <Chat params={params} />
    </Suspense>
  );
}

async function Chat({ params }: { params: PageProps<"/ai-astrology/[topic]">["params"] }) {
  const { topic: id } = await params;
  if (!topic(id)) notFound();
  return <AiChat topicId={id} />;
}
