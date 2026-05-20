import { notFound } from "next/navigation";
import { AIPrototypeDemo } from "@/components/ai-research/AIPrototypeDemo";
import { aiResearchModuleList, getAiResearchModuleBySlug, type ModuleId } from "@/data/aiResearch";

type AIResearchModulePageProps = {
  params: Promise<{ module: string }>;
};

export function generateStaticParams() {
  return aiResearchModuleList.map((module) => ({ module: module.slug }));
}

export async function generateMetadata({ params }: AIResearchModulePageProps) {
  const { module: slug } = await params;
  const module = getAiResearchModuleBySlug(slug);

  return {
    title: module ? `${module.title} | AI Research` : "AI Research",
    description: module?.summary,
  };
}

export default async function AIResearchModulePage({ params }: AIResearchModulePageProps) {
  const { module: slug } = await params;
  const module = getAiResearchModuleBySlug(slug);

  if (!module) {
    notFound();
  }

  return <AIPrototypeDemo moduleId={module.id as ModuleId} />;
}
