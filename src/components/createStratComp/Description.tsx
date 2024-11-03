import React, { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { PlayerSteps } from "../types"
import { Textarea } from "@/components/ui/textarea"

const FormSchema = z.object({
  stratdescription: z
    .string()
    .refine((value) => value.split(" ").length <= 200, {
      message: "Description too long. Maximum 200 words.",
    }),
})

type StratNameProps = {
  setStrat: React.Dispatch<
    React.SetStateAction<{
      name: string
      gamemode: string
      difficulty: string
      description: string
      map: string
      numOfPlayers: string
      inGameGamemode: string
      players: PlayerSteps[]
    }>
  >
  stratDescription: string
  setDescriptionCheck: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StratName({
  setStrat,
  stratDescription,
  setDescriptionCheck,
}: StratNameProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stratdescription: stratDescription,
    },
  })

  useEffect(() => {
    form.setValue("stratdescription", stratDescription)
  }, [stratDescription, form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setStrat((prev) => ({
      ...prev,
      description: data.stratdescription ? data.stratdescription : "",
    }))
    setDescriptionCheck(true)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}
