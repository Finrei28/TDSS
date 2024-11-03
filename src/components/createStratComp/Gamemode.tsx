"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import toast from "react-hot-toast"
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
import { useSearchParams, useRouter } from "next/navigation"
import { PlayerSteps } from "../types"

const FormSchema = z.object({
  Gamemode: z.enum(["normal", "special", "hardcore"], {
    required_error: "You need to select a gamemode.",
  }),
})

type gamemodeProps = {
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
  gamemode: string | null
}

export default function Gamemode({ setStrat, gamemode }: gamemodeProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Gamemode: gamemode
        ? (gamemode as "normal" | "special" | "hardcore")
        : undefined,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setStrat((prev) => ({
      ...prev,
      map: "",
      numOfPlayers: "",
      inGameGamemode: "",
      gamemode: data.Gamemode,
    }))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}
