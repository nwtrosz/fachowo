import nodemailer from "nodemailer";

const EMAIL_USER = "fachowo.eu@gmail.com";
const EMAIL_PASS = "xxcw tyjh rbtr eflj"; 

async function testEmail() {
  console.log("Rozpoczynam test wysyłki...");
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    logger: true,
    debug: true
  });

  try {
    console.log("Weryfikacja połączenia SMTP...");
    await transporter.verify();
    console.log("Połączenie SMTP OK.");

    console.log("Wysyłanie wiadomości...");
    const result = await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_USER,
      subject: "Test z Gemini CLI - Konfiguracja poprawna",
      text: "Jeśli to czytasz, Twój serwer może wysyłać e-maile!"
    });
    
    console.log("SUKCES! Wiadomość wysłana. ID:", result.messageId);
  } catch (error) {
    console.error("BŁĄD KRYTYCZNY:", error);
  }
}

testEmail();
