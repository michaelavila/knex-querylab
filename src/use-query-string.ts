import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';

import qs, { ParsedQuery } from 'query-string';
import { isArray } from 'util';

export function setQueryStringWithoutPageReload(qsValue: string) { 
  const newurl = window.location.protocol + "//"
  + window.location.host + window.location.pathname + qsValue;

  window.history.pushState({ path: newurl }, "", newurl);
};

export function setQueryStringValue(key: string, value: string, queryString: string = window.location.search) {
  const values = qs.parse(queryString);
  const newQsValue = qs.stringify({...values, [key]: value });
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};

export function getQueryStringValue(key: string, queryString: string = window.location.search): string | null {
  const values: ParsedQuery = qs.parse(queryString); 
  const value: string | string[] | null = values[key];
  if (isArray(value)) {
    return value[0];
  } else {
    return value
  }
};

export function useQueryString(key: string, initialValue: string): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState(getQueryStringValue(key) || initialValue);
  const onSetValue = useCallback(
    newValue => {
      setValue(newValue);
      setQueryStringValue(key, newValue);
    },
    [key]
  );

  return [value, onSetValue];
}
