import { TaskStatus } from '@/types'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { doItTranslation, statusTranslation } from '@/lib'
import { useUpdateTaskStatusMutation } from '@/hooks/use-task'
import { toast } from 'sonner'

const TaskStatusSelector = ({ status, taskId }: { status: TaskStatus, taskId: string }) => {
  const {mutate, isPending} = useUpdateTaskStatusMutation();

  const handleStatusChange = (value: string) => {
    mutate({ taskId, status: value as TaskStatus }, {
      onSuccess: () => {  toast.success("Статус завдання успішно оновлено");},
      onError: (error: any) => toast.error(error?.response?.data?.message || "Щось пішло не так. Спробуйте ще раз.")
    });
  }

  return (
    <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
      <SelectTrigger className='w-45'>
        <SelectValue placeholder={doItTranslation(status)} />
      </SelectTrigger>
      <SelectContent>
        {Object.values(TaskStatus).map((status) => (
          <SelectItem key={status} value={status}>{doItTranslation(status)}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TaskStatusSelector