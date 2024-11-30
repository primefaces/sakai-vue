// src/utils/cloudinary.js
import { Cloudinary } from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'dstjfvua2', // Replace with your Cloudinary cloud name

  },
  url: {
    secure: true, // Use HTTPS
  },
});

export default cloudinary;
