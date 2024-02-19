
import { Thread } from "openai/resources/beta/index"

export type ActionError = null | string

export type CreateThreadResponse = {
    thread?: Thread
    error: ActionError
}

export interface CreateThreadArgs {
    userId: string
}

export interface SaveThreadMetadataArgs {
    threadId: string;
    userId: string;
}

export type SaveThreadMetadataResponse = {
    threadId?: string;
    error: ActionError
}

export interface RetrieveThreadArgs {
    threadId: string
}

export type RetrieveThreadResponse = {
    thread?: Thread;
    error: ActionError
}

export type GetThreadResponse = {
    thread?: Thread;
    error: ActionError
}

export interface ThreadArgs {
    thread: Thread
}