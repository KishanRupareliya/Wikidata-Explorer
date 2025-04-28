import pytest
from fastapi.testclient import TestClient
from main import app
from models import SearchResult

client = TestClient(app)

def test_search_success():
    """Test successful search with mock response"""
    response = client.get("/api/search?query=chemnitz")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    if len(response.json()) > 0:
        assert all(isinstance(item, dict) for item in response.json())
        assert all("id" in item and "label" in item for item in response.json())

def test_search_empty_query():
    """Test search with empty query"""
    response = client.get("/api/search?query=")
    assert response.status_code == 200
    assert response.json() == []

def test_search_special_chars():
    """Test search with special characters"""
    response = client.get("/api/search?query=New%20York")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_search_error_handling(monkeypatch):
    """Test error handling when Wikidata API fails"""
    def mock_get(*args, **kwargs):
        raise Exception("API Error")
    
    monkeypatch.setattr("httpx.AsyncClient.get", mock_get)
    response = client.get("/api/search?query=chemnitz")
    assert response.status_code == 500
    assert "API Error" in response.json()["detail"]