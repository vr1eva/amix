import { addContentToThread, getMessages } from "@/actions";
import { ThreadProps, ThreadMessageProps, TextContentProps, MediaContentProps } from "@/types";

async function getData({ threadId }: { threadId: string }) {
    const { error, messages } = await getMessages({ threadId })
    if (error || !messages) {
        throw new Error('Could not fetch messages')
    }
    return { messages }
}

export async function Thread({ thread }: ThreadProps) {
    const { messages } = await getData({ threadId: thread.id })
    const addContentToThreadWithId = addContentToThread.bind(null, thread.id as string)

    return <>
        {messages.map(message => (
            <ThreadMessage key={message.id} message={message} />
        ))}
        <form action={addContentToThreadWithId}>
            <input name="content" placeholder="Escribe algo" />
            <button type="submit" >enviar</button>
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