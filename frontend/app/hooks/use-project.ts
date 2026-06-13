import type { CreateProjectFormData } from "@/components/project/create-project";
import { postData } from "@/lib/fetch-util";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// export const useCreateProject = () => {
//     const queryClient = useQueryClient();
//     return useMutation({
//         mutationFn: async (data: {projectData: CreateProjectFormData; workspaceId: string}) => postData(`/projects/${data.workspaceId}/create-project`, data),
//         onSuccess: (data: any) => queryClient.invalidateQueries({ queryKey: ['workspace', data.workspace] }),
//     });
// }

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ projectData, workspaceId }: { projectData: CreateProjectFormData; workspaceId: string; }) => postData( `/projects/${workspaceId}/create-project`, projectData),
        onSuccess: (data: any) => queryClient.invalidateQueries({ queryKey: ["workspace", data.workspace], }),
    });
};