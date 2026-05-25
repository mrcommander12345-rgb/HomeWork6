import http from 'k6/http';
import { check, group } from 'k6';
///<reference types="k6" />

import { ActionsOnWebTours } from './actionsOnWebTours.js';

export const options=
{
  
    scenarios:
    {
        webtours:
        {
        executor: 'constant-vus',
        vus: 1,
        duration: '3s',
        },

    }
}

export default function simulation()
{
    const web=new ActionsOnWebTours();
    web.opentargetSite();
    web.login();
    web.openFlyPage();
    web.setFlyOptions();
    web.paymentDetails();
}