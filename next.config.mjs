/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: "",//"/"
  // async redirects() {
  //   return [
  //     {
  //         source: '/',
  //         destination: '/app',
  //         basePath: false,
  //         permanent: false
  //     }
  //   ]
  // },    
  devIndicators: {
    autoPrerender: false,
  },
  // serverOptions: {
  //   secure: true,
  //   key: fs.readFileSync('key.pem'),
  //   cert: fs.readFileSync('cert.pem'),
  // },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.justboil.me',
      },
    ],
  },
}

export default nextConfig