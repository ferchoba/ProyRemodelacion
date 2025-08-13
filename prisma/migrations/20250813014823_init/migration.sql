-- CreateTable
CREATE TABLE "parametros" (
    "clave" TEXT NOT NULL PRIMARY KEY,
    "valor" TEXT NOT NULL,
    "descripcion" TEXT
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion_corta" TEXT,
    "contenido_md" TEXT NOT NULL,
    "imagen_principal_url" TEXT,
    "etiquetas" TEXT NOT NULL DEFAULT '[]',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "proyectos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion_md" TEXT NOT NULL,
    "imagen_portada_url" TEXT,
    "galeria_urls" TEXT NOT NULL DEFAULT '[]',
    "tipo_servicio_slug" TEXT NOT NULL,
    "fecha_finalizacion" DATETIME,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "proyectos_tipo_servicio_slug_fkey" FOREIGN KEY ("tipo_servicio_slug") REFERENCES "servicios" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quienes_somos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "contenido_md" TEXT NOT NULL,
    "imagen_equipo_url" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "formularios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "tipo_servicio" TEXT,
    "descripcion" TEXT NOT NULL,
    "fecha_envio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "recaptcha_score" REAL,
    "estado" TEXT NOT NULL DEFAULT 'recibido'
);

-- CreateIndex
CREATE UNIQUE INDEX "servicios_slug_key" ON "servicios"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "proyectos_slug_key" ON "proyectos"("slug");
