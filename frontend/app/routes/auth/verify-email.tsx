import { Card, CardContent, CardHeader } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, CheckCircle, Loader, XCircle } from 'lucide-react';
import { useVerifyEmailMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const {mutate, isPending: isVerifying} = useVerifyEmailMutation();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setIsSuccess(false);
    } else {
      mutate({ token }, {
        onSuccess: () => setIsSuccess(true),
        onError: (error: any) => {
          setIsSuccess(false); 
          console.error("Помилка підтвердження пошти:", error);
          toast.error(error?.response?.data?.message || "Помилка підтвердження пошти")
        },
      });
    }
  }, [searchParams]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Підтвердження пошти</h1>
      <p className='mt-4 text-sm text-gray-500'>{isSuccess ? 'Пошта успішно підтверджена' : 'Пошта не підтверджена'}</p>

      <Card className='w-full max-w-md'>
        <CardHeader>
          <Link to='/sign-in' className='text-blue-500 hover:underline flex items-center gap-2 text-sm'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Повернутися до входу
          </Link>
        </CardHeader>

        <CardContent>
          <div className='hy-6 flex flex-col items-center justify-center'>
            {isVerifying ? (
              <>
              <Loader className='w-10 h-10 text-gray-500 animate-spin' />
              <h3 className='text-lg font-semibold'>Перевірка пошти...</h3>
              <p className='text-sm text-gray-500'>Будь ласка, зачекайте, поки ми перевіримо вашу адресу електронної пошти.</p>
              </>
            ) : isSuccess ? (
              <CheckCircle className='w-10 h-10 text-green-500' />
            ) : (
              <XCircle className='w-10 h-10 text-red-500' />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail