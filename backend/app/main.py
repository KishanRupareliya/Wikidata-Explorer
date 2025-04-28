from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchResult(BaseModel):
    id: str
    label: str
    description: Optional[str] = None

class PropertyValue(BaseModel):
    value: str

class EntityProperty(BaseModel):
    id: str
    values: List[PropertyValue]

class EntityDetails(BaseModel):
    id: str
    label: str
    description: Optional[str] = None
    properties: List[EntityProperty]

@app.get("/")
async def root():
    return {"message": "Wikidata Explorer API is running"}

@app.get("/api/search", response_model=List[SearchResult])
async def search_wikidata(query: str):
    url = f"https://www.wikidata.org/w/api.php?action=wbsearchentities&search={query}&language=en&format=json"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            return [
                SearchResult(
                    id=item["id"],
                    label=item.get("label", ""),
                    description=item.get("description")
                )
                for item in data.get("search", [])
            ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/entity/{entity_id}", response_model=EntityDetails)
async def get_entity_details(entity_id: str):
    url = f"https://www.wikidata.org/wiki/Special:EntityData/{entity_id}.json"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            data = response.json()
            entity = data["entities"][entity_id]
            
            properties = []
            for prop_id, claims in entity.get("claims", {}).items():
                values = []
                for claim in claims:
                    if "datavalue" in claim["mainsnak"]:
                        value = str(claim["mainsnak"]["datavalue"]["value"])
                        values.append(PropertyValue(value=value))
                
                if values:
                    properties.append(EntityProperty(id=prop_id, values=values))
            
            return EntityDetails(
                id=entity_id,
                label=entity.get("labels", {}).get("en", {}).get("value", ""),
                description=entity.get("descriptions", {}).get("en", {}).get("value"),
                properties=properties
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)