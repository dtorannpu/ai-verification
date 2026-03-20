import asyncio
from collections.abc import AsyncIterable

from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

class ChatMessage(BaseModel):
    message: str


@app.post("/api/chat/stream", response_class=EventSourceResponse)
async def chat_stream(request: ChatRequest) -> AsyncIterable[ServerSentEvent]:
    for item in list(request.message):
        yield ServerSentEvent(data=ChatMessage(message=item))
        await asyncio.sleep(1)

    yield ServerSentEvent(raw_data="[DONE]", event="done")
