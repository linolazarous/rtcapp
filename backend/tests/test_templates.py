"""
Tests for CursorCode AI Templates Gallery Feature
Tests template listing, filtering, single template retrieval, and project creation from templates
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from previous testing
TEST_EMAIL = "test@cursorcode.ai"
TEST_PASSWORD = "Test123456!"

class TestTemplatesPublic:
    """Templates endpoints - public access (no auth required)"""
    
    def test_get_all_templates(self):
        """GET /api/templates should return 8 templates with categories"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "templates" in data, "Response should have 'templates' key"
        assert "categories" in data, "Response should have 'categories' key"
        
        templates = data["templates"]
        categories = data["categories"]
        
        # Should have exactly 8 templates
        assert len(templates) == 8, f"Expected 8 templates, got {len(templates)}"
        
        # Check categories list
        expected_categories = ["saas", "ecommerce", "content", "backend", "website", "realtime", "ai", "mobile"]
        for cat in expected_categories:
            assert cat in categories, f"Category '{cat}' should be in categories list"
        
        print(f"✅ GET /api/templates: {len(templates)} templates, {len(categories)} categories")

    def test_template_fields(self):
        """Each template should have all required fields"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        
        templates = response.json()["templates"]
        required_fields = ["id", "name", "description", "category", "icon", "gradient", 
                          "tech_stack", "prompt", "complexity", "estimated_credits", "popular"]
        
        for template in templates:
            for field in required_fields:
                assert field in template, f"Template '{template.get('id', 'unknown')}' missing field '{field}'"
        
        print(f"✅ All 8 templates have all required fields")

    def test_filter_by_category_saas(self):
        """GET /api/templates?category=saas should return only saas templates"""
        response = requests.get(f"{BASE_URL}/api/templates", params={"category": "saas"})
        assert response.status_code == 200
        
        templates = response.json()["templates"]
        assert len(templates) >= 1, "Should have at least 1 saas template"
        
        for t in templates:
            assert t["category"] == "saas", f"Template '{t['name']}' has wrong category: {t['category']}"
        
        print(f"✅ Filter by saas: {len(templates)} template(s)")

    def test_filter_by_category_backend(self):
        """GET /api/templates?category=backend should return only backend templates"""
        response = requests.get(f"{BASE_URL}/api/templates", params={"category": "backend"})
        assert response.status_code == 200
        
        templates = response.json()["templates"]
        for t in templates:
            assert t["category"] == "backend", f"Template '{t['name']}' has wrong category"
        
        print(f"✅ Filter by backend: {len(templates)} template(s)")

    def test_filter_by_category_ecommerce(self):
        """GET /api/templates?category=ecommerce should return ecommerce templates"""
        response = requests.get(f"{BASE_URL}/api/templates", params={"category": "ecommerce"})
        assert response.status_code == 200
        
        templates = response.json()["templates"]
        for t in templates:
            assert t["category"] == "ecommerce"
        
        print(f"✅ Filter by ecommerce: {len(templates)} template(s)")

    def test_filter_by_all_returns_all(self):
        """GET /api/templates?category=all should return all templates"""
        response = requests.get(f"{BASE_URL}/api/templates", params={"category": "all"})
        assert response.status_code == 200
        
        templates = response.json()["templates"]
        assert len(templates) == 8, f"'all' category should return 8 templates, got {len(templates)}"
        
        print(f"✅ Filter by 'all': {len(templates)} templates")

    def test_get_single_template_saas_dashboard(self):
        """GET /api/templates/saas-dashboard should return the SaaS Dashboard template"""
        response = requests.get(f"{BASE_URL}/api/templates/saas-dashboard")
        assert response.status_code == 200
        
        template = response.json()
        assert template["id"] == "saas-dashboard"
        assert template["name"] == "SaaS Dashboard"
        assert template["category"] == "saas"
        assert "tech_stack" in template
        assert len(template["tech_stack"]) > 0
        assert "prompt" in template
        assert len(template["prompt"]) > 50  # Should have a substantial prompt
        
        print(f"✅ GET /api/templates/saas-dashboard: {template['name']}")

    def test_get_single_template_ecommerce_store(self):
        """GET /api/templates/ecommerce-store should return the E-Commerce Store template"""
        response = requests.get(f"{BASE_URL}/api/templates/ecommerce-store")
        assert response.status_code == 200
        
        template = response.json()
        assert template["id"] == "ecommerce-store"
        assert template["name"] == "E-Commerce Store"
        
        print(f"✅ GET /api/templates/ecommerce-store: {template['name']}")

    def test_get_single_template_not_found(self):
        """GET /api/templates/nonexistent should return 404"""
        response = requests.get(f"{BASE_URL}/api/templates/nonexistent")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print(f"✅ GET /api/templates/nonexistent returns 404")

    def test_template_ids_match_expected(self):
        """Verify all 8 expected template IDs exist"""
        expected_ids = [
            "saas-dashboard", "ecommerce-store", "blog-platform", "api-backend",
            "portfolio-site", "realtime-chat", "ai-assistant", "mobile-app"
        ]
        
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        
        template_ids = [t["id"] for t in response.json()["templates"]]
        
        for expected_id in expected_ids:
            assert expected_id in template_ids, f"Template '{expected_id}' not found"
        
        print(f"✅ All 8 expected template IDs present")


class TestTemplatesAuthenticated:
    """Templates endpoints - authenticated access (creating projects from templates)"""
    
    @pytest.fixture(scope="class")
    def auth_token(self):
        """Get authentication token for testing"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip(f"Authentication failed: {response.text}")

    def test_create_project_from_template_unauthenticated(self):
        """POST /api/templates/{id}/create without auth should return 403"""
        response = requests.post(f"{BASE_URL}/api/templates/saas-dashboard/create")
        assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
        
        print(f"✅ POST /api/templates/saas-dashboard/create without auth: {response.status_code}")

    def test_create_project_from_saas_dashboard_template(self, auth_token):
        """POST /api/templates/saas-dashboard/create should create a project"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/api/templates/saas-dashboard/create", headers=headers)
        
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}: {response.text}"
        
        project = response.json()
        assert "id" in project, "Project should have an ID"
        assert project["name"] == "SaaS Dashboard", f"Expected name 'SaaS Dashboard', got '{project.get('name')}'"
        assert "Modern analytics dashboard" in project["description"], "Description should match template"
        assert len(project["tech_stack"]) > 0, "Tech stack should be populated"
        assert "React" in project["tech_stack"], "Tech stack should include React"
        
        # Clean up - delete the created project
        cleanup_response = requests.delete(f"{BASE_URL}/api/projects/{project['id']}", headers=headers)
        assert cleanup_response.status_code in [200, 204], f"Failed to cleanup project: {cleanup_response.status_code}"
        
        print(f"✅ Created project from saas-dashboard template: {project['id']}")

    def test_create_project_from_portfolio_template(self, auth_token):
        """POST /api/templates/portfolio-site/create should create a portfolio project"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/api/templates/portfolio-site/create", headers=headers)
        
        assert response.status_code in [200, 201], f"Expected 200/201, got {response.status_code}"
        
        project = response.json()
        assert project["name"] == "Portfolio Website"
        assert "developer portfolio" in project["description"].lower() or "portfolio" in project["description"].lower()
        
        # Clean up
        requests.delete(f"{BASE_URL}/api/projects/{project['id']}", headers=headers)
        
        print(f"✅ Created project from portfolio-site template: {project['id']}")

    def test_create_project_from_nonexistent_template(self, auth_token):
        """POST /api/templates/nonexistent/create should return 404"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.post(f"{BASE_URL}/api/templates/nonexistent/create", headers=headers)
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        print(f"✅ POST /api/templates/nonexistent/create returns 404")


class TestTemplateFields:
    """Verify template field values"""
    
    def test_complexity_values(self):
        """All templates should have valid complexity values"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        
        valid_complexities = ["beginner", "intermediate", "advanced"]
        
        for template in response.json()["templates"]:
            assert template["complexity"] in valid_complexities, \
                f"Template '{template['name']}' has invalid complexity: {template['complexity']}"
        
        print(f"✅ All templates have valid complexity values")

    def test_estimated_credits(self):
        """All templates should have positive estimated_credits"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        
        for template in response.json()["templates"]:
            assert template["estimated_credits"] > 0, \
                f"Template '{template['name']}' should have positive estimated_credits"
        
        print(f"✅ All templates have positive estimated_credits")

    def test_popular_templates(self):
        """Check that some templates are marked as popular"""
        response = requests.get(f"{BASE_URL}/api/templates")
        assert response.status_code == 200
        
        templates = response.json()["templates"]
        popular_count = sum(1 for t in templates if t.get("popular", False))
        
        assert popular_count >= 1, "At least 1 template should be marked as popular"
        
        print(f"✅ {popular_count} templates marked as popular")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
