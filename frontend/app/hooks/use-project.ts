import type { CreateProjectFormData } from "@/components/project/create-project";
import { fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectData, workspaceId }: { projectData: CreateProjectFormData; workspaceId: string; }) => postData(`/projects/${workspaceId}/create-project`, projectData),
    onSuccess: (data: any) => queryClient.invalidateQueries({ queryKey: ["workspace", data.workspace], }),
  });
};

export const UseProjectQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => fetchData(`/projects/${projectId}/tasks`),
  });
};