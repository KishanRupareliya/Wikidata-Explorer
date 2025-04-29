from fastapi import FastAPI, HTTPException #Build an async REST API server easily
from fastapi.middleware.cors import CORSMiddleware #Allow frontend apps to access the backend
import httpx #Async HTTP client to call external services (Wikidata)
from httpx import ReadTimeout
from pydantic import BaseModel #Define request/response models (strong typing)
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

WIKIDATA_SPARQL_URL = "https://query.wikidata.org/sparql"

async def run_sparql_query(query: str):
    headers = {
        "Accept": "application/sparql-results+json",
        "User-Agent": "WikidataExplorer/1.0 (contact@example.com)"
    }
    async with httpx.AsyncClient(timeout=45.0) as client:  # <== important
        response = await client.get(
            "https://query.wikidata.org/sparql",
            params={"query": query},
            headers=headers
        )
        response.raise_for_status()
        return response.json()

@app.get("/")
async def root():
    return {"message": "Wikidata SPARQL Explorer API is running"}

@app.get("/api/search", response_model=List[SearchResult])
async def search_wikidata(query: str):
    escaped_query = query.replace('"', '\\"')
    sparql_query = f"""
    SELECT ?item ?itemLabel ?itemDescription WHERE {{
      SERVICE wikibase:mwapi {{
        bd:serviceParam wikibase:endpoint "www.wikidata.org";
                        wikibase:api "EntitySearch";
                        mwapi:search "{escaped_query}";
                        mwapi:language "en".
        ?item wikibase:apiOutputItem mwapi:item.
        ?itemLabel wikibase:apiOutput mwapi:label.
      }}
      OPTIONAL {{
        ?item schema:description ?itemDescription.
        FILTER(LANG(?itemDescription) = "en")
      }}
    }}
    LIMIT 10
    """

    try:
        data = await run_sparql_query(sparql_query)
        results = []
        for item in data["results"]["bindings"]:
            results.append(SearchResult(
                id=item["item"]["value"].split("/")[-1],
                label=item["itemLabel"]["value"],
                description=item.get("itemDescription", {}).get("value")
            ))
        return results
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

    
@app.get("/api/entity/{entity_id}", response_model=EntityDetails)
async def get_entity_details(entity_id: str):
    sparql_query = f"""
    SELECT ?property ?propertyLabel ?value ?valueLabel WHERE {{
      wd:{entity_id} ?p ?statement.
      ?statement ?ps ?value.
      ?property wikibase:directClaim ?ps.
      SERVICE wikibase:label {{ bd:serviceParam wikibase:language "en". }}
    }}
    """

    try:
        data = await run_sparql_query(sparql_query)
        properties_map = {}

        for item in data["results"]["bindings"]:
            prop_id = item["property"]["value"].split("/")[-1]
            value = item["valueLabel"]["value"] if "valueLabel" in item else item["value"]["value"]

            if prop_id not in properties_map:
                properties_map[prop_id] = []
            properties_map[prop_id].append(PropertyValue(value=value))

        properties = [EntityProperty(id=pid, values=vals) for pid, vals in properties_map.items()]

        # Fetch label and description separately
        label_desc_query = f"""
        SELECT ?label ?description WHERE {{
          wd:{entity_id} rdfs:label ?label.
          FILTER(LANG(?label) = "en").
          OPTIONAL {{ wd:{entity_id} schema:description ?description. FILTER(LANG(?description) = "en") }}
        }}
        """

        label_data = await run_sparql_query(label_desc_query)
        bindings = label_data["results"]["bindings"][0]

        label = bindings["label"]["value"]
        description = bindings.get("description", {}).get("value")

        return EntityDetails(
            id=entity_id,
            label=label,
            description=description,
            properties=properties
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn #Run the FastAPI app server
    uvicorn.run(app, host="0.0.0.0", port=8000)
