import { request } from "../api.js";

const partner = {
  // Get current subscription details
  subscription: async () => {
    const res = await request.get("/partner/subscription");
    return res.data;
  },

  // Subscribe to a plan
  subscribe: async (plan) => {
    const res = await request.post("/partner/subscribe", { plan });
    return res.data;
  },
};

export default partner;