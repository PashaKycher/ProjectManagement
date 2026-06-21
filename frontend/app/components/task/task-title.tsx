import React, { useState } from 'react'
import { Input } from '../ui/input';
import { Edit, Pencil, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { useUpdateTaskTitleMutation } from '@/hooks/use-task';
import { toast } from 'sonner';

const TaskTitle = ({ title, taskId }: { title: string; taskId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate, isPending } = useUpdateTaskTitleMutation();

  const updateTitle = () => {
    mutate({ taskId, title: newTitle }, {
      onSuccess: () => { setIsEditing(false); toast.success("заголовок завдання успішно оновлено"); },
      onError: (error: any) => toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.")
    });
  }

  return (
    <div className='flex items-center gap-2'>
      {isEditing ? (
        <Input className='text-xl! font-semibold w-full xl:min-w-3xl'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          autoFocus
          disabled={isPending} />) : (<h2 className='text-xl flex-1 font-semibold'>{newTitle}</h2>)}

      {isEditing ? (<Button onClick={updateTitle} disabled={isPending}>Save</Button>
      ) : (<Edit className="size-3 cursor-pointer" onClick={() => setIsEditing(true)} />)}
    </div>
  )
}

export default TaskTitle