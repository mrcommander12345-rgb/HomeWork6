import http from 'k6/http';
import { check } from 'k6';

export class ActionsOnWebTours {

  constructor(baseUrl) {
    this.baseUrl = 'http://webtours.load-test.ru:1080/webtours/';
    this.jar = http.cookieJar();
    this.userSession = '';
    this.outBoundFly = '';
    this.citiesArray = [];
  }
  
  opentargetSite() {
   
    http.get('http://webtours.load-test.ru:1080/cgi-bin/welcome.pl?signOff=true', { jar: this.jar });
  

    let res = http.get('http://webtours.load-test.ru:1080/cgi-bin/nav.pl?in=home', { jar: this.jar });

   
    let match = res.body.match(/name="userSession" value="(.+?)"/);
    
    if (match && match[1]) {
      this.userSession = match[1]; //Важно->Сохранить нужный элемент массива
    
    } else {
      console.error('ОШИБКА: userSession не найден в ответе сервера!');
    }

    return this.userSession;
  }

  login() {
    const loginBody = {
      userSession: this.userSession, 
      username: 'm1',
      password: '123',
      'login.x': '17',
      'login.y': '9',
      JSFormSubmit: 'off'
    };

    let res = http.post('http://webtours.load-test.ru:1080/cgi-bin/login.pl', loginBody, { jar: this.jar });
    
    check(res, {
      'Авторизован успешно': (r) => r.body.includes('Welcome'),
    });
  }
   
  openFlyPage() {
    this.citiesArray = [];
  
    
    http.get('http://webtours.load-test.ru:1080/cgi-bin/welcome.pl?page=search', { jar: this.jar });
    http.get('http://webtours.load-test.ru:1080/cgi-bin/nav.pl?page=menu&in=flights', { jar: this.jar });

    let res = http.get('http://webtours.load-test.ru:1080/cgi-bin/reservations.pl?page=welcome', { jar: this.jar });
   
    
    res.html("select[name='depart'] option").each((idx, element) => {
      let cityValue = res.html(element).attr("value");
      this.citiesArray.push(cityValue); 
    });

    return this.citiesArray;
  } 

  setFlyOptions() {
       const bodyForSetFlyOptions = {
      advanceDiscount: '0',
      depart: 'Denver',
      departDate: '05/26/2026',
      arrive: 'Paris',
      returnDate: '05/27/2026',
      numPassengers: '1',
      seatPref: 'None',
      seatType: 'Coach',
      'findFlights.x': '67',
      'findFlights.y': '5',
      '.cgifields': ['roundtrip', 'seatType', 'seatPref'] 
    };

    let res = http.post('http://webtours.load-test.ru:1080/cgi-bin/reservations.pl', bodyForSetFlyOptions, { jar: this.jar });
    
    
    this.outBoundFly = res.html("input[name='outboundFlight'][checked]").attr("value");
    
  
    console.log(this.outBoundFly);
    return this.outBoundFly; 
  }

  paymentDetails() { 
    
    const bodyForOpenPaymentDetails = {
      outboundFlight: this.outBoundFly,
      numPassengers: '1',
      advanceDiscount: '0',
      seatType: 'Coach',
      seatPref: 'None',
      'reserveFlights.x': '14',
      'reserveFlights.y': '0'
    };
   
    http.post('http://webtours.load-test.ru:1080/cgi-bin/reservations.pl', bodyForOpenPaymentDetails, { jar: this.jar });

    const bodyForFactPayment = {
      firstName: 'm1',
      lastName: '123',
      address1: 'Lenina st 10',
      address2: 'Moscow',
      pass1: 'DarthVader',
      creditCard: '5555-5555-5555-5555',
      expDate: '12/30',
      oldCCOption: '',
      numPassengers: '1',
      seatType: 'Coach',
      seatPref: 'None',
      outboundFlight: this.outBoundFly,
      advanceDiscount: '0',
      returnFlight: '',
      JSFormSubmit: 'off',
      'buyFlights.x': '57',
      'buyFlights.y': '9',
      '.cgifields': 'saveCC'
    };

    let res = http.post('http://webtours.load-test.ru:1080/cgi-bin/reservations.pl', bodyForFactPayment, { jar: this.jar });

  }
}