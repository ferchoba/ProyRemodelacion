import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  webpack: (config, { isServer, webpack }) => {
    // Configuración específica para resolver problemas con libSQL/Turso

    // 1. Excluir archivos problemáticos de libSQL de manera más agresiva
    config.module.rules.push({
      test: /\/(LICENSE|README|CHANGELOG|\.md|\.txt)(\.[a-z]+)?$/i,
      type: 'asset/resource',
      generator: { emit: false },
    });

    // 2. Ignorar completamente los archivos problemáticos de libSQL
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^(lokijs|pino-pretty|encoding)$/,
      })
    );

    // 3. Ignorar archivos específicos de libSQL que causan problemas
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@libsql\/.*\/(LICENSE|README|CHANGELOG|\.md|\.txt)/i,
      })
    );

    // 4. Ignorar archivos binarios y de configuración de libSQL
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /@libsql\/.*\/(\.node|\.wasm|\.so|\.dll)$/i,
      })
    );

    // 5. Solo procesar libSQL en el servidor
    if (!isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@libsql\/client$/,
        })
      );
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@prisma\/adapter-libsql$/,
        })
      );
    }

    // 6. Ignorar completamente todos los archivos problemáticos de libSQL
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /\.(md|txt|node|wasm|so|dll|d\.ts)$/i,
        contextRegExp: /@libsql/,
      })
    );

    // 7. Ignorar archivos específicos que causan problemas
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /README|LICENSE|CHANGELOG/i,
        contextRegExp: /@libsql|@prisma\/adapter-libsql/,
      })
    );

    // 3. Resolver problemas con dependencias de libSQL en el cliente
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // 4. Configuración específica para @libsql
    config.module.rules.push({
      test: /node_modules\/@libsql\/.*\.js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://images.unsplash.com https://res.cloudinary.com",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net",
              "frame-src https://www.google.com https://recaptcha.google.com https://www.recaptcha.net",
            ].join('; '),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
