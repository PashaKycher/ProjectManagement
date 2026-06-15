import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/Loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress, priorityTranslation } from "@/lib";
import { cn } from "@/lib/utils";
import { TaskStatus, type Project, type Task } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";


const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{ projectId: string, workspaceId: string }>();
  const navigate = useNavigate();
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "ALL">("ALL");

  const { data, isLoading } = UseProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean
  };

  if (isLoading || !data) return <Loader />
  
  const { tasks, project } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`)};

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3"><h1 className="text-xl md:text-2xl font-bold">{project.title}</h1></div>
          {project.description && (<p className="text-sm md:text-base text-muted-foreground">{project.description}</p>)}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Прогрес: </div>
            <div className="flex-1 min-w-8"><Progress value={projectProgress} className="h-2" /></div>
            <span className="text-sm text-muted-foreground">{projectProgress}%</span>
            <Button onClick={() => setIsCreateTask(true)}>Створити задачу</Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("ALL")}>Всі</TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter(TaskStatus.TO_DO)}>Виконати</TabsTrigger>
              <TabsTrigger value="in-progress" onClick={() => setTaskFilter(TaskStatus.IN_PROGRESS)}>В роботі</TabsTrigger>
              <TabsTrigger value="in-review" onClick={() => setTaskFilter(TaskStatus.REVIEW)}>На перевірці</TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter(TaskStatus.DONE)}>Виконані</TabsTrigger>
            </TabsList>

            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Статус:</span>
              <div>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "To Do").length} Виконати
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "In Progress").length} В роботі
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "Review").length} На перевірці
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "Done").length} Виконані
                </Badge>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-4 gap-4">
              <TaskColumn title="Виконати" tasks={tasks.filter((task) => task.status === TaskStatus.TO_DO)} onTaskClick={handleTaskClick} />
              <TaskColumn title="В роботі" tasks={tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)} onTaskClick={handleTaskClick} />
              <TaskColumn title="На перевірці" tasks={tasks.filter((task) => task.status === TaskStatus.REVIEW)} onTaskClick={handleTaskClick} />
              <TaskColumn title="Виконані" tasks={tasks.filter((task) => task.status === TaskStatus.DONE)} onTaskClick={handleTaskClick} />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <TaskColumn title="Виконати" tasks={tasks.filter((task) => task.status === TaskStatus.TO_DO)} onTaskClick={handleTaskClick} isFullWidth />
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <TaskColumn title="В роботі" tasks={tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)} onTaskClick={handleTaskClick} isFullWidth />
          </TabsContent>

          <TabsContent value="in-review" className="m-0">
            <TaskColumn title="На перевірці" tasks={tasks.filter((task) => task.status === TaskStatus.REVIEW)} onTaskClick={handleTaskClick} isFullWidth />
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <TaskColumn title="Виконані" tasks={tasks.filter((task) => task.status === TaskStatus.DONE)} onTaskClick={handleTaskClick} isFullWidth />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskDialog isOpen={isCreateTask} onOpenChange={setIsCreateTask} projectId={projectId!} projectMembers={project.members as any} />
    </div>
  )
}

export default ProjectDetails

interface TaskColumnProps {
  title: string
  tasks: Task[]
  onTaskClick: (taskId: string) => void
  isFullWidth?: boolean
}

const TaskColumn = ({ title, tasks, onTaskClick, isFullWidth = false }: TaskColumnProps) => {
  return (
    <div className={isFullWidth ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : ""}>
      <div className={cn("space-y-4", !isFullWidth ? "h-full" : "col-span-full mb-4")}>
        {!isFullWidth && (
          <div className="flex items-center justify-between">
            <h1 className="font-medium">{title}</h1>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        )}

        <div className={cn(!isFullWidth ? "space-y-2 flex flex-col" : "grid grid-cols-3 gap-4")}>
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">Ще немає завдань</div>
          ) : (tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task._id)} />
          )))}
        </div>
      </div>
    </div>
  )
}

const TaskCard = ({ task, onClick }: { task: Task, onClick: () => void }) => {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge>{priorityTranslation(task.priority)}</Badge>
        </div>
      </CardHeader>
    </Card>
  )
}