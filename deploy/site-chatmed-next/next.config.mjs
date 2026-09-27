/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      // caminho antigo da apresentação — agora é a raiz
      { source: '/apresentacao', destination: '/', permanent: true },
    ];
  },
};
export default nextConfig;
