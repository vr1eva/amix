import { currentUser, clerkClient } from "@clerk/nextjs"
import { CreateThreadArgs, CreateThreadResponse, GetThreadResponse, RetrieveThreadArgs, RetrieveThreadResponse, SaveThreadMetadataArgs, SaveThreadMetadataResponse } from "./types"
import OpenAI from "openai"

const openai = new OpenAI();

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


