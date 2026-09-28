# Villaguay Outbid - Sistema de Referidos y Ranking de Publicistas

## Resumen del Proyecto

Este documento describe el sistema de seguimiento de referidos y ranking de publicistas ("Torneo de Publicistas") implementado para Villaguay Outbid.

## Configuración de Base de Datos (Supabase)

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### 2. Ejecutar Script SQL

Ve a tu panel de Supabase y ejecuta el script SQL ubicado en `supabase/schema.sql`. Esto creará las siguientes tablas:

- `publicistas`: Información de los publicistas
- `referral_logs`: Auditoría de visitas para evitar fraudes
- `competencias_mensuales`: Configuración de torneos mensuales

## Arquitectura del Sistema

### Componentes Principales

1. **Tracking de Referidos** (`hooks/use-referral-tracking.ts`)
   - Detecta parámetros `?ref=` o `?pub=` en la URL
   - Almacena referido en localStorage por 24 horas
   - Valifica visitas únicas (anti-fraude)
   - Requiere mínimo 5 segundos de sesión + interacción

2. **Componente Tracker** (`components/ReferralTracker.ts`)
   - Componente invisible que se integra en el layout
   - Registra puntos automáticamente cuando la visita califica
   - Ejecución asíncrona para no afectar rendimiento

3. **API Endpoints**
   - `POST /api/publicistas` - Crear nuevo publicista
   - `GET /api/publicistas` - Listar todos los publicistas
   - `GET /api/publicistas/ranking` - Obtener ranking
   - `POST /api/referidos/registrar-punto` - Registrar visita

4. **UI Components**
   - `PublicistaRegisterModal` - Formulario de registro
   - `PublicistaPanel` - Mini-panel del publicista
   - `/ranking-publicistas` - Página de ranking

## Flujo de Trabajo

### Para Publicistas

1. El usuario accede a `/ranking-publicistas`
2. Hace clic en "Crear mi Link de Publicista"
3. Completa el formulario (nombre, WhatsApp)
4. Recibe su enlace único: `dominio.com/?ref=usuario`
5. Comparte el enlace en redes sociales

### Para Visitantes

1. El visitante accede con `?ref=usuario`
2. El sistema detecta el parámetro y lo guarda en localStorage
3. Después de 5 segundos + interacción, se registra el punto
4. El punto se cuenta solo 1 vez por visitante cada 24 horas

## Medidas Anti-Fraude

- **Detección de bots**: Filtra user-agents conocidos de crawlers
- **Tiempo mínimo**: Requiere 5 segundos de sesión activa
- **Interacción requerida**: Scroll, clic o tecla
- **Visitante único**: Hash de device + IP (limitado a 24h)
- **Duplicados**: Base de datos previene registros duplicados

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Verificar tipos
npm run typecheck

# Build de producción
npm run build

# Iniciar producción
npm start
```

## Próximos Pasos Recomendados

1. **Configurar Supabase**: Crear proyecto y ejecutar schema.sql
2. **Personalizar**: Ajustar monto del premio ($100.000 ARS)
3. **Testing**: Probar flujo completo con usuarios reales
4. **Monitoreo**: Configurar analytics para trackear conversiones
5. **Marketing**: Promocionar el torneo en redes sociales

## Estructura de Archivos

```
lib/
  supabase.ts              # Cliente Supabase
  referral-service.ts     # Servicios de referidos
hooks/
  use-referral-tracking.ts # Hook de tracking
components/
  ReferralTracker.tsx      # Componente tracker
  PublicistaRegisterModal.tsx
  PublicistaPanel.tsx
app/
  api/
    publicistas/
      route.ts
      ranking/route.ts
    referidos/
      registrar-punto/route.ts
  ranking-publicistas/
    page.tsx
supabase/
  schema.sql               # Script de base de datos
```