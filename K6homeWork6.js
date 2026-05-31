import http from 'k6/http';
import { check, group } from 'k6';
///<reference types="k6" />

// 1. Настройки нагрузки (Открытая модель)
export const options = {
  scenarios: {
    open_model_yandex: {
      executor: 'ramping-arrival-rate',
      startRate: 0,                 
      timeUnit: '1m',               
      preAllocatedVUs: 50,          
      maxVUs: 200,                  
      stages: [
        { target: 60, duration: '5m' }, 
        { target: 60, duration: '10m'},
        {target: 72, duration:'5m'},
        {target: 72, duration:'10m'}
        
      ],
      exec: 'testYandex',
    },

    open_model_second:
    {
      executor: 'ramping-arrival-rate',
      startRate: 0,                 
      timeUnit: '1m',               
      preAllocatedVUs: 50,          
      maxVUs: 200,                  
      stages: [
        { target: 120, duration: '5m' }, 
        { target: 120, duration: '10m'},
        {target: 144, duration:'5m'},
        {target: 144, duration:'10m'}
        
      ],
      exec: 'secondTest',
    }
  },
};

const baseProtocol = 'https://';

export function testYandex () {  
group('yandexLoad',function()
{
  const res = http.get(`${baseProtocol}ya.ru`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
});
}


export function secondTest()
{
  group('secondTest',function()
{
   const res = http.get(`http://www.ru/`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
});
}