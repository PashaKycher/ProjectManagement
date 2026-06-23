import { useUpdateTaskPriorityMutation } from '@/hooks/use-task';
import { priorityTranslation, statusTranslation } from '@/lib';
import { PriorityStatus } from '@/types'
import React from 'react'
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const TaskPrioritySelector = ({ priority, taskId }: { priority: PriorityStatus, taskId: string }) => {
  const { mutate, isPending } = useUpdateTaskPriorityMutation();

  const handlePriorityChange = (value: string) => {
    mutate({ taskId, priority: value as PriorityStatus }, {
      onSuccess: () => { toast.success("Приоритет завдання успішно оновлено"); },
      onError: (error: any) => toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.")
    });
  }

  return (
    <Select value={priority} onValueChange={handlePriorityChange} disabled={isPending}>
      <SelectTrigger className='w-45'>
        <SelectValue placeholder={priorityTranslation(priority)} />
      </SelectTrigger>
      <SelectContent>
        {Object.values(PriorityStatus).map((priority) => (
          <SelectItem key={priority} value={priority}>{priorityTranslation(priority)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TaskPrioritySelector