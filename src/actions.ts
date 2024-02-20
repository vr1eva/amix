"use server"
import { currentUser, clerkClient } from "@clerk/nextjs"
import { CreateThreadArgs, CreateThreadResponse, GetMessagesResponse, GetMessagesArgs, GetThreadResponse, ROLE_ENUM, RetrieveThreadArgs, RetrieveThreadResponse, SaveThreadMetadataArgs, SaveThreadMetadataResponse, AddContentToThreadResponse } from "./types"
import OpenAI from "openai"
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function getThread(): Promise<GetThreadResponse> {
    const user = await currentUser()
    if (!user) {
        return {
            error: "Could not find user in data"
        }
    }
    const assistantThreadId = user.privateMetadata.threadId as string
    if (!assistantThreadId) {
        const { thread: newThread, error: errorCreatingThread } = await createThread({ userId: user.id })
        if (errorCreatingThread || !newThread) {
            return {
                error: errorCreatingThread
            }
        }
        const { error: errorSavingThreadMetadata, threadId } = await saveThreadMetadata({ threadId: newThread.id, userId: user.id })
        if (errorSavingThreadMetadata || !threadId) {
            return {
                error: errorSavingThreadMetadata
            }
        }
        return {
            thread: newThread,
            error: null
        }
    }
    const { thread, error: errorRetrievingThread } = await retrieveThread({ threadId: assistantThreadId })
    if (errorRetrievingThread || !thread) {
        return {
            error: errorRetrievingThread
        }
    }
    return {
        thread, error: null
    }
}

async function createThread({ userId }: CreateThreadArgs): Promise<CreateThreadResponse> {
    const thread = await openai.beta.threads.create({
        metadata: {
            userId
        }
    })
    if (!thread) {
        return {
            error: "Could not create thread"
        }
    }

    return {
        thread,
        error: null
    }
}

async function saveThreadMetadata({ threadId, userId }: SaveThreadMetadataArgs): Promise<SaveThreadMetadataResponse> {
    const updatedUser = await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
            threadId
        },
    });

    if (!updatedUser || !updatedUser.privateMetadata.threadId) {
        return { error: "Error saving thread metadata" }
    }

    return { threadId: updatedUser.privateMetadata.threadId as string, error: null }
}


async function retrieveThread({ threadId }: RetrieveThreadArgs): Promise<RetrieveThreadResponse> {
    const thread = await openai.beta.threads.retrieve(threadId)
    if (!thread) {
        return {
            error: "Could not fetch thread."
        }
    }
    return {
        thread,
        error: null
    }
}

export async function addContentToThread(state: any, formData: FormData): Promise<AddContentToThreadResponse> {
    const [content, threadId] = [formData.get("content") as string, formData.get("threadId") as string]
    try {
        await openai.beta.threads.messages.create(threadId, {
            content,
            role: 'user' as ROLE_ENUM,
            file_ids: [],
            metadata: null
        })

        revalidatePath("/")
        return {
            message: "Done."
        }

    } catch (error) {
        console.error(error)
        throw new Error('Could not add content to the Thread')
    }
}

export async function getMessages({ threadId }: GetMessagesArgs): Promise<GetMessagesResponse> {
    const messages = await openai.beta.threads.messages.list(threadId, { order: "asc" })
    if (!messages) {
        return {
            error: "Failed to get messages",
        }
    }

    return {
        messages: messages.data,
        error: null
    }
}