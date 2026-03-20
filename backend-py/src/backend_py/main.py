import asyncio
from collections.abc import AsyncIterable

from fastapi import FastAPI
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    name: str
    description: str | None


class ChatMessage(BaseModel):
    message: str


items = [
    Item(name="Plumbus", description="A multi-purpose household device."),
    Item(name="Portal Gun", description="A portal opening device."),
    Item(name="Meeseeks Box", description="A box that summons a Meeseeks."),
]


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/stream", response_class=EventSourceResponse)
async def sse_items() -> AsyncIterable[Item]:
    for item in items:
        yield item
        await asyncio.sleep(1)


@app.post("/api/chat/stream", response_class=EventSourceResponse)
async def chat_stream() -> AsyncIterable[ServerSentEvent]:
    for item in list("われわれは地球人だ"):
        yield ServerSentEvent(data=ChatMessage(message=item))
        await asyncio.sleep(1)

    yield ServerSentEvent(raw_data="[DONE]", event="done")
