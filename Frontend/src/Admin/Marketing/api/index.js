import api from "../../../api";

const offersEndpoint = "/offers";

export const topHeaderOffersApi = {
  getAll: () => api.get(offersEndpoint),
  getForHeader: () => api.get(`${offersEndpoint}/header`),
  create: (offer) => api.post(offersEndpoint, offer),
  update: (id, offer) => api.put(`${offersEndpoint}/${id}`, offer),
  updateHeaderVisibility: (id, showInHeader) =>
    api.patch(`${offersEndpoint}/${id}/header`, { show_in_header: showInHeader }),
  remove: (id) => api.delete(`${offersEndpoint}/${id}`),
};
