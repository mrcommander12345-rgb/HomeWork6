import http from 'k6/http';
import { check, group } from 'k6';
///<reference types="k6" />

// 1. Настройки нагрузки (Открытая модель)
export const options = {
  scenarios: {
    open_model_yandex: {
      executor: 'ramping-arrival-rate',
      startRate: 0,                 // Начинаем с 1 запроса в секунду
      timeUnit: '1m',               // Базовая единица времени — секунда
      preAllocatedVUs: 50,          // Выделяем 50 виртуальных пользователей заранее
      maxVUs: 200,                  // Максимальный запас, если сервер начнет тормозить
      stages: [
        { target: 60, duration: '5m' }, // Плавно разгоняем до 60 зпросов в минуту
        { target: 60, duration: '10m'},//удерживаем полку в течении 10 минут
        {target: 72, duration:'5m'},//увеличиваем профиль до 120% в течении 5 минут
        {target: 72, duration:'10m'}//удерживаем полку в течении 10 минут
        
      ],
      exec: 'testYandex',
    },

    open_model_second:
    {
      executor: 'ramping-arrival-rate',
      startRate: 0,                 // Начинаем с 1 запроса в секунду
      timeUnit: '1m',               // Базовая единица времени — секунда
      preAllocatedVUs: 50,          // Выделяем 50 виртуальных пользователей заранее
      maxVUs: 200,                  // Максимальный запас, если сервер начнет тормозить
      stages: [
        { target: 120, duration: '5m' }, // Плавно разгоняем до 60 зпросов в минуту
        { target: 120, duration: '10m'},//удерживаем полку в течении 10 минут
        {target: 144, duration:'5m'},//увеличиваем профиль до 120% в течении 5 минут
        {target: 144, duration:'10m'}//удерживаем полку в течении 10 минут
        
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
    'status is 200 or 302': (r) => r.status === 200 || r.status === 302,
  });
});
}


export function secondTest()
{
  group('secondTest',function()
{
   const res = http.get(`http://www.ru/`);
  check(res, {
    'status is 200 or 302': (r) => r.status === 200 || r.status === 302,
  });
});
}