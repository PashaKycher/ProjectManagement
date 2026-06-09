import { Loader } from '@/components/Loader';
import { NoDataFound } from '@/components/no-data-found';
import { Button } from '@/components/ui/button';
import { CreateWorkspace } from '@/components/workspace/create-workspace';
import { useGetWorkspacesQuery } from '@/hooks/use-workspace';
import type { Workspace } from '@/types';
import { PlusCircle, Users } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useLoaderData } from 'react-router'
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkspaceAvatar } from '@/components/workspace/workspace-avatar';

const Workspaces = () => {
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as { data: Workspace[], isLoading: boolean };

    if (isLoading) return <Loader />;

    return (<>
        <div className="space-y-8">
            <div className='flex items-center justify-between'>
                <h2 className="text-xl md:text-3xl font-bold">Робочий простір</h2>

                <Button onClick={() => setIsCreatingWorkspace(true)}>
                    <PlusCircle className="size-4 mr-2" />
                    Створити новий робочий простір
                </Button>
            </div>

            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {workspaces.length === 0 && <NoDataFound
                    title='У вас ще немає робочих просторів'
                    description='Створіть свій перший робочий простір'
                    buttonText='Створити робочий простір'
                    buttonAction={() => setIsCreatingWorkspace(true)} />}

                {workspaces.length > 0 && (workspaces.map(workspace => (
                    <WorkspaceCard key={workspace._id} workspace={workspace} />
                )))}
            </div>
        </div>

        <CreateWorkspace isCreatingWorkspace={isCreatingWorkspace} setIsCreatingWorkspace={setIsCreatingWorkspace} />
    </>)
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
    return (
        <Link to={`/workspace/${workspace._id}`}>
            <Card className='transition-all hover:shadow-md hover:-transition-y-1'>
                <CardHeader className='pb-2'>
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-2'>
                            <WorkspaceAvatar name={workspace.name} color={workspace.color} />

                            <div>
                                <CardTitle>{workspace.name}</CardTitle>
                                <span className='text-xs text-muted-foreground'>Створено: {format(workspace.createdAt, 'dd.MM.yyyy в H:mm')}</span>
                            </div>
                        </div>
                        <div className='flex items-center text-muted-foreground'>
                            <Users className='w-4 h-4 mr-1' />
                            <span className='text-xs'>{workspace.members.length}</span>
                        </div>
                    </div>

                    <CardDescription>{workspace.description || 'Немає опису'}</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className='text-sm text-muted-foreground'>
                        Деталі простору
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Workspaces