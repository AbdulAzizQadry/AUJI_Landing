import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(null);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendCode = async () => {
    setMessage("");
    setIsSuccess(null);

    const res = await fetch(`${process.env.API_URL}/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    })
    
    const data = await res.json();
    setMessage(data.message);
    setIsSuccess(res.ok);

    if (res.ok) {
      setCodeSent(true);
    } else {
      setCodeSent(false);
    }
  };

  const verifyCode = async () => {
    setMessage("");
    const res = await fetch(`${process.env.API_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, code: verificationCode }),
    });
    const data = await res.json();
    setMessage(data.message);
    setIsSuccess(res.ok);
    if (res.ok) setIsVerified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("كلمة المرور غير متطابقة");
      setIsSuccess(false);
      return;
    }
    
    if (!isVerified) {
      setMessage("يجب التحقق من كود التفعيل أولا");
      setIsSuccess(false);
      return;
    }
    setMessage("");
    setIsSuccess(null);

    const res = await fetch(`${process.env.API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setMessage(data.message);
    setIsSuccess(res.ok);
    if (res.ok) {
      setTimeout(() => navigate("/coming-soon"), 1500);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden">
      <form autoComplete="off" onSubmit={handleSubmit} className="w-80 p-6 border rounded-lg shadow-lg box-border">
        <h2 className="text-2xl font-bold mb-4">تسجيل أكونت جديد</h2>

        <input
          type="text"
          name="username"
          placeholder="اسم المستخدم"
          value={form.username}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
        />

        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
        />

        {!codeSent && (
          <button type="button" onClick={sendCode} className="w-full bg-gray-600 text-white p-2 rounded mb-3">
            أرسل كود التفعيل
          </button>
        )}

        {codeSent && !isVerified && (
          <>
          <input
            type="text"
            placeholder="أدخل كود التفعيل"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="border w-full p-2 rounded mb-3"
          />
          <button type="button" onClick={verifyCode} className="w-full bg-yellow-600 text-white p-2 rounded mb-3">
            تحقق من الكود
          </button>
            </>
        )}

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={form.password}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={form.confirmPassword}
          onChange={handleChange}
          className="border w-full p-2 rounded mb-3"
        />


        {message && (
          <p className={`mb-3 text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          تسجيل
        </button>
      </form>
    </div>
  );
};

export default Register;
