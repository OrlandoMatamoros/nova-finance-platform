// Cargar las variables de entorno
require('dotenv').config({ path: '.env.local' });

console.log("=== VERIFICACIÓN DE CONFIGURACIÓN ===");
console.log("");

// Verificar Gemini
const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (geminiKey) {
  console.log("✅ Gemini API Key configurada");
  console.log("   Longitud:", geminiKey.length, "caracteres");
  console.log("   Empieza con:", geminiKey.substring(0, 7) + "...");
} else {
  console.log("❌ Gemini API Key NO encontrada");
  console.log("   Verifica que está en .env.local");
}

console.log("");
console.log("Contenido de .env.local:");
const fs = require('fs');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.includes('=')) {
      const [key, value] = line.split('=');
      if (value && value.length > 0) {
        console.log(`  ✅ ${key} = [CONFIGURADO - ${value.length} chars]`);
      } else {
        console.log(`  ❌ ${key} = [VACÍO]`);
      }
    }
  });
} catch (error) {
  console.log("  ❌ No se pudo leer .env.local");
}
