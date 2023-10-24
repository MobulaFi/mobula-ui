export const pushData = (event: string, properties?: any) => {
  try {
    (window as any).mixpanel.track(event, properties);
  } catch (e) {
    console.error("Error pushing data to Mixpanel: ", e);
  }
};
