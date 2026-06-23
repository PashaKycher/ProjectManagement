import { useUpdateTaskDescriptionMutation } from '@/hooks/use-task';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Edit, PlusCircle, Save } from 'lucide-react';

const TaskDescription = ({ description, taskId }: { description: string, taskId: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const { mutate, isPending } = useUpdateTaskDescriptionMutation();

  const updateDescription = () => {
    mutate({ taskId, description: newDescription }, {
      onSuccess: () => { setIsEditing(false); toast.success("Опис завдання успішно оновлено"); },
      onError: (error: any) => toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.")
    });
  }

  return (
    <div className='flex items-center gap-2'>
      {isEditing ? (
        <Textarea className='w-full xl:min-w-3xl'
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          autoFocus
          disabled={isPending} />) : (<div className='text-sm md:text-base flex-1 text-muted-foreground'>{newDescription}</div>)}

      {isEditing ? (<Button onClick={updateDescription} disabled={isPending} title='Зберегти'><Save className="size-3 cursor-pointer" /></Button>
      ) : (<Edit className="size-3 cursor-pointer" onClick={() => setIsEditing(true)} />)}
    </div>
  )
}

export default TaskDescription