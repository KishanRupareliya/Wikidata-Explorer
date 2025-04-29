from SPARQLWrapper import SPARQLWrapper, JSON

def query_wikidata(sparql_query):
    """
    Sends a SPARQL query to Wikidata and returns the JSON results.
    """
    sparql = SPARQLWrapper("https://query.wikidata.org/sparql")
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return results
