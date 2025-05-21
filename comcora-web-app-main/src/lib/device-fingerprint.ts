export const getDeviceFingerprint = () => {
  const userAgent = navigator.userAgent;
  const screenResolution = `${screen.width}x${screen.height}`;
  const colorDepth = screen.colorDepth;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const language = navigator.language;
  const hardwareConcurrency = navigator.hardwareConcurrency;
  const maxTouchPoints = navigator.maxTouchPoints;

  const fingerprintData = {
    userAgent,
    screenResolution,
    colorDepth,
    timeZone,
    language,
    hardwareConcurrency,
    maxTouchPoints,
  };

  return JSON.stringify(fingerprintData);
};
