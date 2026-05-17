import $api from "../../../shared/api/api";
import {   getDashboardDiseaseEndpoint } from "../../../shared/api/dashboard-role";

import { buildDashboardStatusParams } from "../../../shared/helpers/build-dashboard-status-params";
import { useAuthStore } from "../../auth/model/auth.store";
import type {  DashboardStatusParams } from "../../dashboardStatus/types/statusTypes";
import type { DashboardDiseaseCountResponse } from "../types/disease.types";


export const DiseaseDashboardService = {
  async getStatusCount(params: DashboardStatusParams = {}) {
    const profile = useAuthStore.getState().profile;

    const endpoint = getDashboardDiseaseEndpoint(profile?.role);
    const preparedParams = buildDashboardStatusParams(params, profile);

    const { data } = await $api.get<DashboardDiseaseCountResponse>(endpoint, {
      params: preparedParams,
    });

    return data;
  },
};