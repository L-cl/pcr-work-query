const isProd = process.env.NODE_ENV === 'production';

export default {
  host: isProd ? 'http://47.105.60.216:3000' : 'http://localhost:3000',
};
