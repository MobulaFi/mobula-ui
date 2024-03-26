import { GET } from "../../../utils/fetch";
import { selectedQueryProps } from "../models";

export const editView = (data: selectedQueryProps) => {
  GET("/api/1/analytics/query/update", {
    id: data.id,
    visualization: JSON.stringify(data),
    request: data.query,
    last_result: JSON.stringify(data.data),
    updated_at: new Date(Date.now()) as Date as unknown as string,
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("res", res);
    });
};

export const createView = (data: selectedQueryProps, userID: number) => {
  GET("/api/1/analytics/query/create", {
    user: userID,
    visualization: JSON.stringify(data),
    request: data.query,
    last_result: JSON.stringify(data.data),
    last_executed_at: new Date().toISOString(),
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("res", res);
    });
};

export const removeView = (ID: number) => {
  GET("/api/1/analytics/query/remove", {
    id: ID,
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("res", res);
    });
};

export const createDashboard = (data) => {
  GET("/api/1/analytics/dashboard/create", {
    user: data.userID,
    asset: data.assetID,
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("res", res);
    });
};

export const submitDashboard = (data) => {
  GET("/api/1/analytics/dashboard/submit", {
    dashboard: data.dashboardID,
    query: data.queryID,
    position: data.position,
    width: data.width,
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("res", res);
    });
};

export const runQuery = (data) => {
  GET("/api/1/analytics/query/run", {
    id: data.id,
  })
    .then((r) => r.json())
    .then((res) => {
      console.log("res", res);
    });
};
