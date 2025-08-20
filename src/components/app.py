from werkzeug.security import generate_password_hash
from sib_api_v3_sdk.rest import ApiException
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import mysql.connector
import random, re, os
import sib_api_v3_sdk

app = Flask(__name__)
CORS(app)

load_dotenv(dotenv_path="auji.env")

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = BREVO_API_KEY

DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT"))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

verification_codes = {}

def get_db_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
    )

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_verified BOOLEAN DEFAULT FALSE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """)
    conn.commit()
    cur.close()
    conn.close()

def is_valid_password(password):
    if len(password) < 8:
        return False, "كلمة المرور يجب أن تكون 8 خانات على الأقل"
    if not re.search(r"[A-Z]", password):
        return False, "يجب أن تحتوي على حرف كبير"
    if not re.search(r"[a-z]", password):
        return False, "يجب أن تحتوي على حرف صغير"
    if not re.search(r"\d", password):
        return False, "يجب أن تحتوي على رقم"
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "يجب أن تحتوي على رمز خاص"
    return True, ""

def send_verification_email(email, code):
    api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": email}],
        sender={"email": "sezaroo2004@hotmail.com", "name": "AUJI"},
        subject="كود التفعيل الخاص بك",
        html_content=f"<p>كود التفعيل هو: <b>{code}</b></p>"
    )
    try:
        api_instance.send_transac_email(send_smtp_email)
        return True
    except ApiException:
        return False

@app.route("/send-code", methods=["POST"])
def send_code():
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return jsonify({"message": "البريد الإلكتروني مطلوب"}), 400

    code = random.randint(100000, 999999)
    verification_codes[email] = code

    if send_verification_email(email, code):
        return jsonify({"message": "تم إرسال كود التفعيل"}), 200
    else:
        return jsonify({"message": "فشل في إرسال الكود"}), 500

@app.route("/verify-code", methods=["POST"])
def verify_code():
    data = request.get_json() or {}
    email, code_raw = data.get("email"), data.get("code")

    try:
        code = int(code_raw)
    except:
        return jsonify({"message": "كود غير صالح"}), 400

    if verification_codes.get(email) == code:
        verification_codes[email] = "verified"        
        return jsonify({"message": "تم التحقق بنجاح"}), 200
    else:
        return jsonify({"message": "كود غير صحيح"}), 400

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    username, email, password = data.get("username"), data.get("email"), data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "كل الحقول مطلوبة"}), 400
    
    if verification_codes.get(email) != "verified":
        return jsonify({"message": "يجب تفعيل البريد الإلكتروني أولاً"}), 400

    valid, msg = is_valid_password(password)
    if not valid:
        return jsonify({"message": msg}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO users (username, email, password, is_verified) VALUES (%s, %s, %s, TRUE)",
                    (username, email, hashed_password))
        conn.commit()
        verification_codes.pop(email, None)
        return jsonify({"message": "تم التسجيل بنجاح"}), 201
    except mysql.connector.errors.IntegrityError:
        return jsonify({"message": "الايميل مسجل قبل كده"}), 400
    finally:
        cur.close(); conn.close()

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
