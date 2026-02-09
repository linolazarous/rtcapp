from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'right_tech_centre')]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'rtc_super_secret_jwt_key_2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Security
security = HTTPBearer(auto_error=False)

# Create the main app
app = FastAPI(title="Right Tech Centre API", version="1.0.0")

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
courses_router = APIRouter(prefix="/courses", tags=["Courses"])
users_router = APIRouter(prefix="/users", tags=["Users"])
enrollments_router = APIRouter(prefix="/enrollments", tags=["Enrollments"])
payments_router = APIRouter(prefix="/payments", tags=["Payments"])
ai_router = APIRouter(prefix="/ai", tags=["AI"])
certificates_router = APIRouter(prefix="/certificates", tags=["Certificates"])

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserRole:
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"

class CourseType:
    DIPLOMA = "diploma"
    BACHELOR = "bachelor"
    CERTIFICATION = "certification"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = UserRole.STUDENT

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    full_name: str
    role: str
    created_at: str
    profile_image: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Course Models
class ModuleContent(BaseModel):
    title: str
    description: str
    objectives: List[str] = []
    lessons: List[Dict[str, Any]] = []
    quiz_id: Optional[str] = None
    duration_hours: int = 4

class CourseBase(BaseModel):
    title: str
    description: str
    course_type: str
    thumbnail: Optional[str] = None
    price: float
    credit_hours: int
    duration_months: int
    instructor_id: Optional[str] = None
    is_published: bool = False

class CourseCreate(CourseBase):
    modules: List[ModuleContent] = []

class CourseResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    course_type: str
    thumbnail: Optional[str] = None
    price: float
    credit_hours: int
    duration_months: int
    instructor_id: Optional[str] = None
    is_published: bool
    modules: List[Dict[str, Any]] = []
    created_at: str
    enrolled_count: int = 0

# Enrollment Models
class EnrollmentCreate(BaseModel):
    course_id: str

class EnrollmentResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    course_id: str
    status: str
    progress: float = 0.0
    completed_modules: List[str] = []
    enrolled_at: str
    completed_at: Optional[str] = None

# Payment Models
class PaymentCreate(BaseModel):
    course_id: str
    origin_url: str

class PaymentResponse(BaseModel):
    checkout_url: str
    session_id: str

# Quiz Models
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: Optional[str] = None

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: List[int]

class QuizResult(BaseModel):
    score: float
    total_questions: int
    correct_answers: int
    passed: bool
    feedback: List[Dict[str, Any]] = []

# AI Chat Models
class AIMessage(BaseModel):
    content: str
    lesson_context: Optional[str] = None
    course_id: Optional[str] = None

class AIResponse(BaseModel):
    response: str
    session_id: str

# Certificate Models
class CertificateResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    course_id: str
    course_title: str
    user_name: str
    credit_hours: int
    issued_at: str
    certificate_number: str

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[Dict]:
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0, "password": 0})
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid authentication")
    return user

async def require_admin(user: Dict = Depends(require_auth)) -> Dict:
    if user.get("role") != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

async def require_instructor(user: Dict = Depends(require_auth)) -> Dict:
    if user.get("role") not in [UserRole.ADMIN, UserRole.INSTRUCTOR]:
        raise HTTPException(status_code=403, detail="Instructor access required")
    return user

# ==================== AUTH ROUTES ====================

@auth_router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "password": hash_password(user_data.password),
        "role": user_data.role,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "profile_image": None
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_id, user_data.role)
    
    user_response = UserResponse(
        id=user_id,
        email=user_data.email,
        full_name=user_data.full_name,
        role=user_data.role,
        created_at=user_doc["created_at"]
    )
    
    return TokenResponse(access_token=token, user=user_response)

@auth_router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["role"])
    
    user_response = UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        role=user["role"],
        created_at=user["created_at"],
        profile_image=user.get("profile_image")
    )
    
    return TokenResponse(access_token=token, user=user_response)

@auth_router.get("/me", response_model=UserResponse)
async def get_me(user: Dict = Depends(require_auth)):
    return UserResponse(**user)

# ==================== COURSES ROUTES ====================

@courses_router.get("", response_model=List[CourseResponse])
async def get_courses(
    course_type: Optional[str] = None,
    is_published: Optional[bool] = True,
    search: Optional[str] = None
):
    query = {}
    if course_type:
        query["course_type"] = course_type
    if is_published is not None:
        query["is_published"] = is_published
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    courses = await db.courses.find(query, {"_id": 0}).to_list(1000)
    return courses

@courses_router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@courses_router.post("", response_model=CourseResponse)
async def create_course(course: CourseCreate, user: Dict = Depends(require_instructor)):
    course_id = str(uuid.uuid4())
    course_doc = {
        "id": course_id,
        **course.model_dump(),
        "instructor_id": user["id"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "enrolled_count": 0
    }
    
    await db.courses.insert_one(course_doc)
    if "_id" in course_doc:
        del course_doc["_id"]
    return course_doc

@courses_router.put("/{course_id}", response_model=CourseResponse)
async def update_course(course_id: str, course_data: Dict[str, Any] = Body(...), user: Dict = Depends(require_instructor)):
    existing = await db.courses.find_one({"id": course_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if user["role"] != UserRole.ADMIN and existing.get("instructor_id") != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this course")
    
    course_data.pop("id", None)
    course_data.pop("_id", None)
    
    await db.courses.update_one({"id": course_id}, {"$set": course_data})
    updated = await db.courses.find_one({"id": course_id}, {"_id": 0})
    return updated

@courses_router.delete("/{course_id}")
async def delete_course(course_id: str, user: Dict = Depends(require_admin)):
    result = await db.courses.delete_one({"id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted successfully"}

# ==================== ENROLLMENTS ROUTES ====================

@enrollments_router.get("", response_model=List[EnrollmentResponse])
async def get_enrollments(user: Dict = Depends(require_auth)):
    enrollments = await db.enrollments.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    return enrollments

@enrollments_router.get("/{enrollment_id}", response_model=EnrollmentResponse)
async def get_enrollment(enrollment_id: str, user: Dict = Depends(require_auth)):
    enrollment = await db.enrollments.find_one(
        {"id": enrollment_id, "user_id": user["id"]}, 
        {"_id": 0}
    )
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment

@enrollments_router.post("", response_model=EnrollmentResponse)
async def create_enrollment(enrollment: EnrollmentCreate, user: Dict = Depends(require_auth)):
    # Check if already enrolled
    existing = await db.enrollments.find_one({
        "user_id": user["id"],
        "course_id": enrollment.course_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    # Verify course exists
    course = await db.courses.find_one({"id": enrollment.course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    enrollment_id = str(uuid.uuid4())
    enrollment_doc = {
        "id": enrollment_id,
        "user_id": user["id"],
        "course_id": enrollment.course_id,
        "status": "active",
        "progress": 0.0,
        "completed_modules": [],
        "enrolled_at": datetime.now(timezone.utc).isoformat(),
        "completed_at": None
    }
    
    await db.enrollments.insert_one(enrollment_doc)
    await db.courses.update_one({"id": enrollment.course_id}, {"$inc": {"enrolled_count": 1}})
    
    if "_id" in enrollment_doc:
        del enrollment_doc["_id"]
    return enrollment_doc

@enrollments_router.put("/{enrollment_id}/progress")
async def update_progress(
    enrollment_id: str, 
    module_id: str = Body(..., embed=True),
    user: Dict = Depends(require_auth)
):
    enrollment = await db.enrollments.find_one({
        "id": enrollment_id,
        "user_id": user["id"]
    })
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    completed_modules = enrollment.get("completed_modules", [])
    if module_id not in completed_modules:
        completed_modules.append(module_id)
    
    course = await db.courses.find_one({"id": enrollment["course_id"]})
    total_modules = len(course.get("modules", []))
    progress = (len(completed_modules) / total_modules * 100) if total_modules > 0 else 0
    
    update_data = {
        "completed_modules": completed_modules,
        "progress": progress
    }
    
    if progress >= 100:
        update_data["status"] = "completed"
        update_data["completed_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.enrollments.update_one({"id": enrollment_id}, {"$set": update_data})
    return {"message": "Progress updated", "progress": progress}

# ==================== PAYMENTS ROUTES ====================

@payments_router.post("/checkout", response_model=PaymentResponse)
async def create_checkout(payment: PaymentCreate, request: Request, user: Dict = Depends(require_auth)):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    course = await db.courses.find_one({"id": payment.course_id})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if already enrolled
    existing_enrollment = await db.enrollments.find_one({
        "user_id": user["id"],
        "course_id": payment.course_id
    })
    if existing_enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
    
    stripe_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
    host_url = str(request.base_url).rstrip('/')
    webhook_url = f"{host_url}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=stripe_key, webhook_url=webhook_url)
    
    success_url = f"{payment.origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{payment.origin_url}/courses/{payment.course_id}"
    
    checkout_request = CheckoutSessionRequest(
        amount=float(course["price"]),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user["id"],
            "course_id": payment.course_id,
            "course_title": course["title"]
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "user_id": user["id"],
        "course_id": payment.course_id,
        "amount": float(course["price"]),
        "currency": "usd",
        "status": "pending",
        "payment_status": "initiated",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "metadata": {
            "course_title": course["title"]
        }
    }
    await db.payment_transactions.insert_one(transaction_doc)
    
    return PaymentResponse(checkout_url=session.url, session_id=session.session_id)

@payments_router.get("/status/{session_id}")
async def get_payment_status(session_id: str, user: Dict = Depends(require_auth)):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    stripe_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
    stripe_checkout = StripeCheckout(api_key=stripe_key, webhook_url="")
    
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction record
    transaction = await db.payment_transactions.find_one({"session_id": session_id})
    if transaction:
        update_data = {
            "status": status.status,
            "payment_status": status.payment_status
        }
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": update_data}
        )
        
        # If payment successful, create enrollment
        if status.payment_status == "paid":
            existing_enrollment = await db.enrollments.find_one({
                "user_id": transaction["user_id"],
                "course_id": transaction["course_id"]
            })
            
            if not existing_enrollment:
                enrollment_doc = {
                    "id": str(uuid.uuid4()),
                    "user_id": transaction["user_id"],
                    "course_id": transaction["course_id"],
                    "status": "active",
                    "progress": 0.0,
                    "completed_modules": [],
                    "enrolled_at": datetime.now(timezone.utc).isoformat(),
                    "completed_at": None,
                    "payment_id": transaction["id"]
                }
                await db.enrollments.insert_one(enrollment_doc)
                await db.courses.update_one(
                    {"id": transaction["course_id"]},
                    {"$inc": {"enrolled_count": 1}}
                )
    
    return {
        "status": status.status,
        "payment_status": status.payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    stripe_key = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
    stripe_checkout = StripeCheckout(api_key=stripe_key, webhook_url="")
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            session_id = webhook_response.session_id
            transaction = await db.payment_transactions.find_one({"session_id": session_id})
            
            if transaction:
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {"status": "complete", "payment_status": "paid"}}
                )
                
                existing_enrollment = await db.enrollments.find_one({
                    "user_id": transaction["user_id"],
                    "course_id": transaction["course_id"]
                })
                
                if not existing_enrollment:
                    enrollment_doc = {
                        "id": str(uuid.uuid4()),
                        "user_id": transaction["user_id"],
                        "course_id": transaction["course_id"],
                        "status": "active",
                        "progress": 0.0,
                        "completed_modules": [],
                        "enrolled_at": datetime.now(timezone.utc).isoformat(),
                        "completed_at": None,
                        "payment_id": transaction["id"]
                    }
                    await db.enrollments.insert_one(enrollment_doc)
        
        return {"received": True}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"received": True}

# ==================== AI ROUTES ====================

@ai_router.post("/chat", response_model=AIResponse)
async def ai_chat(message: AIMessage, user: Dict = Depends(require_auth)):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    session_id = f"rtc-{user['id']}-{message.course_id or 'general'}"
    
    system_message = """You are an AI Tutor for Right Tech Centre, an AI-powered tech education platform.
    You help students understand course material, answer questions about programming, data science, 
    cybersecurity, AI/ML, and other tech topics. Be helpful, encouraging, and provide clear explanations.
    When explaining code, use markdown code blocks with proper syntax highlighting."""
    
    if message.lesson_context:
        system_message += f"\n\nCurrent lesson context: {message.lesson_context}"
    
    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_message
    ).with_model("openai", "gpt-5.2")
    
    user_message = UserMessage(text=message.content)
    response = await chat.send_message(user_message)
    
    # Store chat message
    chat_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "session_id": session_id,
        "course_id": message.course_id,
        "user_message": message.content,
        "ai_response": response,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.ai_chats.insert_one(chat_doc)
    
    return AIResponse(response=response, session_id=session_id)

@ai_router.post("/generate-quiz")
async def generate_quiz(
    topic: str = Body(..., embed=True),
    num_questions: int = Body(10, embed=True),
    user: Dict = Depends(require_instructor)
):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="AI service not configured")
    
    session_id = f"quiz-gen-{str(uuid.uuid4())}"
    
    system_message = """You are an expert educator creating quiz questions. 
    Generate questions in JSON format with the following structure:
    {
        "questions": [
            {
                "question": "Question text",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": 0,
                "explanation": "Brief explanation why this is correct"
            }
        ]
    }
    Make questions challenging but fair, covering key concepts."""
    
    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=system_message
    ).with_model("openai", "gpt-5.2")
    
    prompt = f"Generate {num_questions} multiple choice questions about: {topic}"
    user_message = UserMessage(text=prompt)
    response = await chat.send_message(user_message)
    
    import json
    try:
        # Try to extract JSON from response
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            questions_data = json.loads(response[start:end])
            return questions_data
    except json.JSONDecodeError:
        pass
    
    return {"raw_response": response}

# ==================== CERTIFICATES ROUTES ====================

@certificates_router.get("", response_model=List[CertificateResponse])
async def get_certificates(user: Dict = Depends(require_auth)):
    certificates = await db.certificates.find({"user_id": user["id"]}, {"_id": 0}).to_list(1000)
    return certificates

@certificates_router.get("/{certificate_id}", response_model=CertificateResponse)
async def get_certificate(certificate_id: str):
    certificate = await db.certificates.find_one({"id": certificate_id}, {"_id": 0})
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return certificate

@certificates_router.get("/verify/{certificate_number}")
async def verify_certificate(certificate_number: str):
    certificate = await db.certificates.find_one(
        {"certificate_number": certificate_number}, 
        {"_id": 0}
    )
    if not certificate:
        return {"valid": False, "message": "Certificate not found"}
    return {"valid": True, "certificate": certificate}

@certificates_router.post("", response_model=CertificateResponse)
async def generate_certificate(
    enrollment_id: str = Body(..., embed=True),
    user: Dict = Depends(require_auth)
):
    enrollment = await db.enrollments.find_one({
        "id": enrollment_id,
        "user_id": user["id"],
        "status": "completed"
    })
    if not enrollment:
        raise HTTPException(status_code=400, detail="Enrollment not found or course not completed")
    
    # Check if certificate already exists
    existing = await db.certificates.find_one({
        "user_id": user["id"],
        "course_id": enrollment["course_id"]
    })
    if existing:
        return existing
    
    course = await db.courses.find_one({"id": enrollment["course_id"]})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    cert_number = f"RTC-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"
    
    certificate_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "course_id": enrollment["course_id"],
        "course_title": course["title"],
        "user_name": user["full_name"],
        "credit_hours": course["credit_hours"],
        "issued_at": datetime.now(timezone.utc).isoformat(),
        "certificate_number": cert_number
    }
    
    await db.certificates.insert_one(certificate_doc)
    del certificate_doc["_id"] if "_id" in certificate_doc else None
    return certificate_doc

# ==================== USERS ROUTES (Admin) ====================

@users_router.get("", response_model=List[UserResponse])
async def get_users(
    role: Optional[str] = None,
    user: Dict = Depends(require_admin)
):
    query = {}
    if role:
        query["role"] = role
    users = await db.users.find(query, {"_id": 0, "password": 0}).to_list(1000)
    return users

@users_router.put("/{user_id}/role")
async def update_user_role(
    user_id: str,
    new_role: str = Body(..., embed=True),
    admin: Dict = Depends(require_admin)
):
    if new_role not in [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = await db.users.update_one({"id": user_id}, {"$set": {"role": new_role}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Role updated successfully"}

# ==================== ANALYTICS ROUTES ====================

@api_router.get("/analytics/overview")
async def get_analytics_overview(user: Dict = Depends(require_admin)):
    total_users = await db.users.count_documents({})
    total_courses = await db.courses.count_documents({})
    total_enrollments = await db.enrollments.count_documents({})
    total_certificates = await db.certificates.count_documents({})
    
    # Revenue calculation
    pipeline = [
        {"$match": {"payment_status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    revenue_result = await db.payment_transactions.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    # Users by role
    role_pipeline = [
        {"$group": {"_id": "$role", "count": {"$sum": 1}}}
    ]
    users_by_role = await db.users.aggregate(role_pipeline).to_list(10)
    
    return {
        "total_users": total_users,
        "total_courses": total_courses,
        "total_enrollments": total_enrollments,
        "total_certificates": total_certificates,
        "total_revenue": total_revenue,
        "users_by_role": {item["_id"]: item["count"] for item in users_by_role}
    }

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "Right Tech Centre API", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# ==================== INCLUDE ROUTERS ====================

api_router.include_router(auth_router)
api_router.include_router(courses_router)
api_router.include_router(users_router)
api_router.include_router(enrollments_router)
api_router.include_router(payments_router)
api_router.include_router(ai_router)
api_router.include_router(certificates_router)

app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ==================== SEED DATA ====================

@app.on_event("startup")
async def seed_courses():
    """Seed initial course catalog if empty"""
    course_count = await db.courses.count_documents({})
    if course_count > 0:
        return
    
    logger.info("Seeding course catalog...")
    
    # Diploma Programs (60 Credit Hours, 15 Modules)
    diploma_programs = [
        "Diploma in Web Development",
        "Diploma in Artificial Intelligence",
        "Diploma in Augmented Reality and Virtual Reality",
        "Diploma in Blockchain Technology",
        "Diploma in Business Analytics",
        "Diploma in Cloud Computing",
        "Diploma in Computer Science",
        "Diploma in Cybersecurity",
        "Diploma in Data Analytics",
        "Diploma in Data Science",
        "Diploma in Digital Marketing",
        "Diploma in eCommerce",
        "Diploma in Financial Technology (FinTech)",
        "Diploma in Graphic Design",
        "Diploma in Information Assurance",
        "Diploma in Information Infrastructure Management",
        "Diploma in Information Technology",
        "Diploma in Internet of Things",
        "Diploma in Mobile Application Development",
        "Diploma in Networking",
        "Diploma in Programming",
        "Diploma in Project Management",
        "Diploma in Sustainable Technology",
        "Diploma in User Experience (UX) Design",
        "Diploma in User Interface (UI) Design",
        "Diploma in Video Production and Editing"
    ]
    
    # Bachelor Programs (120 Credit Hours, 30 Modules)
    bachelor_programs = [
        "Bachelor of Artificial Intelligence",
        "Bachelor of Computer Science",
        "Bachelor of Data Science",
        "Bachelor of Digital Marketing",
        "Bachelor of Entrepreneurship",
        "Bachelor of Environmental Science and Technology",
        "Bachelor of Graphic Design",
        "Bachelor of Health Informatics",
        "Bachelor of Information Technology",
        "Bachelor of Science in Advanced Technology",
        "Bachelor of Science in Cybersecurity and Information Assurance",
        "Bachelor of Science in Data Science and Analytics",
        "Bachelor of Science in Digital Marketing and eCommerce",
        "Bachelor of Science in Robotics and Artificial Intelligence",
        "Bachelor of Science in Software Development and Programming",
        "Bachelor of UX / UI Design"
    ]
    
    # Certification Programs (120 Credit Hours)
    certification_programs = [
        "Certified Digital Marketing Professional",
        "AWS Certified Cloud Practitioner",
        "Certified Artificial Intelligence and Machine Learning Engineer",
        "Certified Blockchain Specialist",
        "Certified Cloud Computing Professional",
        "Certified Cybersecurity Analyst",
        "Certified Data Analyst",
        "Certified Data Scientist",
        "Certified DevOps Engineer",
        "Certified Ethical Hacker",
        "Certified Full Stack Developer",
        "Certified Machine Learning Engineer",
        "Certified Python Developer",
        "Certified UX / UI Designer",
        "CompTIA Security+"
    ]
    
    courses_to_insert = []
    
    # Create Diploma courses
    for title in diploma_programs:
        course_id = str(uuid.uuid4())
        modules = [
            {
                "id": str(uuid.uuid4()),
                "title": f"Module {i+1}",
                "description": f"Core concepts and practical skills for {title}",
                "objectives": [
                    "Understand fundamental concepts",
                    "Apply theoretical knowledge",
                    "Complete hands-on projects"
                ],
                "duration_hours": 4
            }
            for i in range(15)
        ]
        
        courses_to_insert.append({
            "id": course_id,
            "title": title,
            "description": f"Comprehensive {title} program covering essential skills and industry practices. Self-paced learning with AI tutoring support.",
            "course_type": CourseType.DIPLOMA,
            "price": 2499.00,
            "credit_hours": 60,
            "duration_months": 15,
            "modules": modules,
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "enrolled_count": 0,
            "thumbnail": None
        })
    
    # Create Bachelor courses
    for title in bachelor_programs:
        course_id = str(uuid.uuid4())
        modules = [
            {
                "id": str(uuid.uuid4()),
                "title": f"Module {i+1}",
                "description": f"Advanced topics in {title}",
                "objectives": [
                    "Master advanced concepts",
                    "Develop professional expertise",
                    "Complete capstone projects"
                ],
                "duration_hours": 4
            }
            for i in range(30)
        ]
        
        courses_to_insert.append({
            "id": course_id,
            "title": title,
            "description": f"Comprehensive {title} degree program. Develop expertise through rigorous coursework and practical projects.",
            "course_type": CourseType.BACHELOR,
            "price": 4499.00,
            "credit_hours": 120,
            "duration_months": 24,
            "modules": modules,
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "enrolled_count": 0,
            "thumbnail": None
        })
    
    # Create Certification courses
    for title in certification_programs:
        course_id = str(uuid.uuid4())
        modules = [
            {
                "id": str(uuid.uuid4()),
                "title": f"Module {i+1}",
                "description": f"Certification preparation for {title}",
                "objectives": [
                    "Prepare for certification exam",
                    "Gain practical skills",
                    "Build portfolio projects"
                ],
                "duration_hours": 4
            }
            for i in range(30)
        ]
        
        courses_to_insert.append({
            "id": course_id,
            "title": title,
            "description": f"Industry-recognized {title} program. Prepare for certification with comprehensive training and exam preparation.",
            "course_type": CourseType.CERTIFICATION,
            "price": 799.00,
            "credit_hours": 120,
            "duration_months": 24,
            "modules": modules,
            "is_published": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "enrolled_count": 0,
            "thumbnail": None
        })
    
    if courses_to_insert:
        await db.courses.insert_many(courses_to_insert)
        logger.info(f"Seeded {len(courses_to_insert)} courses")
    
    # Create admin user if not exists
    admin = await db.users.find_one({"email": "admin@righttechcentre.com"})
    if not admin:
        admin_doc = {
            "id": str(uuid.uuid4()),
            "email": "admin@righttechcentre.com",
            "full_name": "RTC Admin",
            "password": hash_password("admin123"),
            "role": UserRole.ADMIN,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "profile_image": None
        }
        await db.users.insert_one(admin_doc)
        logger.info("Created admin user: admin@righttechcentre.com / admin123")
