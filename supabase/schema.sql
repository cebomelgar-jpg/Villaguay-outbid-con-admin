-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de publicistas
CREATE TABLE publicistas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre_usuario TEXT NOT NULL,
  nombre_publico TEXT NOT NULL,
  ref_key TEXT UNIQUE NOT NULL,
  whatsapp_contacto TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  puntos_mes_actual INTEGER DEFAULT 0
);

-- Tabla de logs de referidos (para auditoría y evitar duplicados)
CREATE TABLE referral_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  publicista_id UUID NOT NULL REFERENCES publicistas(id) ON DELETE CASCADE,
  visitor_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(publicista_id, visitor_hash)
);

-- Tabla de competencias mensuales
CREATE TABLE competencias_mensuales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  monto_premio DECIMAL(10, 2) NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  esta_activo BOOLEAN DEFAULT false
);

-- Índices para optimizar consultas
CREATE INDEX idx_referral_logs_publicista ON referral_logs(publicista_id);
CREATE INDEX idx_referral_logs_visitor ON referral_logs(visitor_hash);
CREATE INDEX idx_referral_logs_created ON referral_logs(created_at);
CREATE INDEX idx_publicistas_puntos ON publicistas(puntos_mes_actual DESC);
CREATE INDEX idx_competencias_activa ON competencias_mensuales(esta_activo);

-- Insertar competencia inicial
INSERT INTO competencias_mensuales (titulo, monto_premio, fecha_inicio, fecha_fin, esta_activo)
VALUES (
  'Torneo Mensual de Publicistas',
  100000.00,
  DATE_TRUNC('month', NOW()),
  DATE_TRUNC('month', NOW() + INTERVAL '1 month') - INTERVAL '1 second',
  true
);

-- Row Level Security (RLS) policies
ALTER TABLE publicistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencias_mensuales ENABLE ROW LEVEL SECURITY;

-- Políticas para publicistas
CREATE POLICY "Permitir lectura pública de publicistas" ON publicistas
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserción de publicistas" ON publicistas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización de puntos por sistema" ON publicistas
  FOR UPDATE USING (true);

-- Políticas para referral_logs
CREATE POLICY "Permitir inserción de logs" ON referral_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura de logs por administradores" ON referral_logs
  FOR SELECT USING (true);

-- Políticas para competencias_mensuales
CREATE POLICY "Permitir lectura pública de competencias" ON competencias_mensuales
  FOR SELECT USING (true);

CREATE POLICY "Permitir gestión de competencias por administradores" ON competencias_mensuales
  FOR ALL USING (true);