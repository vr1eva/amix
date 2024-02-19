import { auth, redirectToSignIn } from "@clerk/nextjs"
import { Thread } from "@/components/thread"
import { UserButton } from "@clerk/nextjs";
import { getThread } from "@/actions";

async function getData() {
  const { error, thread } = await getThread()
  if (error || !thread) {
    throw new Error('Could not fetch Thread')
  }
  return thread
}

export default async function Page() {
  const { userId }: { userId: string | null } = auth();
  if (!userId) {
    redirectToSignIn()
  }

  const thread = await getData()

  return (
    <main className="h-screen px-2 py-4">
      <UserButton />
      <Thread thread={thread} />
    </main>
  )
}
