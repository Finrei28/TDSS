import React, { useEffect, forwardRef, useImperativeHandle } from "react"
import { Input } from "@/components/ui/input"
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
import { StrategyType } from "../Types"
import { StratRef } from "../dashboard/Props"

// Define the schema for form validation
const FormSchema = z.object({
  stratname: z.string().max(100, "Strategy Name too long").optional(),
})

// Define the prop types for the component
type StratNameProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  stratName: string
  setNameCheck?: React.Dispatch<React.SetStateAction<boolean>>
  mode?: string
}

// Update StratName component with correct ref type
const StratName = forwardRef<StratRef, StratNameProps>(
  ({ setStrat, setNameCheck, stratName, mode }: StratNameProps, ref) => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        stratname: stratName,
      },
    })

    useEffect(() => {
      form.setValue("stratname", stratName)
    }, [stratName, form])

    // Expose the submit method to parent components via the ref
    useImperativeHandle(ref, () => ({
      submit: async () => {
        let formData: string | undefined = ""

        // Use a Promise to wait for form.handleSubmit to resolve
        await new Promise<void>((resolve) => {
          form.handleSubmit((data) => {
            formData = data.stratname
            onSubmit(data)
            resolve() // Resolve the promise
          })()
        })

        return { name: formData }
      },
    }))

    function onSubmit(data: z.infer<typeof FormSchema>) {
      setStrat((prev) => ({
        ...prev,
        name: data.stratname || "",
      }))
      if (setNameCheck) {
        setNameCheck(true)
      }
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="stratname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Strategy Name</FormLabel>
                <FormControl className="py-5">
                  <Input placeholder="Strategy Name" {...field} />
                </FormControl>
                <FormDescription>(Optional)</FormDescription>
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

export default StratName
