import nodemailer from "nodemailer";

const EMAIL_USER = "fachowo.eu@gmail.com";
const EMAIL_PASS = "xxcw tyjh rbtr eflj"; 

async function testEmail() {
  console.log("Rozpoczynam test wysyłki...");
  
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const result = await transport.sendMail({
      from: EMAIL_USER,
      to: "kontakt@fachowo.net.pl",
      subject: "Test Wysyłki - Fachowo",
      text: "Jeśli to czytasz, Twój serwer może wysyłać e-maile!"
    });
    
    console.log("SUKCES! Wiadomość wysłana. ID:", result.messageId);
  } catch (error) {
    console.error("BŁĄD KRYTYCZNY:", error);
  }
}

testEmail();
