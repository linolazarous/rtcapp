#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class RTCAPITester:
    def __init__(self, base_url="https://rtc-lms.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
            
        if auth_required and self.admin_token:
            test_headers['Authorization'] = f'Bearer {self.admin_token}'
        elif auth_required and self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                self.log(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })
                return False, {}

        except requests.exceptions.RequestException as e:
            self.log(f"❌ {name} - Network Error: {str(e)}")
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            return False, {}

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        self.log("\n=== HEALTH CHECK TESTS ===")
        
        # Test root endpoint
        self.run_test("API Root", "GET", "", 200)
        
        # Test health endpoint
        self.run_test("Health Check", "GET", "health", 200)

    def test_courses_endpoints(self):
        """Test course-related endpoints"""
        self.log("\n=== COURSES TESTS ===")
        
        # Get all courses
        success, courses_data = self.run_test("Get All Courses", "GET", "courses", 200)
        if success and courses_data:
            self.log(f"   Found {len(courses_data)} courses")
            
            # Test course filtering
            self.run_test("Filter Diploma Courses", "GET", "courses?course_type=diploma", 200)
            self.run_test("Filter Bachelor Courses", "GET", "courses?course_type=bachelor", 200)
            self.run_test("Filter Certification Courses", "GET", "courses?course_type=certification", 200)
            
            # Test individual course if courses exist
            if courses_data and len(courses_data) > 0:
                course_id = courses_data[0]['id']
                self.run_test("Get Single Course", "GET", f"courses/{course_id}", 200)
                
                # Test non-existent course
                self.run_test("Get Non-existent Course", "GET", "courses/invalid-id", 404)

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        self.log("\n=== AUTHENTICATION TESTS ===")
        
        # Test admin login
        admin_creds = {
            "email": "admin@righttechcentre.com",
            "password": "admin123"
        }
        
        success, login_data = self.run_test("Admin Login", "POST", "auth/login", 200, admin_creds)
        if success and login_data and 'access_token' in login_data:
            self.admin_token = login_data['access_token']
            self.log(f"   Admin token obtained")
            
            # Test /me endpoint with admin token
            self.run_test("Get Admin Profile", "GET", "auth/me", 200, auth_required=True)
        else:
            self.log("❌ Admin login failed - cannot test protected endpoints")
        
        # Test invalid login
        invalid_creds = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        self.run_test("Invalid Login", "POST", "auth/login", 401, invalid_creds)
        
        # Test registration with new user
        test_user = {
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!",
            "full_name": "Test User",
            "role": "student"
        }
        
        success, reg_data = self.run_test("User Registration", "POST", "auth/register", 200, test_user)
        if success and reg_data and 'access_token' in reg_data:
            self.token = reg_data['access_token']
            self.log(f"   Student token obtained")

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        self.log("\n=== ADMIN ENDPOINTS TESTS ===")
        
        if not self.admin_token:
            self.log("❌ No admin token - skipping admin tests")
            return
            
        # Test analytics endpoint
        self.run_test("Analytics Overview", "GET", "analytics/overview", 200, auth_required=True)
        
        # Test users endpoint
        self.run_test("Get All Users", "GET", "users", 200, auth_required=True)

    def test_ai_endpoints(self):
        """Test AI-related endpoints"""
        self.log("\n=== AI ENDPOINTS TESTS ===")
        
        if not self.token and not self.admin_token:
            self.log("❌ No auth token - skipping AI tests")
            return
            
        # Test AI chat
        chat_message = {
            "content": "Hello, can you help me understand programming basics?",
            "course_id": None
        }
        
        self.run_test("AI Chat", "POST", "ai/chat", 200, chat_message, auth_required=True)

    def test_certificate_endpoints(self):
        """Test certificate endpoints"""
        self.log("\n=== CERTIFICATE TESTS ===")
        
        # Test certificate verification (public endpoint)
        self.run_test("Verify Invalid Certificate", "GET", "certificates/verify/INVALID-CERT", 200)
        
        if self.token or self.admin_token:
            # Test get user certificates
            self.run_test("Get User Certificates", "GET", "certificates", 200, auth_required=True)

    def run_all_tests(self):
        """Run all test suites"""
        self.log("🚀 Starting Right Tech Centre API Tests")
        self.log(f"Testing against: {self.base_url}")
        
        try:
            self.test_health_endpoints()
            self.test_courses_endpoints()
            self.test_auth_endpoints()
            self.test_admin_endpoints()
            self.test_ai_endpoints()
            self.test_certificate_endpoints()
            
        except KeyboardInterrupt:
            self.log("\n⚠️ Tests interrupted by user")
        except Exception as e:
            self.log(f"\n💥 Unexpected error: {str(e)}")
        
        # Print summary
        self.log(f"\n📊 TEST SUMMARY")
        self.log(f"Tests Run: {self.tests_run}")
        self.log(f"Tests Passed: {self.tests_passed}")
        self.log(f"Tests Failed: {self.tests_run - self.tests_passed}")
        self.log(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            self.log(f"\n❌ FAILED TESTS:")
            for failure in self.failed_tests:
                self.log(f"  - {failure['test']}: {failure.get('error', f'Expected {failure.get(\"expected\")}, got {failure.get(\"actual\")}')}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = RTCAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())