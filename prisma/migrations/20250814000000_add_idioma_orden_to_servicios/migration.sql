-- Migration: Add idioma and orden fields to servicios table

-- Add idioma column with default value 'ES'
ALTER TABLE "servicios" ADD COLUMN "idioma" VARCHAR(2) NOT NULL DEFAULT 'ES';

-- Add orden column with default value based on current id
ALTER TABLE "servicios" ADD COLUMN "orden" INTEGER NOT NULL DEFAULT 0;

-- Update existing records to set orden = id for current ordering
UPDATE "servicios" SET "orden" = "id" WHERE "orden" = 0;

-- Create indexes for performance optimization
CREATE INDEX "servicios_idioma_idx" ON "servicios"("idioma");
CREATE INDEX "servicios_orden_idx" ON "servicios"("orden");
