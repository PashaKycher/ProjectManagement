import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useResetPasswordRequestMutation } from '@/hooks/use-auth';
import { forgotPasswordSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCheck, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';
import type z from 'zod';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: forgotPassword, isPending } = useResetPasswordRequestMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true)
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Щось пішло не так. Спробуйте ще раз.';
        console.log("Forgot password error:", error);
        toast.error(message);
      },
    });
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='w-full max-w-md space-y-6'>
        <div className='flex flex-col items-center justify-center space-y-2'>
          <h1 className='text-2xl font-bold'>Забули пароль?</h1>
          <p className='text-sm text-gray-600'>Введіть адресу електронної пошти для скидання паролю</p>
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
              <div className='flex flex-col items-center justify-center space-y-2'>
                <CheckCheck className='w-10 h-10 text-green-500' />
                <h1 className='text-2xl font-bold'>Перевірте свою електронну пошту</h1>
                <p className='text-muted-foreground'>Якщо обліковий запис з такою електронною поштою існує, ви отримаєте лист для скидання паролю.</p>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem className='space-y-1'>
                        <FormLabel>Електронна пошта</FormLabel>
                        <FormControl>
                          <Input placeholder='Введіть свою електронну пошту' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button type='submit' className='w-full' disabled={isPending}>
                      {isPending ? (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      ):(
                        'Відновити пароль'
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPassword