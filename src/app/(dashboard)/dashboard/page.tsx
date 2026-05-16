import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, CheckSquare, Clock, AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { OverviewChart } from "@/components/dashboard/OverviewChart";

export const metadata = {
  title: "Dashboard Overview",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const isAdmin = session.role === "ADMIN";

  const projectWhere = isAdmin ? {} : {
    members: { some: { id: session.userId } }
  };

  const [totalProjects, totalTasks, completedTasks, overdueTasks] = await Promise.all([
    prisma.project.count({ where: projectWhere }),
    prisma.task.count({ where: { project: projectWhere } }),
    prisma.task.count({ where: { project: projectWhere, status: "DONE" } }),
    prisma.task.count({ 
      where: { 
        project: projectWhere, 
        dueDate: { lt: new Date() }, 
        status: { not: "DONE" } 
      } 
    })
  ]);

  // Aggregate task statuses for chart
  const tasksByStatus = await prisma.task.groupBy({
    by: ['status'],
    where: { project: projectWhere },
    _count: { id: true }
  });

  const chartData = [
    { name: "TODO", total: 0 },
    { name: "IN_PROGRESS", total: 0 },
    { name: "REVIEW", total: 0 },
    { name: "DONE", total: 0 }
  ].map(status => {
    const found = tasksByStatus.find(t => t.status === status.name);
    return { ...status, total: found ? found._count.id : 0 };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1 text-sm text-muted-foreground items-center justify-center h-48 border-dashed border-2 rounded-lg">
                <Clock className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p>Activity log will appear here.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
