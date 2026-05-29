import { signUpSchema } from '@/lib/schema'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type z from 'zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
  })
  const handleOnSubmit = (values: SignUpFormData) => {
    console.log(values)
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
      <Card className='max-w-md w-full shadow-xl space-y-8'>
        <CardHeader className='text-center space-y-2'>
          <CardTitle className='text-2xl font-bold'>Божоємо здоров'я!</CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>Будь ласка, зареєструйтеся</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className='w-full space-y-4'>
              <FormField
                name='name'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваше ім'я</FormLabel>
                    <FormControl>
                      <input className='border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
                          focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-white'
                        type='text' placeholder='Іван Іваненко' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                    <FormLabel>Ваш пароль</FormLabel>
                    <FormControl>
                      <input className='border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
                          focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-white'
                        type='password' placeholder='qwerty' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name='confirmPassword'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Підтвердіть пароль</FormLabel>
                    <FormControl>
                      <input className='border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
                          focus-visible:ring-ring focus-visible:ring-offset-2 focus:border-white'
                        type='password' placeholder='qwerty' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full mt-4'>Зареєструватися</Button>
            </form>
          </Form>

          <CardFooter>
            <div className='flex items-center justify-center'>
              <p className='text-sm text-muted-foreground'>
                Вже є акаунт? <a href='/sign-in' className='text-blue-500 hover:underline'>Увійти</a>
              </p>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp