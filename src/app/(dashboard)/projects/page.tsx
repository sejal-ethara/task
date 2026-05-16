import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const isAdmin = session.role === "ADMIN";

  const projects = await prisma.project.findMany({
    where: isAdmin ? {} : {
      members: {
        some: { id: session.userId }
      }
    },
    include: {
      _count: { select: { tasks: true, members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        {isAdmin && <ProjectForm isAdmin={isAdmin} />}
      </div>
      
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg bg-white p-8 border-dashed">
          <h3 className="mt-2 text-lg font-semibold text-slate-900">No projects found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {isAdmin ? "Get started by creating a new project." : "You haven't been assigned to any projects yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
