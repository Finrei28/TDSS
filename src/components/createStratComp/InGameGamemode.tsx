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
import { StrategyType } from "../types"
import { forwardRef, useImperativeHandle } from "react"
import { StratRef } from "../dashboard/Props"

const FormSchema = z.object({
  InGameGamemode: z.enum(["easy", "molten", "intermediate", "fallen"], {
    required_error: "You need to select a gamemode.",
  }),
})

type InGameGamemodeProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  inGameGamemode: string | undefined
  mode?: string
}

const InGameGamemode = forwardRef<StratRef, InGameGamemodeProps>(
  ({ setStrat, inGameGamemode, mode }: InGameGamemodeProps, ref) => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        InGameGamemode: inGameGamemode
          ? (inGameGamemode.toLowerCase() as
              | "easy"
              | "molten"
              | "intermediate"
              | "fallen")
          : undefined,
      },
    })

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let formData: string | undefined = ""

        // Use a Promise to wait for form.handleSubmit to resolve
        await new Promise<void>((resolve) => {
          form.handleSubmit((data) => {
            formData = data.InGameGamemode
            onSubmit(data)
            resolve() // Resolve the promise
          })()
        })

        return { inGameGamemode: formData }
      },
    }))

    function onSubmit(data: z.infer<typeof FormSchema>) {
      setStrat((prev) => ({
        ...prev,
        map: { name: "" },
        numOfPlayer: "",
        inGameGamemode: data.InGameGamemode.toUpperCase(),
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
            name="InGameGamemode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Select a In Game Difficulty</FormLabel>
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
                        <RadioGroupItem value="molten" />
                      </FormControl>
                      <FormLabel className="font-normal">Molten</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="intermediate" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Intermediate
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fallen" />
                      </FormControl>
                      <FormLabel className="font-normal">Fallen</FormLabel>
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

export default InGameGamemode
