import React, { forwardRef, useEffect, useImperativeHandle } from "react"
import { Button } from "../ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { StrategyType } from "../types"
import { Textarea } from "@/components/ui/textarea"
import { StratRef } from "../dashboard/Props"

const FormSchema = z.object({
  stratdescription: z
    .string()
    .refine((value) => value.split(" ").length <= 200, {
      message: "Description too long. Maximum 200 words.",
    }),
})

type DescriptionProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  stratDescription: string
  setDescriptionCheck?: React.Dispatch<React.SetStateAction<boolean>>
  mode?: string
}

const Description = forwardRef<StratRef, DescriptionProps>(
  (
    { setStrat, stratDescription, setDescriptionCheck, mode }: DescriptionProps,
    ref
  ) => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        stratdescription: stratDescription,
      },
    })

    useEffect(() => {
      form.setValue("stratdescription", stratDescription)
    }, [stratDescription, form])

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let formData: string | undefined = ""

        // Use a Promise to wait for form.handleSubmit to resolve
        await new Promise<void>((resolve) => {
          form.handleSubmit((data) => {
            formData = data.stratdescription
            onSubmit(data)
            resolve() // Resolve the promise
          })()
        })

        return { description: formData }
      },
    }))

    function onSubmit(data: z.infer<typeof FormSchema>) {
      setStrat((prev) => ({
        ...prev,
        description: data.stratdescription ? data.stratdescription : "",
      }))
      if (setDescriptionCheck) setDescriptionCheck(true)
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="stratdescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description/Notes</FormLabel>
                <FormControl className="py-5">
                  <Textarea
                    placeholder="Add any notes here such as any prerequisites required for this strategy"
                    className={`bg-white resize-none focus:outline-none focus:ring-2`}
                    {...field}
                  />
                </FormControl>
                <FormDescription>(Optional)</FormDescription>
                <FormDescription>Max 200 words</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {mode !== "edit" && <Button type="submit">Next</Button>}
        </form>
      </Form>
    )
  }
)

export default Description
