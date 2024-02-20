import { auth, redirectToSignIn } from "@clerk/nextjs"
import { Thread } from "@/components/thread"
import { UserButton } from "@clerk/nextjs";
import { getMessages, getThread } from "@/actions";

async function getData() {
  const { error: errorFetchingThread, thread } = await getThread()
  if (errorFetchingThread || !thread) {
    throw new Error('Could not fetch Thread')
  }

  const { error: errorGettingMessages, messages } = await getMessages({ threadId: thread.id })
  if (errorGettingMessages || !messages) {
    throw new Error('Could not fetch Messages')
  }
  return { thread, messages }
}

export default async function Page() {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    redirectToSignIn()
  }

  const { thread, messages } = await getData()

  return (
    <main className="h-screen px-2 py-4">
      <UserButton />
      <Thread thread={thread} messages={messages} />
    </main>
  )
}
