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

const FormSchema = z.object({
  stratname: z.string().max(100, "Strategy Name too long").optional(),
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
  stratName: string
  setNameCheck: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StratName({
  setStrat,
  stratName,
  setNameCheck,
}: StratNameProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      stratname: stratName,
    },
  })
  useEffect(() => {
    form.setValue("stratname", stratName)
  }, [stratName, form])
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setStrat((prev) => ({
      ...prev,
      name: data.stratname ? data.stratname : "",
    }))
    setNameCheck(true)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}
