"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { StrategyType } from "../Types"
import { forwardRef, useImperativeHandle } from "react"
import { DifficultyProps, StratRef } from "../dashboard/Props"

const FormSchema = z.object({
  Difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "You need to select a difficulty for this strategy.",
  }),
})

type InGameGamemodeProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  difficulty: string | null
  mode?: string
}

const Difficulty = forwardRef<StratRef, DifficultyProps>(
  ({ setStrat, difficulty, mode }: InGameGamemodeProps, ref) => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        Difficulty: difficulty
          ? (difficulty.toLowerCase() as "easy" | "medium" | "hard")
          : undefined,
      },
    })

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let formData: string | undefined = ""

        // Use a Promise to wait for form.handleSubmit to resolve
        await new Promise<void>((resolve) => {
          form.handleSubmit((data) => {
            formData = data.Difficulty
            onSubmit(data)
            resolve() // Resolve the promise
          })()
        })

        return { difficulty: formData.toUpperCase() }
      },
    }))

    function onSubmit(data: z.infer<typeof FormSchema>) {
      setStrat((prev) => ({
        ...prev,
        difficulty: data.Difficulty.toUpperCase(),
      }))
    }

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="Difficulty"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Select a Difficulty for this strategy</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value} // Use the form's current value
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="easy" />
                      </FormControl>
                      <FormLabel className="font-normal">Easy</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="medium" />
                      </FormControl>
                      <FormLabel className="font-normal">Medium</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="hard" />
                      </FormControl>
                      <FormLabel className="font-normal">Hard</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
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

export default Difficulty
