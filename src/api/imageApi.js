import api from './config';

const BASE_URL = 'http://cinemate-001-site1.jtempurl.com/api/Image';

export const getImageById = async (id) => {
  if (!id) return null;
  try {
    const response = await api.get(`/api/Image/${id}`);
    if (response.data && response.data.data && response.data.data.url) {
      // أرجع رابط الصورة كامل
      return `http://cinemate-001-site1.jtempurl.com/${response.data.data.url}`;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export default { getImageById };
