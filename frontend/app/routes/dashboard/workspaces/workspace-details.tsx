
import { Loader } from "@/components/Loader";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const [isCreateProject, setIsCreateProject] = useState(false);
    const [isInviteMember, setIsInviteMemmber] = useState(false);

    if (!workspaceId) {
        return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl text-gray-800">Робочий простір не знайдено</h1>
                <p className="text-sm text-gray-500">Зверніться до адміністратора</p>
            </div>
        )
    };

    const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
        data: { workspace: Workspace; projects: Project[] };
        isLoading: boolean
    };

    if (isLoading || !data) {
    return (
        <div>
            <Loader />
        </div>
    );
}

    return (
        <div className="space-y-8">
            <WorkspaceHeader
                workspace={data.workspace}
                members={data?.workspace?.members as any}
                onCreateProject={() => setIsCreateProject(true)}
                onInviteMember={() => setIsInviteMemmber(true)}
            />
        </div>
    )
}

export default WorkspaceDetails