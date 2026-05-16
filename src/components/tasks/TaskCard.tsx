"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { format } from "date-fns";
import { Task } from "@prisma/client";
import { Clock } from "lucide-react";

const priorityColors = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

const statusColors = {
  TODO: "bg-slate-100 text-slate-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  REVIEW: "bg-purple-100 text-purple-800",
  DONE: "bg-green-100 text-green-800",
};

export function TaskCard({ task, projectName }: { task: Task; projectName?: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base line-clamp-2">{task.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {task.description || "No description."}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-md font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-md font-medium ${statusColors[task.status]}`}>
            {task.status.replace("_", " ")}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 pt-4 border-t">
          {projectName ? (
            <span className="font-medium text-slate-700 truncate max-w-[120px]">
              {projectName}
            </span>
          ) : (
            <span />
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), "MMM d")}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
