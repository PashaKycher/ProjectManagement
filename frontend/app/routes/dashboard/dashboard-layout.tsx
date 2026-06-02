import { Button } from '@/components/ui/button';
import { useAuth } from '@/provider/auth-context';
import React from 'react'

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  return (
    <div>
      <Button onClick={logout}>Logout</Button>
      <h1>Welcome, {user?.name}!</h1>
    </div>
  )
}

export default DashboardLayout