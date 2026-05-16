"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { Users, CheckSquare, Clock } from "lucide-react";
import { Project } from "@prisma/client";

interface ProjectWithCounts extends Project {
  _count: {
    tasks: number;
    members: number;
  };
}

export function ProjectCard({ project }: { project: ProjectWithCounts }) {
  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-1">{project.title}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-[40px]">
            {project.description || "No description provided."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {project.deadline ? `Due ${format(new Date(project.deadline), "MMM d, yyyy")}` : "No deadline"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{project._count?.members || 0} Members</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              <span>{project._count?.tasks || 0} Tasks</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
