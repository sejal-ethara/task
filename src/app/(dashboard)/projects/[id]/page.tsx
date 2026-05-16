import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskCard } from "@/components/tasks/TaskCard";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  return {
    title: project?.title || "Project Details",
  };
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      members: { select: { id: true, name: true, email: true, role: true } },
      tasks: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!project) notFound();

  // Access control
  if (session.role === "MEMBER") {
    const isMember = project.members.some((m: any) => m.id === session.userId);
    if (!isMember) redirect("/projects");
  }

  const isAdmin = session.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
        {isAdmin && <TaskForm projectId={project.id} isAdmin={isAdmin} />}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tasks ({project.tasks.length})</h2>
            {project.tasks.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No tasks have been added to this project yet.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {project.tasks.map((task: any) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Deadline</span>
                <span className="font-medium">
                  {project.deadline ? format(new Date(project.deadline), "MMM d, yyyy") : "None"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all" 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team ({project.members.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.members.map((member: any) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium leading-none">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-1 rounded-md">{member.role}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
