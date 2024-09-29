
import { useState } from 'react';


export const useLocalstorage =(key, initialValue)=> {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? storedValue : initialValue;
  const [value, setValue] = useState(initial);

  const updateValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key,newValue)
  
  };

  return [value, updateValue];
}

export const clearStorage  = (key)=>{
  const clr =useLocalstorage(key)
  return localStorage.clear(clr)
}

