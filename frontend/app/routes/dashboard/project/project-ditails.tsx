import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/Loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseProjectQuery } from "@/hooks/use-project";
import { getProjectProgress, priorityTranslation } from "@/lib";
import { cn } from "@/lib/utils";
import { PriorityStatus, TaskStatus, type Project, type Task } from "@/types";
import { format } from "date-fns";
import { AlertCircle, CalendarDays, CheckCircle, Clock, PlusCircle } from "lucide-react";
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

  const handleTaskClick = (taskId: string) => { navigate(`/workspace/${workspaceId}/project/${projectId}/task/${taskId}`) };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
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
        <Tabs defaultValue="all" className="flex flex-col flex-1">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("ALL")}>Всі</TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter(TaskStatus.TO_DO)}>Виконати</TabsTrigger>
              <TabsTrigger value="in-progress" onClick={() => setTaskFilter(TaskStatus.IN_PROGRESS)}>В роботі</TabsTrigger>
              <TabsTrigger value="in-review" onClick={() => setTaskFilter(TaskStatus.REVIEW)}>На перевірці</TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter(TaskStatus.DONE)}>Виконані</TabsTrigger>
            </TabsList>

            <div className="lg:flex items-center text-sm">
              <span className="text-muted-foreground">Статус: </span>
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
            <div className="lg:grid grid-cols-4 gap-2">
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
      <div className={cn(!isFullWidth ? "h-full" : "col-span-full mb-4")}>
        {!isFullWidth && (
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-medium">{title}</h1>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        )}

        <div className={cn(!isFullWidth ? "flex flex-col gap-2" : "md:grid grid-cols-3 gap-4")}>
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
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1 mb-2 ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className={
            task.priority === PriorityStatus.HIGH ? "bg-red-500 taxt-white" :
              task.priority === PriorityStatus.MEDIUM ? "bg-orange-500 taxt-white" :
                "bg-slate-500 taxt-white"
          }>
            {priorityTranslation(task.priority)}
          </Badge>

          <div className="flex gap-1">
            <Button variant={"ghost"} size={"icon"} className="size-6" title="Сплановано" onClick={(e) => { e.stopPropagation();}}>
              <AlertCircle className={cn("size-4", task.status !== TaskStatus.TO_DO && "text-green-500")} />
              <span className="sr-only">Сплановано</span>
            </Button>

            {task.status !== TaskStatus.TO_DO && (
              <Button variant={"ghost"} size={"icon"} className="size-6" title="Зроблено" onClick={(e) => { e.stopPropagation();}}>
                <Clock className={cn("size-4", task.status !== TaskStatus.IN_PROGRESS && "text-green-500")} />
                <span className="sr-only">Зроблено</span>
              </Button>
            )}

            {task.status !== TaskStatus.TO_DO && task.status !== TaskStatus.IN_PROGRESS && (
              <Button variant={"ghost"} size={"icon"} className="size-6" title="Перевірено" onClick={(e) => { e.stopPropagation();}}>
                <PlusCircle className={cn("size-4", task.status !== TaskStatus.REVIEW && "text-green-500")} />
                <span className="sr-only">Перевірено</span>
              </Button>
            )}

            {task.status === TaskStatus.DONE && (
              <Button variant={"ghost"} size={"icon"} className="size-6" title="Виконано" onClick={(e) => { e.stopPropagation();}}>
                <CheckCircle className={cn("size-4 text-green-500")} />
                <span className="sr-only">Виконано</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h4 className="font-medium mb-2">{task.title}</h4>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 5).map((assignee) => (
                  <Avatar key={assignee._id} className="relative size-8 bg-gray-700 rounded-full border-2 overflow-hidden border-background" title={assignee.name}>
                    <AvatarImage src={assignee.profilePicture} alt={assignee.name} />

                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}

                {task.assignees.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    + {task.assignees.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className="text-sm text-muted-foreground flex items-center">
              <CalendarDays className="size-3 mr-1" />

              {format(new Date(task.dueDate), "dd.MM.yyyy")}
            </div>
          )}
        </div>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {task.subtasks.filter((subtask) => subtask.completed).length} / {task.subtasks.length} підзавдань
          </div>
        )}
      </CardContent>
    </Card>
  )
}