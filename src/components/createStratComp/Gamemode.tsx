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
import { StratRef } from "../dashboard/Props"

const FormSchema = z.object({
  Gamemode: z.enum(["normal", "special", "hardcore"], {
    required_error: "You need to select a gamemode.",
  }),
})

type GamemodeProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  gamemode: string
  mode?: string
}

const Gamemode = forwardRef<StratRef, GamemodeProps>(
  ({ setStrat, gamemode, mode }: GamemodeProps, ref) => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        Gamemode: gamemode
          ? (gamemode.toLowerCase() as "normal" | "special" | "hardcore")
          : undefined,
      },
    })

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let formData: string | undefined = ""

        // Use a Promise to wait for form.handleSubmit to resolve
        await new Promise<void>((resolve) => {
          form.handleSubmit((data) => {
            formData = data.Gamemode
            onSubmit(data)
            resolve() // Resolve the promise
          })()
        })

        return { gamemode: formData }
      },
    }))

    function onSubmit(data: z.infer<typeof FormSchema>) {
      setStrat((prev) => ({
        ...prev,
        map: { name: "" },
        numOfPlayer: "",
        inGameGamemode: "",
        gamemode: data.Gamemode.toUpperCase(),
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
            name="Gamemode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Select a gamemode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value} // Use the form's current value
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="normal" />
                      </FormControl>
                      <FormLabel className="font-normal">Normal</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="special" />
                      </FormControl>
                      <FormLabel className="font-normal">Special</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="hardcore" />
                      </FormControl>
                      <FormLabel className="font-normal">Hardcore</FormLabel>
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

export default Gamemode
