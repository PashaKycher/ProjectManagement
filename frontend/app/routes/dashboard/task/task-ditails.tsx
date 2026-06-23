import { BackButton } from '@/components/back-button';
import { Loader } from '@/components/Loader';
import Subtasks from '@/components/task/sub-tasks';
import TaskActivity from '@/components/task/task-activity';
import TaskAssigneesSelector from '@/components/task/task-assignees-selektor';
import TaskDescription from '@/components/task/task-description';
import TaskPrioritySelector from '@/components/task/task-priority-selector';
import TaskStatusSelector from '@/components/task/task-status-selector';
import TaskTitle from '@/components/task/task-title';
import Watchers from '@/components/task/watchers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTaskByIdQuery } from '@/hooks/use-task';
import { priorityTranslation } from '@/lib';
import { useAuth } from '@/provider/auth-context';
import type { Project, Task } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { uk } from "date-fns/locale"
import { Eye, EyeOff, LucideDelete } from 'lucide-react';
import React from 'react'
import { useNavigate, useParams } from 'react-router';

const TaskDitails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{ taskId: string, projectId: string, workspaceId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: { task: Task, project: Project };
    isLoading: boolean
  };

  if (isLoading || !data) return <Loader />

  if (!data) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-2xl font-bold'>Task not found</div>
      </div>
    );
  }

  const { task, project } = data;

  const isUserWatching = task?.watchers?.some((watcher) => watcher._id.toString() === user?._id.toString());

  const goBack = () => navigate(-1);

  const members = task?.assignees || []

  return (
    <div className='container mx-auto p-0 py-4 md:px-4'>
      <div className='flex flex-col md:flex-row items-center justify-between mb-6'>
        <div className='flex flex-col md:flex-row md:items-center'>
          <BackButton />

          <h1 className='text-xl md:text-2xl font-bold'>{task.title}</h1>

          {task.isArchived && (
            <Badge className="ml-2" variant={"outline"}>В Архіві</Badge>
          )}
        </div>

        <div className='flex space-x-2 mt-4 md:mt-0'>
          <Button variant={isUserWatching ? 'outline' : 'default'} size="sm" onClick={() => { }} className='w-fit'>
            {isUserWatching ? <><EyeOff className="mr-2 size-4" />Відписатися</> : <><Eye className="mr-2 size-4" />Підписатися</>}
          </Button>

          <Button variant={task.isArchived ? 'outline' : 'default'} size="sm" onClick={() => { }} className='w-fit'>
            {task.isArchived ? "Розархівувати" : "Архівувати"}
          </Button>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='lg:col-span-2 lg:w-3/4'>
          <div className='bg-card rounded-lg p-6 shadow-sm mb-6'>
            <div className='flex flex-col md:flex-row justify-between items-start mb-4'>
              <div>
                <span className='text-xs font-semibold'>Пріоритет: </span>

                <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "outline"} className='mb-2 capitalize'>
                  {priorityTranslation(task.priority)}
                </Badge>

                <TaskTitle title={task.title} taskId={task._id} />

                <div className='text-sm  text-muted-foreground'>Створено: {" "}{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true, locale: uk })}</div>
              </div>

              <div className='flex items-center gap-2 mt-4 md:mt-0'>
                <TaskStatusSelector status={task.status} taskId={task._id} />

                <Button variant={'destructive'} size="sm" onClick={() => { }} className='hidden md:block' title="Видалити">
                  <LucideDelete className="size-4" />
                </Button>
              </div>
            </div>

            <div className='mb-6'>
              <h3 className='text-sm font-medium text-muted-foreground mb-0'>Опис</h3>

              <TaskDescription description={task.description || ""} taskId={task._id} />
            </div>

            <TaskAssigneesSelector projectMembers={project.members as any} assignees={task.assignees} task={task} />

            <TaskPrioritySelector priority={task.priority} taskId={task._id} />

            <Subtasks subTasks={task.subtasks || []} taskId={task._id} />
          </div>
        </div>

        <div className='w-full lg:w-1/4'>
          <Watchers watchers={task.watchers || []} />

          <TaskActivity resourceId={task._id} />
        </div>
      </div>
    </div>
  )
}

export default TaskDitails