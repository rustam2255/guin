import $api from "../../../shared/api/api";
import {  getDashboardObjectTypeEndpoint } from "../../../shared/api/dashboard-role";

import { buildDashboardStatusParams } from "../../../shared/helpers/build-dashboard-status-params";
import { useAuthStore } from "../../auth/model/auth.store";
import type { DashboardStatusCount, DashboardStatusParams } from "../../dashboardStatus/types/statusTypes";


export const DashboardObjectTypeService = {
  async getStatusCount(params: DashboardStatusParams = {}) {
    const profile = useAuthStore.getState().profile;

    const endpoint = getDashboardObjectTypeEndpoint(profile?.role);
    const preparedParams = buildDashboardStatusParams(params, profile);

    const { data } = await $api.get<DashboardStatusCount>(endpoint, {
      params: preparedParams,
    });

    return data;
  },
};