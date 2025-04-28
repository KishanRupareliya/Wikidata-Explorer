def test_search_result_model():
    """Test SearchResult model validation"""
    valid_data = {"id": "Q123", "label": "Test Label"}
    result = SearchResult(**valid_data)
    assert result.id == "Q123"
    assert result.label == "Test Label"
    assert result.description is None

    with pytest.raises(ValueError):
        SearchResult(id=None, label="Invalid")

def test_entity_details_model():
    """Test EntityDetails model validation"""
    valid_data = {
        "id": "Q123",
        "label": "Test Entity",
        "properties": [{"id": "P1", "values": [{"value": "test"}]}]
    }
    entity = EntityDetails(**valid_data)
    assert entity.id == "Q123"
    assert len(entity.properties) == 1
    assert entity.properties[0].values[0].value == "test"