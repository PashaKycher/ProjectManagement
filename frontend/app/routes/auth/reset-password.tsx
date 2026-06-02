import React, { useState } from 'react'
import { z } from 'zod';
import { resetPasswordSchema } from '@/lib/schema';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, CheckCheck, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useResetPasswordMutation } from '@/hooks/use-auth';
import { toast } from 'sonner';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    if (!token) {
      console.error('Token not found');
      toast.error('Невірний або відсутній токен для скидання пароля.');
      return;
    }

    resetPassword({ ...values, token: token as string }, {
      onSuccess: () => {
        setIsSuccess(true);
        // form.reset();
        // navigate('/sign-in');
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Щось пішло не так. Спробуйте ще раз.';
        console.log("Reset password error:", error);
        toast.error(message);
      },
    });
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-2xl font-bold'>Скидання паролю</h1>
          <p className='text-sm text-gray-600'>Введіть новий пароль для вашого облікового запису</p>
        </div>
        
        <Card>
          <CardHeader>
            <Link to="/sign-in" className='flex items-center gap-2'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              <span>На головну</span>
            </Link>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className='flex flex-col items-center justify-center'>
                <CheckCheck className='w-10 h-10 text-green-500' />
                <h1 className='text-2xl font-bold'>Пароль успішно змінено</h1>
                <p className='text-muted-foreground'>Тепер ви можете увійти з новим паролем.</p>
              </div>
            ):(
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Новий пароль</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} placeholder='qwerty' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Підтвердіть новий пароль</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} placeholder='qwerty' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                  <Button type="submit" className='w-full' disabled={isPending}>
                    {isPending ? (
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    ) : (
                      'Змінити пароль'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResetPassword