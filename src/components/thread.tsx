"use client"
import { useFormState } from 'react-dom'
import { addContentToThread, getMessages } from "@/actions";
import { ThreadProps, ThreadMessageProps, TextContentProps, MediaContentProps } from "@/types";
import { SubmitButton } from '@/components/submit-button'

const initialState = {
    message: '',
}
export function Thread({ thread, messages }: ThreadProps) {
    const [state, formAction] = useFormState(addContentToThread, initialState)

    return <>
        {messages.map(message => (
            <ThreadMessage key={message.id} message={message} />
        ))}
        <form action={formAction}>
            <input name="content" placeholder="Escribe algo" />
            <input name="threadId" readOnly value={thread.id} hidden />
            <p>{state?.message}</p>
            <SubmitButton />
        </form>
    </>
}

function ThreadMessage({ message }: ThreadMessageProps) {
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