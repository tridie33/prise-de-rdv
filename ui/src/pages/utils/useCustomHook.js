import { useCallback, useEffect, useState } from "react";
import { _get } from "../../common/httpClient";
const queryString = require("query-string");

export const useCustomHook = (props) => {
  const urlParamCentreId = queryString.parse(props.location.search).centreId;
  const urlParamTrainingId = queryString.parse(props.location.search).trainingId;
  const urlParamFromWhom = queryString.parse(props.location.search).fromWhom;

  const [centreDataFromApiCatalog, setCentreDataFromApiCatalog] = useState(null);
  const [trainingDataFromApiCatalog, setTrainingDataFromApiCatalog] = useState(null);

  const fetchCentre = useCallback(() => {
    const getCentre = async () => {
      const response = await _get(`/api/centre?centreId=${urlParamCentreId}`);
      setCentreDataFromApiCatalog(response);
    };
    return getCentre();
  }, [urlParamCentreId]);

  const fetchTraining = useCallback(() => {
    const getTraining = async () => {
      const response = await _get(`/api/training?trainingId=${urlParamTrainingId}`);
      setTrainingDataFromApiCatalog(response);
    };
    return getTraining();
  }, [urlParamTrainingId]);

  useEffect(() => {
    fetchCentre();
    fetchTraining();
  }, [fetchCentre, fetchTraining]);

  return [urlParamCentreId, urlParamTrainingId, urlParamFromWhom, centreDataFromApiCatalog, trainingDataFromApiCatalog];
};
