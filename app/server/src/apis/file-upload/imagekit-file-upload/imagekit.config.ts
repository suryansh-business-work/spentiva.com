import ImageKit from 'imagekit';
import config from '../../../config/config';

// Initialize ImageKit instance using centralized config
const imagekit = new ImageKit({
  publicKey: config.IMAGEKIT.PUBLIC_KEY,
  privateKey: config.IMAGEKIT.PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT.URL_ENDPOINT,
});

export default imagekit;
