import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TaskCard } from "@/components/tasks/TaskCard";

export const metadata = {
  title: "Tasks",
};

export default async function TasksPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const tasks = await prisma.task.findMany({
    where: session.role === "ADMIN" ? {} : {
      project: {
        members: {
          some: { id: session.userId }
        }
      }
    },
    include: {
      project: { select: { title: true } },
    },
    orderBy: [
      { status: "asc" },
      { dueDate: "asc" }
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
      </div>
      
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border rounded-lg bg-white p-8 border-dashed">
          <h3 className="mt-2 text-lg font-semibold text-slate-900">No tasks found</h3>
          <p className="mt-1 text-sm text-slate-500">
            {session.role === "ADMIN" ? "Tasks can be created inside specific projects." : "You don't have any assigned tasks."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} projectName={task.project.title} />
          ))}
        </div>
      )}
    </div>
  );
}
