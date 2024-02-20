"use client"
import { useFormState } from 'react-dom'
import { useOptimistic } from 'react'
import { addContentToThread, getMessages } from "@/actions";
import { ThreadProps, ThreadMessageProps, TextContentProps, MediaContentProps, OBJECT_TYPE_ENUM, ROLE_ENUM } from "@/types";
import { SubmitButton } from '@/components/submit-button'
import { MessageContentText } from 'openai/resources/beta/threads/index';

const initialState = {
    message: '',
}
export function Thread({ thread, messages }: ThreadProps) {
    const [state, formAction] = useFormState(addContentToThread, initialState)
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        messages,
        (state, newContent) => {
            return (
                [
                    ...state,
                    {
                        id: "idk",
                        assistant_id: null,
                        content: [{ type: "text", text: { annotations: [], value: newContent } } as MessageContentText],
                        created_at: 2,
                        file_ids: [],
                        metadata: null,
                        object: 'thread.message' as OBJECT_TYPE_ENUM,
                        role: 'user' as ROLE_ENUM,
                        run_id: null,
                        thread_id: thread.id
                    }
                ]
            )
        }
    );




    return <>
        {optimisticMessages.map(message => (
            <ThreadContent key={message.id} message={message} />
        ))}
        <form
            action={async (formData: FormData) => {
                const newContent = formData.get('content')
                addOptimisticMessage(newContent)
                formAction(formData)
            }}
        >
            <input name="content" placeholder="Escribe algo" />
            <input name="threadId" readOnly value={thread.id} hidden />
            <p>{state?.message}</p>
            <SubmitButton />
        </form>
    </>
}

function ThreadContent({ message }: ThreadMessageProps) {
    return (
        message.content.map((pieceOfContent, index) => (pieceOfContent.type === "text" ? <TextContent key={index} content={pieceOfContent} /> : <MediaContent content={pieceOfContent} key={index} />))
    )
}

function TextContent({ content }: TextContentProps) {
    return (
        <p>{content.text.value}</p>
    )
}

function MediaContent({ content }: MediaContentProps) {
    return (
        <p>File {content.image_file.file_id}</p>
    )
}