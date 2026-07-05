export const SANITIZER_RANGES = {
    "Quat Sanitizer": { min: 200, max: 400 },
    "Chlorine": { min: 50, max: 200 }
};

export const isInRange = (chemicalName, ppmValue) => {
    const range = SANITIZER_RANGES[chemicalName];
    if (!range || ppmValue === '' || ppmValue === null || ppmValue === undefined) return null;
    const num = Number(ppmValue);
    if (Number.isNaN(num)) return null;
    return num >= range.min && num <= range.max;
};

export const isQaOk = (qaWalk) => !qaWalk?.deficienciesFound || !!qaWalk?.recheckPassed;
export const isUsdaOk = (usdaWalk) => !usdaWalk?.deficienciesFound || !!usdaWalk?.recheckPassed;

export const isFinalSanitizerOk = (finalSanitizer) => {
    if (!finalSanitizer) return false;
    const firstPass = isInRange(finalSanitizer.chemicalName, finalSanitizer.measuredPPM);
    if (firstPass === null) return false;
    if (firstPass === true) return true;
    return isInRange(finalSanitizer.chemicalName, finalSanitizer.recheckPPM) === true;
};

export const isZoneFullyPassing = (operationalLog) => {
    if (!operationalLog) return false;
    return isQaOk(operationalLog.qaWalk)
        && isUsdaOk(operationalLog.usdaWalk)
        && isFinalSanitizerOk(operationalLog.finalSanitizer);
};