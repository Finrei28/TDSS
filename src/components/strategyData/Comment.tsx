"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import MaxWidthWapper from "../MaxWidthWapper"
import Link from "next/link"
import { Textarea } from "../ui/textarea"
import postComment from "./PostComment"
import { SuccessMessage } from "../ui/MessageBox"
import { useSearchParams } from "next/navigation"

// Define your validation schema
const FormSchema = z.object({
  comment: z.string().min(1, "Write something to start commenting"),
})

type CommentProp = {
  stratId: string
  onCommentPosted: () => void
  parentCommentId?: number
}

export default function Comment({
  stratId,
  onCommentPosted,
  parentCommentId,
}: CommentProp) {
  const [success, setSuccess] = useState(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const result = await postComment(data.comment, stratId, parentCommentId)
    if (result === true) {
      setSuccess(true)
      form.reset()
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
      onCommentPosted()
    } else {
      console.error("Failed to post comment:", result)
    }
  }

  return (
    <Form {...form}>
      <div className="fixed bottom-4 ml-4 p-4 z-110">
        {success && (
          <SuccessMessage message="You successfully posted a comment" />
        )}
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl className="py-2">
                <Textarea
                  placeholder="Write a comment..."
                  aria-label="comment"
                  {...field}
                  className="resize-none overflow-hidden w-full"
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = "auto" // Reset height to calculate new height
                    target.style.height = `${target.scrollHeight}px` // Set height based on content
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting} // Disable button while submitting
          >
            {parentCommentId
              ? form.formState.isSubmitting
                ? "Posting..."
                : "Post"
              : form.formState.isSubmitting
              ? "Commenting..."
              : "Comment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
