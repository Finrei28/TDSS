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
  PlayerNum: z.enum(["1", "2", "3", "4"], {
    required_error: "You need to select the number of required players.",
  }),
})

type numOfPlayerProps = {
  setStrat: React.Dispatch<React.SetStateAction<StrategyType>>
  gamemode: string
  numOfPlayer: string
  mode?: string
}

const numOfPlayer = forwardRef<StratRef, numOfPlayerProps>(
  ({ setStrat, gamemode, numOfPlayer, mode }: numOfPlayerProps, ref) => {
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        PlayerNum: numOfPlayer
          ? (numOfPlayer as "1" | "2" | "3" | "4")
          : undefined,
      },
    })

    useImperativeHandle(ref, () => ({
      submit: async () => {
        let formData: string | undefined = ""

        // Use a Promise to wait for form.handleSubmit to resolve
        await new Promise<void>((resolve) => {
          form.handleSubmit((data) => {
            formData = data.PlayerNum
            onSubmit(data)
            resolve() // Resolve the promise
          })()
        })

        return {
          numOfPlayer:
            formData === "1"
              ? "ONE"
              : formData === "2"
              ? "TWO"
              : formData === "3"
              ? "THREE"
              : "FOUR.",
        }
      },
    }))

    function onSubmit(data: z.infer<typeof FormSchema>) {
      setStrat((prev) => ({
        ...prev,
        numOfPlayer: data.PlayerNum,
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
            name="PlayerNum"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  How many players are required for this strat?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value} // Use the form's current value
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="1" />
                      </FormControl>
                      <FormLabel className="font-normal">1</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="2" />
                      </FormControl>
                      <FormLabel className="font-normal">2</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="3" />
                      </FormControl>
                      <FormLabel className="font-normal">3</FormLabel>
                    </FormItem>
                    {gamemode.toLowerCase() !== "hardcore" && (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="4" />
                        </FormControl>
                        <FormLabel className="font-normal">4</FormLabel>
                      </FormItem>
                    )}
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

export default numOfPlayer
