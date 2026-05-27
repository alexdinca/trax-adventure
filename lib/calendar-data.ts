export type EventType = 'trax' | 'collective' | 'radar';

export interface CalendarEvent {
  date: string;
  startDate: string;
  endDate?: string;
  name: string;
  location?: string;
  type: EventType;
  href?: string;
  note?: string;
}

export interface MonthGroup {
  month: string;
  events: CalendarEvent[];
}

export const calendar: MonthGroup[] = [
  {
    month: 'March',
    events: [
      { date: '21 Mar', startDate: '2026-03-21', name: 'RAMS Fun Ride', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://www.facebook.com/events/2382350788899928' },
      { date: '28–29 Mar', startDate: '2026-03-28', endDate: '2026-03-29', name: 'MX CB/CNIR et. I', location: 'Oltenia Racing Park, Balș', type: 'radar', href: 'https://www.facebook.com/events/1071308521695584' },
    ],
  },
  {
    month: 'April',
    events: [
      { date: '17–19 Apr', startDate: '2026-04-17', endDate: '2026-04-19', name: 'Ténéré Event', location: 'Merei, Buzău', type: 'collective', href: 'https://www.facebook.com/YamahaMotorRomania/posts/1336124351880792' },
      { date: '18–19 Apr', startDate: '2026-04-18', endDate: '2026-04-19', name: 'Mixed Terrain Adventure Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 1' },
    ],
  },
  {
    month: 'May',
    events: [
      { date: '1–3 May', startDate: '2026-05-01', endDate: '2026-05-03', name: 'Dobrogea Calling', location: 'Dobrogea, Romania', type: 'trax', href: '/dobrogea-calling' },
      { date: '8–10 May', startDate: '2026-05-08', endDate: '2026-05-10', name: 'MotoRide Expo', location: 'Motor Park', type: 'radar', href: 'https://fb.me/e/3rtJMLVM8', note: 'Ride tests from all major motorcycle distributors' },
      { date: '9–10 May', startDate: '2026-05-09', endDate: '2026-05-10', name: 'Adventure Riders Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://tcsracingpark.ro/calendar/#' },
      { date: '14–17 May', startDate: '2026-05-14', endDate: '2026-05-17', name: 'Trails Adventure Camp', location: 'Vatra Dornei, Romania', type: 'radar', href: 'https://www.facebook.com/events/1944537056152121' },
      { date: '17 May', startDate: '2026-05-17', name: "Distinguished Gentleman's Ride", location: 'Bucharest', type: 'collective', href: 'https://www.gentlemansride.com/rides/romania/bucharest' },
      { date: '21–24 May', startDate: '2026-05-21', endDate: '2026-05-24', name: 'Treasure Hunt Țara Călățelului, ediția 3', location: 'Sâncraiu, Cluj', type: 'radar', href: 'https://fb.me/e/edxx6q1Us' },
      { date: '22 May', startDate: '2026-05-22', name: 'Moto24 Adventure Camp – Ride & Social 2026', location: 'Hotel TTS Covasna', type: 'radar', href: 'https://fb.me/e/5DIoTJCr7' },
      { date: '29 May', startDate: '2026-05-29', name: 'Pîr - Pîr - Poc, ediția 2026', location: 'Corbu', type: 'radar', href: 'https://www.facebook.com/events/1606159840719049' },
    ],
  },
  {
    month: 'June',
    events: [
      { date: '4–7 Jun', startDate: '2026-06-04', endDate: '2026-06-07', name: 'Roadbook Experience 2026', type: 'radar', href: 'https://fb.me/e/5zpeollje' },
      { date: '6–7 Jun', startDate: '2026-06-06', endDate: '2026-06-07', name: 'MX — CE 65/85/W · CB IV · CNIR et. IV', location: 'Ciolpani', type: 'collective', note: 'Campionat European, Campionat Balcanic & Campionat Național de MX', href: 'https://tcsracingpark.ro/calendar/#' },
      { date: '10–14 Jun', startDate: '2026-06-10', endDate: '2026-06-14', name: 'Roadbook Adventure Challenge', location: 'Munții Apuseni', type: 'collective', href: 'https://fb.me/e/483N1XZPm' },
      { date: '26–28 Jun', startDate: '2026-06-26', endDate: '2026-06-28', name: 'BMW GS Challenge', location: 'Merei Racing Park', type: 'collective', href: 'https://rideinromania.com/gschallenge/index.html' },
      { date: '27–28 Jun', startDate: '2026-06-27', endDate: '2026-06-28', name: 'Enduro Trail Adventure Challenge', location: 'Apuseni, Cluj', type: 'radar', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 2' },
    ],
  },
  {
    month: 'July',
    events: [
      { date: '10–18 Jul', startDate: '2026-07-10', endDate: '2026-07-18', name: 'RoRallyMarathon', location: 'Râmnicu Sărat, Romania', type: 'radar', href: 'https://www.facebook.com/RoRallyMarathon' },
      { date: '18–19 Jul', startDate: '2026-07-18', endDate: '2026-07-19', name: 'Touratech Rally Romania', location: 'Cheile Grădiștei', type: 'radar', href: 'https://fb.me/e/aPpmzzVS6' },
      { date: '28 Jul – 1 Aug', startDate: '2026-07-28', endDate: '2026-08-01', name: 'Red Bull Romaniacs', location: 'Sibiu', type: 'radar', href: 'https://www.redbullromaniacs.com/' },
    ],
  },
  {
    month: 'August',
    events: [
      { date: '1–2 Aug', startDate: '2026-08-01', endDate: '2026-08-02', name: 'Aristhrottle', location: 'Iași', type: 'radar', href: 'https://www.aristhrottle.ro/evenimente/' },
      { date: '5–10 Aug', startDate: '2026-08-05', endDate: '2026-08-10', name: 'Dusty Lizard', location: 'Apuseni', type: 'radar', href: 'https://moskomoto.eu/products/dusty-lizard-campout-romania' },
      { date: '14–16 Aug', startDate: '2026-08-14', endDate: '2026-08-16', name: 'Out There', location: 'Romania', type: 'trax', href: '/out-there' },
      { date: '28–30 Aug', startDate: '2026-08-28', endDate: '2026-08-30', name: 'HU Romania 2026', location: 'Cabana Bodvaj', type: 'radar', href: 'https://fb.me/e/4sygiyQ7s' },
      { date: '28–30 Aug', startDate: '2026-08-28', endDate: '2026-08-30', name: 'Carpathian Ridge', location: 'Carpathians, Romania', type: 'trax', href: '/carpathian-ridge' },
    ],
  },
  {
    month: 'September',
    events: [
      { date: '5–6 Sep', startDate: '2026-09-05', endDate: '2026-09-06', name: 'Hard Adventure Challenge', location: 'Cheile Grădiștei, Brașov', type: 'radar', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 3' },
      { date: '26–27 Sep', startDate: '2026-09-26', endDate: '2026-09-27', name: 'MT Teams Adventure Challenge', location: 'TCS Racing Park, Bucharest', type: 'collective', href: 'https://mt-challenge.cfmoto.ro/', note: 'CF Moto MT Challenge — Stage 4' },
    ],
  },
  {
    month: 'October',
    events: [
      { date: '9–11 Oct', startDate: '2026-10-09', endDate: '2026-10-11', name: 'Campionatul Național de Motocross — Etapă', location: 'TCS Racing Park, Bucharest', type: 'collective', note: 'Etapă din Campionatul Național de Motocross, sezonul 2026', href: 'https://tcsracingpark.ro/calendar/#' },
    ],
  },
  {
    month: 'November',
    events: [
      { date: '14 Nov', startDate: '2026-11-14', name: 'The Ground', location: 'TCS Racing Park, Bucharest', type: 'trax', href: '/the-ground' },
    ],
  },
];

export function getAllEvents(): CalendarEvent[] {
  return calendar.flatMap((group) => group.events);
}

export function getTraxEvents(): CalendarEvent[] {
  return getAllEvents().filter((e) => e.type === 'trax');
}
