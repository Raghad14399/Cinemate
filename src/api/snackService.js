import api from "./config";

// جلب جميع السناكات مع إمكانية الفلترة بالنوع
export const snackService = {
  getSnacksCount: async () => {
    const response = await api.get("/api/Snak/count");
    return response.data?.data;
  },
  getAllSnacks: async (params = {}) => {
    // params: { SnakType: 'Snak' | 'Drink', ... }
    const response = await api.get("/api/Snak", { params });
    return response.data;
  },
  getSnackById: async (id) => {
    const response = await api.get(`/api/Snak/${id}`);
    return response.data;
  },
};
