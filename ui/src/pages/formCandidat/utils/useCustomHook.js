import { useCallback, useEffect, useState } from "react";
import { _get } from "../../../common/httpClient";

export const useCustomHook = (urlCentreId, urlTrainingId) => {
  const [centreDataFromApiCatalog, setCentreDataFromApiCatalog] = useState(null);
  const [trainingDataFromApiCatalog, setTrainingDataFromApiCatalog] = useState(null);

  const fetchCentre = useCallback(() => {
    const getCentre = async () => {
      const response = await _get(`/api/centre?centreId=${urlCentreId}`);
      setCentreDataFromApiCatalog(response);
    };
    return getCentre();
  }, [urlCentreId]);

  const fetchTraining = useCallback(() => {
    const getTraining = async () => {
      const response = await _get(`/api/training?trainingId=${urlTrainingId}`);
      setTrainingDataFromApiCatalog(response);
    };
    return getTraining();
  }, [urlTrainingId]);

  useEffect(() => {
    fetchCentre();
    fetchTraining();
  }, [fetchCentre, fetchTraining]);

  return [centreDataFromApiCatalog, trainingDataFromApiCatalog];
};
