/*
  Warnings:

  - You are about to drop the column `tipo_servicio_slug` on the `proyectos` table. All the data in the column will be lost.
  - Added the required column `servicio_id` to the `proyectos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_proyectos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion_md" TEXT NOT NULL,
    "imagen_portada_url" TEXT,
    "galeria_urls" TEXT NOT NULL DEFAULT '[]',
    "servicio_id" INTEGER NOT NULL,
    "fecha_finalizacion" DATETIME,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "proyectos_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_proyectos" ("activo", "created_at", "descripcion_md", "fecha_finalizacion", "galeria_urls", "id", "imagen_portada_url", "slug", "titulo", "updated_at") SELECT "activo", "created_at", "descripcion_md", "fecha_finalizacion", "galeria_urls", "id", "imagen_portada_url", "slug", "titulo", "updated_at" FROM "proyectos";
DROP TABLE "proyectos";
ALTER TABLE "new_proyectos" RENAME TO "proyectos";
CREATE UNIQUE INDEX "proyectos_slug_key" ON "proyectos"("slug");
CREATE TABLE "new_servicios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion_corta" TEXT,
    "contenido_md" TEXT NOT NULL,
    "imagen_principal_url" TEXT,
    "etiquetas" TEXT NOT NULL DEFAULT '[]',
    "idioma" TEXT NOT NULL DEFAULT 'ES',
    "orden" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_servicios" ("activo", "contenido_md", "created_at", "descripcion_corta", "etiquetas", "id", "idioma", "imagen_principal_url", "orden", "slug", "titulo", "updated_at") SELECT "activo", "contenido_md", "created_at", "descripcion_corta", "etiquetas", "id", "idioma", "imagen_principal_url", "orden", "slug", "titulo", "updated_at" FROM "servicios";
DROP TABLE "servicios";
ALTER TABLE "new_servicios" RENAME TO "servicios";
CREATE INDEX "servicios_idioma_idx" ON "servicios"("idioma");
CREATE INDEX "servicios_orden_idx" ON "servicios"("orden");
CREATE UNIQUE INDEX "servicios_slug_idioma_key" ON "servicios"("slug", "idioma");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
