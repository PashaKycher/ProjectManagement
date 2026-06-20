import { BackButton } from '@/components/back-button';
import { Loader } from '@/components/Loader';
import TaskTitle from '@/components/task/task-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTaskByIdQuery } from '@/hooks/use-task';
import { priorityTranslation } from '@/lib';
import { useAuth } from '@/provider/auth-context';
import type { Project, Task } from '@/types';
import { Eye, EyeOff } from 'lucide-react';
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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='lg:col-span-2'>
          <div className='bg-card rounded-lg p-6 shadow-sm mb-6'>
            <div className='flex flex-col md:flex-row justify-between items-start mb-4'>
              <div>
                <span className='text-xs font-semibold'>Пріоритет: </span>

                <Badge variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "outline"} className='mb-2 capitalize'>
                  {priorityTranslation(task.priority)}
                </Badge>

                <TaskTitle title={task.title} taskId={task._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDitails