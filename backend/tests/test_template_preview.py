"""
Backend tests for Template Preview Mode - Iteration 5
Tests for: 8 templates with full preview functionality, project creation from templates
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "test@cursorcode.ai"
TEST_PASSWORD = "Test123456!"

# Expected template IDs
EXPECTED_TEMPLATE_IDS = [
    "saas-dashboard",
    "ecommerce-store",
    "blog-platform",
    "api-backend",
    "portfolio-site",
    "realtime-chat",
    "ai-assistant",
    "mobile-app"
]

@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture
def auth_token(api_client):
    """Get authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Authentication failed - skipping authenticated tests")

@pytest.fixture
def authenticated_client(api_client, auth_token):
    """Session with auth header"""
    api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
    return api_client


class TestTemplatesAPI:
    """Tests for /api/templates endpoint"""
    
    def test_get_all_templates_returns_8(self, api_client):
        """GET /api/templates returns exactly 8 templates"""
        response = api_client.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        data = response.json()
        assert "templates" in data
        assert len(data["templates"]) == 8
        print(f"✓ GET /api/templates returns 8 templates")
    
    def test_templates_have_required_fields(self, api_client):
        """Each template has all required fields for preview mode"""
        response = api_client.get(f"{BASE_URL}/api/templates")
        data = response.json()
        
        required_fields = ["id", "name", "description", "category", "icon", 
                          "gradient", "tech_stack", "prompt", "complexity", 
                          "estimated_credits", "popular"]
        
        for template in data["templates"]:
            for field in required_fields:
                assert field in template, f"Template missing '{field}': {template.get('name')}"
        print("✓ All templates have required fields for preview mode")
    
    def test_template_ids_match_expected(self, api_client):
        """All 8 expected template IDs are present"""
        response = api_client.get(f"{BASE_URL}/api/templates")
        data = response.json()
        
        template_ids = [t["id"] for t in data["templates"]]
        for expected_id in EXPECTED_TEMPLATE_IDS:
            assert expected_id in template_ids, f"Missing template: {expected_id}"
        print(f"✓ All 8 template IDs present: {template_ids}")
    
    def test_categories_returned(self, api_client):
        """Categories list is returned with templates"""
        response = api_client.get(f"{BASE_URL}/api/templates")
        data = response.json()
        
        assert "categories" in data
        assert len(data["categories"]) > 0
        print(f"✓ Categories returned: {data['categories']}")


class TestIndividualTemplateDetails:
    """Tests for /api/templates/{template_id} endpoint"""
    
    @pytest.mark.parametrize("template_id", EXPECTED_TEMPLATE_IDS)
    def test_get_template_by_id(self, api_client, template_id):
        """GET /api/templates/{id} returns correct template details"""
        response = api_client.get(f"{BASE_URL}/api/templates/{template_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == template_id
        assert "name" in data
        assert "description" in data
        assert "tech_stack" in data
        assert isinstance(data["tech_stack"], list)
        print(f"✓ Template {template_id} details retrieved correctly")
    
    def test_get_saas_dashboard_details(self, api_client):
        """SaaS Dashboard template has expected content"""
        response = api_client.get(f"{BASE_URL}/api/templates/saas-dashboard")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "SaaS Dashboard"
        assert data["category"] == "saas"
        assert data["complexity"] == "advanced"
        assert data["estimated_credits"] == 5
        assert data["popular"] == True
        assert "React" in data["tech_stack"]
        assert "FastAPI" in data["tech_stack"]
        print("✓ SaaS Dashboard template has correct content")
    
    def test_get_ai_assistant_details(self, api_client):
        """AI Assistant template has expected content"""
        response = api_client.get(f"{BASE_URL}/api/templates/ai-assistant")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "AI Assistant"
        assert data["category"] == "ai"
        assert data["icon"] == "bot"
        assert "OpenAI" in data["tech_stack"]
        print("✓ AI Assistant template has correct content")
    
    def test_nonexistent_template_returns_404(self, api_client):
        """GET /api/templates/nonexistent returns 404"""
        response = api_client.get(f"{BASE_URL}/api/templates/nonexistent-template")
        assert response.status_code == 404
        print("✓ Nonexistent template returns 404")


class TestTemplateCreation:
    """Tests for /api/templates/{id}/create endpoint"""
    
    def test_create_without_auth_fails(self, api_client):
        """POST /api/templates/{id}/create without auth returns 401/403"""
        response = api_client.post(f"{BASE_URL}/api/templates/saas-dashboard/create")
        assert response.status_code in [401, 403]
        print("✓ Create template without auth fails correctly")
    
    def test_create_project_from_saas_template(self, authenticated_client):
        """Create project from SaaS Dashboard template"""
        response = authenticated_client.post(f"{BASE_URL}/api/templates/saas-dashboard/create")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "SaaS Dashboard"
        assert "id" in data
        assert "user_id" in data
        assert "React" in data["tech_stack"]
        assert "FastAPI" in data["tech_stack"]
        
        # Clean up - delete the project
        project_id = data["id"]
        authenticated_client.delete(f"{BASE_URL}/api/projects/{project_id}")
        print(f"✓ Project created from SaaS template, ID: {project_id}")
    
    def test_create_project_from_ecommerce_template(self, authenticated_client):
        """Create project from E-Commerce template"""
        response = authenticated_client.post(f"{BASE_URL}/api/templates/ecommerce-store/create")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "E-Commerce Store"
        assert "MongoDB" in data["tech_stack"]
        
        # Clean up
        authenticated_client.delete(f"{BASE_URL}/api/projects/{data['id']}")
        print(f"✓ Project created from E-Commerce template")
    
    def test_create_project_from_ai_assistant_template(self, authenticated_client):
        """Create project from AI Assistant template"""
        response = authenticated_client.post(f"{BASE_URL}/api/templates/ai-assistant/create")
        assert response.status_code == 200
        
        data = response.json()
        assert data["name"] == "AI Assistant"
        assert "OpenAI" in data["tech_stack"]
        
        # Clean up
        authenticated_client.delete(f"{BASE_URL}/api/projects/{data['id']}")
        print(f"✓ Project created from AI Assistant template")
    
    def test_create_from_nonexistent_template_fails(self, authenticated_client):
        """POST /api/templates/nonexistent/create returns 404"""
        response = authenticated_client.post(f"{BASE_URL}/api/templates/nonexistent-template/create")
        assert response.status_code == 404
        print("✓ Create from nonexistent template returns 404")


class TestTemplateComplexityAndCredits:
    """Verify complexity and credits values across templates"""
    
    def test_complexity_values_valid(self, api_client):
        """All templates have valid complexity values"""
        response = api_client.get(f"{BASE_URL}/api/templates")
        data = response.json()
        
        valid_complexities = ["beginner", "intermediate", "advanced"]
        for template in data["templates"]:
            assert template["complexity"] in valid_complexities, \
                f"Invalid complexity for {template['name']}: {template['complexity']}"
        print("✓ All complexity values are valid")
    
    def test_estimated_credits_positive(self, api_client):
        """All templates have positive estimated credits"""
        response = api_client.get(f"{BASE_URL}/api/templates")
        data = response.json()
        
        for template in data["templates"]:
            assert template["estimated_credits"] > 0, \
                f"Non-positive credits for {template['name']}"
        print("✓ All estimated credits are positive")
    
    def test_popular_templates_marked(self, api_client):
        """Popular templates are correctly identified"""
        response = api_client.get(f"{BASE_URL}/api/templates")
        data = response.json()
        
        popular_templates = [t["id"] for t in data["templates"] if t["popular"]]
        assert len(popular_templates) >= 2, "At least 2 templates should be marked popular"
        print(f"✓ Popular templates: {popular_templates}")


class TestHealthAndBasicEndpoints:
    """Basic API health checks"""
    
    def test_health_endpoint(self, api_client):
        """Health endpoint is healthy"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health endpoint returns healthy")
    
    def test_root_endpoint(self, api_client):
        """Root API endpoint returns version info"""
        response = api_client.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "version" in data
        print(f"✓ API version: {data.get('version')}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
