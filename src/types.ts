
import { Thread } from "openai/resources/beta/index"
import { ThreadMessage, MessageCreateParams, MessageContentText, MessageContentImageFile, Run } from "openai/resources/beta/threads/index.mjs"

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

export enum OBJECT_TYPE_ENUM {
    message = "thread.message"
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

export interface CreateMessageArgs {
    message: MessageCreateParams;
    threadId: string
}

export type CreateMessageResponse = {
    newMessage?: ThreadMessage
    error: ActionError
}

export interface RunAssistantAgainstThreadArgs {
    threadId: string;
}

export type RunAssistantAgainstThreadResponse = {
    run?: Run;
    error: ActionError
}

export interface CreateRunArgs {
    threadId: string,
    assistantId: string
}

export type CreateRunResponse = {
    run?: Run;
    error: ActionError
}