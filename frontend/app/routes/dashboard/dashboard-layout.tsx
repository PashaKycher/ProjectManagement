import { Header } from '@/components/layout/header';
import { Loader } from '@/components/Loader';
import { useAuth } from '@/provider/auth-context';
import type { Workspace } from '@/types';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router';

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelector = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  }

  return (
    <div className="flex h-screen w-full">
      {/* <SidebarComponnent /> */}

        <div className="flex flex-1 flex-col h-full">
          <Header
            onWorkspaceSelected={handleWorkspaceSelector}
            selectedWorkspace={currentWorkspace}
            onCreateWorkspace={() => setIsCreatingWorkspace(true)}
          />

          <main className="flex-1 overflow-y-auto h-full w-full">
            <div className="mx-auto container px-2 sm:px-6 lg:px-9 md:py-8 w-full h-full">
              <Outlet />
            </div>
          </main>
        </div>
    </div>
  )
}

export default DashboardLayout