
import { Thread } from "openai/resources/beta/index"
import { ThreadMessage, MessageCreateParams, MessageContentText, MessageContentImageFile } from "openai/resources/beta/threads/index.mjs"

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

export interface ThreadProps {
    thread: Thread,
    messages: ThreadMessage[]
}

export interface ThreadMessageProps {
    message: ThreadMessage
}

export enum ROLE_ENUM {
    user = "user"
}

export interface GetMessagesArgs {
    threadId: string
}

export type GetMessagesResponse = {
    messages?: ThreadMessage[],
    error: ActionError
}

export interface TextContentProps {
    content: MessageContentText
}

export interface MediaContentProps {
    content: MessageContentImageFile
}

export type AddContentToThreadResponse = {
    message: string
}