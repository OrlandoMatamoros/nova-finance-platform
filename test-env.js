console.log("=== VERIFICACIÓN DE CONFIGURACIÓN ===");
console.log("");

// Verificar Gemini
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.log("✅ Gemini API Key configurada");
  console.log("   Longitud:", process.env.NEXT_PUBLIC_GEMINI_API_KEY.length, "caracteres");
  console.log("   Primeros 7 chars:", process.env.NEXT_PUBLIC_GEMINI_API_KEY.substring(0, 7) + "...");
} else {
  console.log("❌ Gemini API Key NO encontrada");
  console.log("   Agrégala en .env.local");
}

console.log("");

// Verificar Firebase (para cuando lo configures)
const firebaseKeys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

let firebaseConfigured = true;
firebaseKeys.forEach(key => {
  if (process.env[key]) {
    console.log(`✅ ${key} configurada`);
  } else {
    console.log(`⏳ ${key} pendiente`);
    firebaseConfigured = false;
  }
});

console.log("");
console.log("=== RESUMEN ===");
console.log("Gemini:", process.env.NEXT_PUBLIC_GEMINI_API_KEY ? "✅ Listo" : "❌ Falta");
console.log("Firebase:", firebaseConfigured ? "✅ Listo" : "⏳ Pendiente");
