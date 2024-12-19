// Function to post a comment or reply
export default async function postComment(
  content: string,
  strategyId: string,
  parentCommentId?: number
) {
  const response = await fetch(`/api/comments/post?stratId=${strategyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      parentCommentId: parentCommentId || null, // Send null if no parentCommentId
    }),
  })

  if (response.ok) {
    const result = await response.json()
    console.log("Comment posted:", result)
    return true
  } else {
    console.error("Failed to post comment")
    return false
  }
}
