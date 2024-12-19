import { useEffect, useState } from "react"
import CommentForm from "./Comment" // Make sure CommentForm is in a separate file
import { CommentType } from "../Types"
import { useSession } from "next-auth/react"

type CommentsListProps = {
  stratId: string
}

type CommentProp = {
  comment: CommentType
  onReplyPosted: (parentCommentId: number) => void
  depth: number
  stratId: string
}

// Component for a single comment
function Comment({ comment, onReplyPosted, depth, stratId }: CommentProp) {
  const { data: session } = useSession()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [repliesToShow, setRepliesToShow] = useState(2) // Initial number of replies to show

  const handleShowReplyForm = () => {
    setShowReplyForm((prev) => !prev)
  }

  const handleReplyPosted = () => {
    onReplyPosted(comment.parentCommentId)
    setShowReplyForm(false)
  }

  const handleViewMoreReplies = () => {
    setRepliesToShow((prev) => prev + 2) // Load 2 more replies each time
  }

  return (
    <div
      className={`${
        comment.parentCommentId ? "ml-5" : "ml-0"
      } mt-5 border rounded-lg pt-8 pb-8 pr-4 pl-4 bg-slate-50 text-sm lg:text-base`}
    >
      <div>
        <strong>{comment.author.username}</strong> - {comment.content}
      </div>
      <div className="text-sm text-gray-500">
        {new Date(comment.createdAt).toLocaleString()}
      </div>

      {/* Reply button */}
      {session && depth < 2 && (
        <button
          onClick={handleShowReplyForm}
          className="text-blue-500 text-sm mt-2"
        >
          {showReplyForm ? "Cancel" : "Reply"}
        </button>
      )}

      {/* Show reply form if reply button is clicked */}
      {showReplyForm && session && (
        <CommentForm
          stratId={stratId}
          parentCommentId={comment.id}
          onCommentPosted={handleReplyPosted}
        />
      )}

      {/* Display replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.slice(0, repliesToShow).map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReplyPosted={() => onReplyPosted(comment.parentCommentId)}
              depth={depth + 1}
              stratId={stratId}
            />
          ))}
          {/* "View more replies" button if there are more replies */}
          {repliesToShow < comment.replies.length && (
            <button
              onClick={handleViewMoreReplies}
              className="text-blue-500 text-sm mt-2"
            >
              View more replies
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function CommentsList({ stratId }: CommentsListProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<CommentType[]>([])

  const fetchComments = async (
    stratId: string,
    parentCommentId: number | null = null
  ) => {
    const url = parentCommentId
      ? `/api/comments/get?stratId=${stratId}&parentId=${parentCommentId}`
      : `/api/comments/get?stratId=${stratId}`

    const response = await fetch(url, { method: "GET" })

    if (response.ok) {
      const comments = await response.json()
      return comments
    } else {
      console.error("Failed to fetch comments")
      return []
    }
  }

  const handleCommentPosted = (parentCommentId: number | null = null) => {
    if (parentCommentId) {
      // Refresh replies only for the specific parent comment
      fetchComments(stratId, parentCommentId).then((replies) => {
        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === parentCommentId) {
              // Merge the new replies with the existing ones
              return { ...comment, replies }
            }
            return comment
          })
        )
      })
    } else {
      // Refresh all comments if no parentId is specified
      fetchComments(stratId).then((data) => setComments(data))
    }
  }

  useEffect(() => {
    fetchComments(stratId).then((data) => setComments(data))
  }, [stratId])

  return (
    <div className="mb-52 mt-16">
      {session && (
        <CommentForm
          stratId={stratId}
          onCommentPosted={() => handleCommentPosted()}
        />
      )}
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          stratId={stratId}
          comment={comment}
          onReplyPosted={handleCommentPosted}
          depth={0} // Initial depth
        />
      ))}
    </div>
  )
}
