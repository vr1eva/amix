import { Thread } from "@/components/thread"
import { UserButton } from "@clerk/nextjs";


export default function Page() {
  return (
    <main className="h-screen px-2 py-4">
      <UserButton />
      <Thread />
    </main>
  )
}
