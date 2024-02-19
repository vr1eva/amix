"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ThreadArgs } from "@/types"

const formSchema = z.object({
    newMessage: z.string().min(2, {
        message: "Thread message must be at least 2 characters.",
    }),
})

export function Thread({ thread }: ThreadArgs) {
    console.log(thread)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newMessage: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="newMessage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>amix</FormLabel>
                            <FormControl>
                                <Input placeholder="What is a good book about research" {...field} />
                            </FormControl>
                            <FormDescription>
                                Ready to answer
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={form.formState.isLoading} type="submit">Submit</Button>
            </form>
        </Form>
    )
}