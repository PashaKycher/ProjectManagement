import type { Project } from "@/types";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { cn } from "@/lib/utils";
import { getTaskStatusColor, statusTranslation } from "@/lib";
import { Progress } from "../ui/progress";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  progress: number;
  workspaceId: string;
}

export const ProjectCard = ({ project, progress, workspaceId }: ProjectCardProps) => {
  return (
    <Link to={`/workspace/${workspaceId}/project/${project._id}`}>
      <Card className="transition-all duration-300 hover:shadow-md hover:translate-y-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.title}</CardTitle>

            <span className={cn("text-xs rounded-full px-1.5", getTaskStatusColor(project.status))}>{statusTranslation(project.status)}</span>
          </div>

          <CardDescription className="line-clamp-2">{project.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between taxt-xs">
                <span>Прогрес:</span>
                <span>{progress}%</span>
              </div>

              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-between gap-1">
              <div className="flex justify-between text-sm text-muted-foreground gap-1">
                <span>Задач:</span>
                <span>{project.tasks.length}</span>
              </div>

              <div className="text-xs flex items-center gap-1">
                <CalendarDays className="w-5 h-5 mr-1 text-muted-foreground" />

                <div>
                  <div className="flex justify-between gap-1">
                    <span>Створено:</span>
                    <span>{format(project.createdAt, 'dd.MM.yyyy')}</span>
                  </div>

                  <div className="flex justify-between gap-1">
                    <span>Завершення: </span>
                    <span>{format(project.dueDate, 'dd.MM.yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}