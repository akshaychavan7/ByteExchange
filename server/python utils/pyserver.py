from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI
from fastapi.middleware.cors import CORSMiddleware

from tagsgen import findtags 

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncIOMotorClient(MONGO_URI)

db = client.get_database("fake_so_fse")
Tag = db.get_collection("Tag")
# Define a Pydantic model for the data expected in the POST request
class tagsGen(BaseModel):
    title: str
    description: str


# Endpoint to handle POST requests to create a new item
@app.post("/tag/generateTags/")
async def generateTags(item: tagsGen):
    text = item.title.strip() + " " + item.description.strip()
    tags = []
    async for tag in Tag.find({}, {"name": 1, "_id": 0}):
        tags.append(tag['name'])
    return findtags(text, tags)

@app.get("/")
async def root():
    return {"message": "Python Server Works"}


# Run this file to run the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("pyserver:app", host="0.0.0.0", port=8001, reload=True)
