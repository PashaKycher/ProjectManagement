import { signInSchema } from '@/lib/schema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type z from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router'
import { useLoginMutation } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

type SignInFormData = z.infer<typeof signInSchema>

const SignIn = () => {
  const navigate = useNavigate();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending} = useLoginMutation();
  const handleOnSubmit = (values: SignInFormData) => {
    mutate(values, {
          onSuccess: () => {
            toast.success("Успішний вхід", { description: "Логін та пароль успішно пройшли перевірку." });
            form.reset()
            navigate('/dashboard')
          },
          onError: (error: any) => {
            const message = error?.response?.data?.message || 'Щось пішло не так. Спробуйте ще раз.';
            toast.error(message);
            console.log("Login error:", error);
          }
        });
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
      <Card className='max-w-md w-full shadow-xl space-y-8'>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-bold'>Божоємо здоров'я!</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>Будь ласка, увійдіть у свій акаунт</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='w-full space-y-4'>
              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваша електронна пошта</FormLabel>
                    <FormControl>
                      <input
                        className='border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
                          focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-white'
                        type='email' placeholder='email@example.com' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name='password'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Ваш пароль</FormLabel>
                      <Link to='/forgot-password' className='text-sm text-blue-600 hover:underline'>Забули пароль?</Link>
                    </div>
                    <FormControl>
                      <input className='border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
                          focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-white'
                        type='password' placeholder='qwerty' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full mt-4' disabled={isPending}>
                {isPending ? (<Loader2 className='mr-2 h-4 w-4 animate-spin' />) : 'Увійти'}
              </Button>
            </form>
          </Form>

          <CardFooter>
            <div className='flex items-center justify-center'>
              <p className='text-sm text-muted-foreground'>
                Ще немає акаунта? <a href='/sign-up' className='text-blue-500 hover:underline'>Зареєструватися</a>
              </p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn