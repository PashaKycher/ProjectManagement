import type { Workspace } from "@/components/workspace/create-workspace"
import { fetchData, postData } from "@/lib/fetch-util"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useCreateWorkspace = () => {
    return useMutation({
        mutationFn: (data: Workspace) => postData("/workspaces", data),
    })
}

export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: () => fetchData("/workspaces"),
    })
}

export const useGetWorkspaceQuery = (workspaceId: string) => {
    return useQuery({
        queryKey: ["workspace", workspaceId],
        queryFn: () => fetchData(`/workspaces/${workspaceId}/projects`),
    })
}