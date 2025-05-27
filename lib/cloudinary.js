import { v2 as cloudinary } from 'cloudinary';

// Verificar que las variables de entorno estén definidas
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ds4cduhxd';
const apiKey = process.env.CLOUDINARY_API_KEY || '174373522617375';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '30BtCBW0SI3_gyT8n6v0nfNcFYU';

// Configurar Cloudinary con los valores
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

// Verificar la configuración
console.log('Cloudinary configurado con:', {
  cloud_name: cloudName,
  api_key: apiKey ? '***' : 'no configurado',
  api_secret: apiSecret ? '***' : 'no configurado'
});

export default cloudinary;
