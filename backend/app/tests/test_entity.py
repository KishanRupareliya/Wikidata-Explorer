def test_get_entity_success():
    """Test successful entity details retrieval"""
    # Use a known stable entity ID (Q1028 for Chemnitz)
    response = client.get("/api/entity/Q1028")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "label" in data
    assert "properties" in data
    assert isinstance(data["properties"], list)

def test_get_nonexistent_entity():
    """Test with non-existent entity ID"""
    response = client.get("/api/entity/Q999999999999")
    assert response.status_code == 500
    assert "Failed to fetch entity" in response.json()["detail"]

def test_entity_error_handling(monkeypatch):
    """Test error handling when entity fetch fails"""
    def mock_get(*args, **kwargs):
        raise Exception("Entity Fetch Error")
    
    monkeypatch.setattr("httpx.AsyncClient.get", mock_get)
    response = client.get("/api/entity/Q1028")
    assert response.status_code == 500
    assert "Entity Fetch Error" in response.json()["detail"]