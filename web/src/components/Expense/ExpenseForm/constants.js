export const ACCOMODATIONTYPES = ['Hotel', 'Luxury Hotel', 'Standard']
export const CURRENCIES = [
  {
    id: 'c1e8a6a5-1',
    currency: 'USD',
    name: 'United States Dollar',
  },
  { id: 'c1e8a6a5-2', currency: 'EUR', name: 'Euro', exchangeRate: 11.2 },
  {
    id: 'c1e8a6a5-3',
    currency: 'JPY',
    name: 'Japanese Yen',
  },
  {
    id: 'c1e8a6a5-4',
    currency: 'GBP',
    name: 'British Pound Sterling',
  },
  {
    id: 'c1e8a6a5-5',
    currency: 'AUD',
    name: 'Australian Dollar',
  },
  {
    id: 'c1e8a6a5-6',
    currency: 'CAD',
    name: 'Canadian Dollar',
  },
  {
    id: 'c1e8a6a5-7',
    currency: 'CHF',
    name: 'Swiss Franc',
  },
  {
    id: 'c1e8a6a5-8',
    currency: 'CNY',
    name: 'Chinese Yuan Renminbi',
  },
  {
    id: 'c1e8a6a5-9',
    currency: 'HKD',
    name: 'Hong Kong Dollar',
  },
  {
    id: 'c1e8a6a5-10',
    currency: 'INR',
    name: 'Indian Rupee',
  },
]

export const EXCHANGE_RATES = {
  USD: 10.5,
  EUR: 11.2,
  JPY: 0.075,
  GBP: 13.0,
  AUD: 7.8,
  CAD: 8.1,
  CHF: 11.5,
  CNY: 1.5,
  HKD: 1.35,
  INR: 0.13,
}

export const COUNTRY_NAMES = [
  'Argentina',
  'Australia',
  'Austria',
  'Bangladesh',
  'Belgium',
  'Brazil',
  'Bulgaria',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Czech Republic',
  'Denmark',
  'Egypt',
  'Estonia',
  'Fiji',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hong Kong, China',
  'India',
  'Indonesia',
  'Ireland',
  'Iceland',
  'Israel',
  'Italy',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Korea',
  'Lithuania',
  'Latvia',
  'Macau, China',
  'Malaysia',
  'Maldives',
  'Mexico',
  'Netherlands',
  'New Zealand',
  'Norway',
  'Oman',
  'Panama',
  'Pakistan',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russian Federation',
  'Saudi Arabia',
  'Serbia',
  'Singapore',
  'South Africa',
  'South Korea',
  'Spain (Canarias)',
  'Spain (Baleares)',
  'Spain',
  'Sweden',
  'Switzerland',
  'Taiwan, China',
  'Thailand',
  'Turkey',
  'United Arab Emirates',
  'United States',
  'Great Britain',
  'Great Britain (London)',
  'Vietnam',
]

export const CURRENCIES_OF_COUTRIES = [
  { label: 'Argentine Peso', value: 'ARS' },
  { label: 'Australian Dollar', value: 'AUD' },
  { label: 'Euro', value: 'EUR' }, // Covers Austria, Belgium, Croatia, Estonia, Finland, France, Germany, Greece, Ireland, Italy, Lithuania, Latvia, Netherlands, Portugal, Spain
  { label: 'Bangladeshi Taka', value: 'BDT' },
  { label: 'Brazilian Real', value: 'BRL' },
  { label: 'Bulgarian Lev', value: 'BGN' },
  { label: 'Canadian Dollar', value: 'CAD' },
  { label: 'Chilean Peso', value: 'CLP' },
  { label: 'Chinese Yuan', value: 'CNY' },
  { label: 'Colombian Peso', value: 'COP' },
  { label: 'Costa Rican Colón', value: 'CRC' },
  { label: 'Cuban Peso', value: 'CUP' },
  { label: 'Czech Koruna', value: 'CZK' },
  { label: 'Danish Krone', value: 'DKK' },
  { label: 'Egyptian Pound', value: 'EGP' },
  { label: 'Fijian Dollar', value: 'FJD' },
  { label: 'Hong Kong Dollar', value: 'HKD' },
  { label: 'Indian Rupee', value: 'INR' },
  { label: 'Indonesian Rupiah', value: 'IDR' },
  { label: 'Icelandic Króna', value: 'ISK' },
  { label: 'Israeli New Shekel', value: 'ILS' },
  { label: 'Japanese Yen', value: 'JPY' },
  { label: 'Jordanian Dinar', value: 'JOD' },
  { label: 'Kazakhstani Tenge', value: 'KZT' },
  { label: 'South Korean Won', value: 'KRW' },
  { label: 'Macanese Pataca', value: 'MOP' },
  { label: 'Malaysian Ringgit', value: 'MYR' },
  { label: 'Maldivian Rufiyaa', value: 'MVR' },
  { label: 'Mexican Peso', value: 'MXN' },
  { label: 'New Zealand Dollar', value: 'NZD' },
  { label: 'Norwegian Krone', value: 'NOK' },
  { label: 'Omani Rial', value: 'OMR' },
  { label: 'Panamanian Balboa', value: 'PAB' },
  { label: 'Pakistani Rupee', value: 'PKR' },
  { label: 'Peruvian Sol', value: 'PEN' },
  { label: 'Philippine Peso', value: 'PHP' },
  { label: 'Polish Złoty', value: 'PLN' },
  { label: 'Qatari Riyal', value: 'QAR' },
  { label: 'Romanian Leu', value: 'RON' },
  { label: 'Russian Ruble', value: 'RUB' },
  { label: 'Saudi Riyal', value: 'SAR' },
  { label: 'Serbian Dinar', value: 'RSD' },
  { label: 'Singapore Dollar', value: 'SGD' },
  { label: 'South African Rand', value: 'ZAR' },
  { label: 'Swedish Krona', value: 'SEK' },
  { label: 'Swiss Franc', value: 'CHF' },
  { label: 'New Taiwan Dollar', value: 'TWD' },
  { label: 'Thai Baht', value: 'THB' },
  { label: 'Turkish Lira', value: 'TRY' },
  { label: 'UAE Dirham', value: 'AED' },
  { label: 'United States Dollar', value: 'USD' },
  { label: 'British Pound Sterling', value: 'GBP' },
  { label: 'Vietnamese Dong', value: 'VND' },
]

export const COUNTRY_EMISSIONS = {
  Argentina: 15.3,
  Australia: 35,
  Austria: 10.3,
  Bangladesh: 112.25,
  Belgium: 12.2,
  Brazil: 9.7,
  Bulgaria: 27.65,
  Canada: 9.75,
  Chile: 27.6,
  China: 53.5,
  Colombia: 14.7,
  'Costa Rica': 4.7,
  Croatia: 11.7,
  Cuba: 32.12,
  'Czech Republic': 20.8,
  Denmark: 10.34,
  Egypt: 44.2,
  Estonia: 32.45,
  Fiji: 75.65,
  Finland: 12.23,
  France: 9.74,
  Germany: 13.2,
  Greece: 30.1,
  'Hong Kong, China': 51.5,
  India: 58.9,
  Indonesia: 62.7,
  Ireland: 26.15,
  Iceland: 10.31,
  Israel: 48.62,
  Italy: 14.3,
  Japan: 39,
  Jordan: 68.9,
  Kazakhstan: 73.45,
  Korea: 55.8,
  Lithuania: 21.85,
  Latvia: 20.56,
  'Macau, China': 79.3,
  Malaysia: 61.5,
  Maldives: 152.2,
  Mexico: 19.3,
  Netherlands: 14.8,
  'New Zealand': 10.3,
  Norway: 11.45,
  Oman: 90.3,
  Panama: 23.1,
  Pakistan: 52.25,
  Peru: 16.6,
  Philippines: 54.3,
  Poland: 30.45,
  Portugal: 19,
  Qatar: 86.2,
  Romania: 16.8,
  'Russian Federation': 24.2,
  'Saudi Arabia': 106.4,
  Serbia: 50.76,
  Singapore: 24.5,
  'South Africa': 51.4,
  'South Korea': 45.76,
  'Spain (Canarias)': 45.65,
  'Spain (Baleares)': 32.74,
  Spain: 11.64,
  Sweden: 11.75,
  Switzerland: 10.3,
  'Taiwan, China': 46.6,
  Thailand: 43.4,
  Turkey: 32.1,
  'United Arab Emirates': 63.8,
  'United States': 16.1,
  'Great Britain': 10.4,
  'Great Britain (London)': 11.5,
  Vietnam: 38.5,
}

export const VEHICLE_TYPE_LIST = [
  'Motorbike',
  'Mini',
  'Lower medium',
  'Executive',
  'Luxury car',
  'SUV or Pickup',
  'Multi purpose(MPV)',
  'Small van',
  'Large van',
  'Heavy truck',
]

export const VEHICLE_ECONOMY = {
  Motorbike: 3.5,
  Mini: 4.5,
  'Lower medium': 5.5,
  Executive: 8,
  'Luxury car': 8,
  'SUV or Pickup': 9,
  'Multi purpose(MPV)': 7.5,
  'Small van': 10,
  'Large van': 15,
  'Heavy truck': 36,
}

export const FUEL_TYPE_LIST = [
  {
    value: 'PetrolForecourt',
    label: 'Petrol bio-blend',
  },
  {
    value: 'DieselForecourt',
    label: 'Diesel bio-blend',
  },
  { value: 'FuelOil', label: 'Heating/Fuel Oil' },
  {
    value: 'CNG',
    label: 'Compressed natural gas',
  },
  { value: 'NaturalGas', label: 'Natural gas' },
  { value: 'LNG', label: 'LPG / Propane' },
  { value: 'CoalIndustrial', label: 'Coal' },
  { value: 'HVO100', label: 'HVO100' },
]

export const AIRPORTS = [
  { label: 'Islamabad International Airport', value: 'ISB' },
  { label: 'Los Angeles International Airport', value: 'LAX' },
  { label: 'Dubai International Airport', value: 'DXB' },
  { label: 'Heathrow Airport', value: 'LHR' },
  { label: 'John F. Kennedy International Airport', value: 'JFK' },
  { label: 'Singapore Changi Airport', value: 'SIN' },
  { label: 'Sydney Kingsford Smith Airport', value: 'SYD' },
  { label: 'Tokyo Haneda Airport', value: 'HND' },
  { label: 'Frankfurt Airport', value: 'FRA' },
  { label: 'Oslo Gardermoen Airport', value: 'OSL' },
]

export const sectors = [
  {
    label: 'Insurance and Financial Services',
    value: '0.059',
  },
  {
    label: 'Information and Communication',
    value: '0.09',
  },
  {
    label: 'Clothing and Footwear',
    value: '0.205',
  },
  {
    label: 'Food/Beverages/Tobacco',
    value: '0.579',
  },
  {
    label: 'Red meat products',
    value: '2.471',
  },
  {
    label: 'Furnishings and Household',
    value: '0.255',
  },
  {
    label: 'General Retail',
    value: '0.242',
  },
  {
    label: 'Recreation and Culture',
    value: '0.087',
  },
  {
    label: 'Health services',
    value: '0.109',
  },
  {
    label: 'Professional services(misc)',
    value: '0.096',
  },
  {
    label: 'Restaurant and other hotelservices',
    value: '0.155',
  },
  {
    label: 'Other sectors or categories',
    value: '0.196',
  },
]

export const FLIGHT_CLASSES = [
  { name: 'Economy', value: 'economy' },
  { name: 'Premium Economy', value: 'premium_economy' },
  { name: 'Business', value: 'business' },
  { name: 'First', value: 'first' },
]

export const AIRLINES = [
  { label: 'AA', value: 'AA' },
  { label: 'AB', value: 'AB' },
  { label: 'AC', value: 'AC' },
  { label: 'AF', value: 'AF' },
  { label: 'AI', value: 'AI' },
  { label: 'AM', value: 'AM' },
  { label: 'AR', value: 'AR' },
  { label: 'AS', value: 'AS' },
  { label: 'AT', value: 'AT' },
  { label: 'AV', value: 'AV' },
  { label: 'AY', value: 'AY' },
  { label: 'AZ', value: 'AZ' },
  { label: 'BA', value: 'BA' },
  { label: 'BD', value: 'BD' },
  { label: 'BE', value: 'BE' },
  { label: 'BG', value: 'BG' },
  { label: 'BI', value: 'BI' },
  { label: 'BJ', value: 'BJ' },
  { label: 'BL', value: 'BL' },
  { label: 'BM', value: 'BM' },
  { label: 'BR', value: 'BR' },
  { label: 'BT', value: 'BT' },
  { label: 'CA', value: 'CA' },
  { label: 'CI', value: 'CI' },
  { label: 'CK', value: 'CK' },
  { label: 'CM', value: 'CM' },
  { label: 'CX', value: 'CX' },
  { label: 'CZ', value: 'CZ' },
  { label: 'DE', value: 'DE' },
  { label: 'DL', value: 'DL' },
  { label: 'DY', value: 'DY' },
  { label: 'EK', value: 'EK' },
  { label: 'ET', value: 'ET' },
  { label: 'EY', value: 'EY' },
  { label: 'FI', value: 'FI' },
  { label: 'FJ', value: 'FJ' },
  { label: 'GA', value: 'GA' },
  { label: 'GF', value: 'GF' },
  { label: 'HA', value: 'HA' },
  { label: 'HM', value: 'HM' },
  { label: 'IB', value: 'IB' },
  { label: 'IC', value: 'IC' },
  { label: 'IR', value: 'IR' },
  { label: 'IZ', value: 'IZ' },
  { label: 'JL', value: 'JL' },
  { label: 'JQ', value: 'JQ' },
  { label: 'KE', value: 'KE' },
  { label: 'KL', value: 'KL' },
  { label: 'KQ', value: 'KQ' },
  { label: 'LA', value: 'LA' },
  { label: 'LG', value: 'LG' },
  { label: 'LH', value: 'LH' },
  { label: 'LO', value: 'LO' },
  { label: 'LX', value: 'LX' },
  { label: 'LY', value: 'LY' },
  { label: 'MF', value: 'MF' },
  { label: 'MH', value: 'MH' },
  { label: 'MK', value: 'MK' },
  { label: 'MS', value: 'MS' },
  { label: 'MU', value: 'MU' },
  { label: 'NH', value: 'NH' },
  { label: 'NZ', value: 'NZ' },
  { label: 'OA', value: 'OA' },
  { label: 'OK', value: 'OK' },
  { label: 'OM', value: 'OM' },
  { label: 'OS', value: 'OS' },
  { label: 'OU', value: 'OU' },
  { label: 'OZ', value: 'OZ' },
  { label: 'PG', value: 'PG' },
  { label: 'PK', value: 'PK' },
  { label: 'PR', value: 'PR' },
  { label: 'PS', value: 'PS' },
  { label: 'PX', value: 'PX' },
  { label: 'PZ', value: 'PZ' },
  { label: 'QF', value: 'QF' },
  { label: 'QR', value: 'QR' },
  { label: 'RJ', value: 'RJ' },
  { label: 'RO', value: 'RO' },
  { label: 'SA', value: 'SA' },
  { label: 'SK', value: 'SK' },
  { label: 'SN', value: 'SN' },
  { label: 'SQ', value: 'SQ' },
  { label: 'SU', value: 'SU' },
  { label: 'SV', value: 'SV' },
  { label: 'S7', value: 'S7' },
  { label: 'TA', value: 'TA' },
  { label: 'TG', value: 'TG' },
  { label: 'TK', value: 'TK' },
  { label: 'TN', value: 'TN' },
  { label: 'TP', value: 'TP' },
  { label: 'UA', value: 'UA' },
  { label: 'UK', value: 'UK' },
  { label: 'UL', value: 'UL' },
  { label: 'US', value: 'US' },
  { label: 'UT', value: 'UT' },
  { label: 'UX', value: 'UX' },
  { label: 'VN', value: 'VN' },
  { label: 'VS', value: 'VS' },
  { label: 'VV', value: 'VV' },
  { label: 'VX', value: 'VX' },
  { label: 'VY', value: 'VY' },
  { label: 'WB', value: 'WB' },
  { label: 'WY', value: 'WY' },
  { label: 'XQ', value: 'XQ' },
  { label: 'XR', value: 'XR' },
  { label: 'XW', value: 'XW' },
  { label: 'XY', value: 'XY' },
  { label: 'ZH', value: 'ZH' },
]

export const FEUL_FACTORS_DATA = {
  Butane: {
    name: 'Butane',
    unit: 'litres',
    scope1: 1.74529,
    scope3: 0.19686,
    kwh: 7.711728,
  },
  CNG: {
    name: 'Compressed Natural Gas',
    unit: 'litres',
    scope1: 0.44423,
    scope3: 0.09487,
    kwh: 2.5,
  },
  LNG: {
    name: 'Liquefied Natural Gas',
    unit: 'litres',
    scope1: 1.15623,
    scope3: 0.39925,
    kwh: 6.25,
  },
  LPG: {
    name: 'Liquefied Petroleum Gas',
    unit: 'litres',
    scope1: 1.55709,
    scope3: 0.18383,
    kwh: 7.445,
  },
  NaturalGas: {
    name: 'Natural gas',
    unit: 'cubic/m3',
    scope1: 2.02135,
    scope3: 0.34593,
    kwh: 11.02,
  },
  NaturalGas100: {
    name: 'Natural gas (100% mineral blend)',
    unit: 'cubic/m3',
    scope1: 2.03473,
    scope3: 0.34593,
    kwh: 11.02,
  },
  OtherPetroleumGas: {
    name: 'Other petroleum gas',
    unit: 'litres',
    scope1: 0.94441,
    scope3: 0.11154,
    kwh: 4.2,
  },
  Propane: {
    name: 'Propane',
    unit: 'litres',
    scope1: 1.54354,
    scope3: 0.18046,
    kwh: 7.445,
  },
  AviationSpirit: {
    name: 'Aviation spirit',
    unit: 'litres',
    scope1: 2.33048,
    scope3: 0.59512,
    kwh: 9.306,
  },
  AviationTurbineFuel: {
    name: 'Aviation turbine fuel',
    unit: 'litres',
    scope1: 2.54514,
    scope3: 0.52686,
    kwh: 9.75,
  },
  BurningOil: {
    name: 'Burning oil',
    unit: 'litres',
    scope1: 2.54014,
    scope3: 0.52807,
    kwh: 10.31,
  },
  DieselForecourt: {
    name: 'Diesel (average biofuel blend)',
    unit: 'litres',
    scope1: 2.51233,
    scope3: 0.60986,
    kwh: 10.96,
  },
  Diesel100: {
    name: 'Diesel (100% mineral diesel)',
    unit: 'litres',
    scope1: 2.70553,
    scope3: 0.62874,
    kwh: 10.96,
  },
  FuelOil: {
    name: 'Fuel oil',
    unit: 'litres',
    scope1: 3.17522,
    scope3: 0.69723,
    kwh: 11.84,
  },
  GasOil: {
    name: 'Gas oil (red diesel)',
    unit: 'litres',
    scope1: 2.75857,
    scope3: 0.63253,
    kwh: 10.96,
  },
  Lubricants: {
    name: 'Lubricants',
    unit: 'litres',
    scope1: 2.74972,
    scope3: 0.712227636,
    kwh: 10.96,
  },
  Naphtha: {
    name: 'Naphtha',
    unit: 'litres',
    scope1: 2.11926,
    scope3: 0.43210227,
    kwh: 9.85,
  },
  PetrolForecourt: {
    name: 'Petrol (average biofuel blend)',
    unit: 'litres',
    scope1: 2.19352,
    scope3: 0.61328,
    kwh: 9.61,
  },
  Petrol100: {
    name: 'Petrol (100% mineral petrol)',
    unit: 'litres',
    scope1: 2.33969,
    scope3: 0.60283,
    kwh: 9.61,
  },
  ProcessedResidual: {
    name: 'Processed fuel oils - residual oil',
    unit: 'litres',
    scope1: 3.17522,
    scope3: 0.82185,
    kwh: 10.53,
  },
  ProcessedDistillate: {
    name: 'Processed fuel oils - distillate oil',
    unit: 'litres',
    scope1: 2.75857,
    scope3: 0.70791,
    kwh: 10.53,
  },
  RefineryMisc: {
    name: 'Refinery miscellaneous',
    unit: 'kg',
    scope1: 2.94482,
    scope3: 0.34679114,
    kwh: 10.34,
  },
  WasteOil: {
    name: 'Waste oils',
    unit: 'litres',
    scope1: 2.75368,
    scope3: 0,
    kwh: 10.53,
  },
  HVO100: {
    name: 'HVO100',
    unit: 'litres',
    scope1: 0.03558,
    scope3: 0.2132,
    kwh: 9.93,
  },
  MarineGasOil: {
    name: 'Marine gas oil',
    unit: 'litres',
    scope1: 2.77539,
    scope3: 0.63253,
    kwh: 10.53,
  },
  MarineFuelOil: {
    name: 'Marine fuel oil',
    unit: 'litres',
    scope1: 3.10669,
    scope3: 0.69723,
    kwh: 10.53,
  },
  Fuel: {
    name: 'Fuel',
    unit: 'kg',
    scope1: 2.40384,
    scope3: 0.39314029,
    kwh: 9.89,
  },
  CoalIndustrial: {
    name: 'Coal (industrial)',
    unit: 'kg',
    scope1: 2.40384,
    scope3: 0.39314029,
    kwh: 7.25,
  },
  'Coal (electricity generation)': {
    name: 'Coal (electricity generation)',
    unit: 'kg',
    scope1: 2.25234,
    scope3: 0.37227789,
    kwh: 7.25,
  },
  'Coal (domestic)': {
    name: 'Coal (domestic)',
    unit: 'kg',
    scope1: 2.88326,
    scope3: 0.4427895,
    kwh: 7.25,
  },
  'Coking coal': {
    name: 'Coking coal',
    unit: 'kg',
    scope1: 3.16524,
    scope3: 0.46796718,
    kwh: 8.33,
  },
  'Petroleum coke': {
    name: 'Petroleum coke',
    unit: 'kg',
    scope1: 3.38686,
    scope3: 0.39924907,
    kwh: 9.85,
  },
}

export const BUCKET_TYPES = [
  { name: 'Vegetarian', value: 21.2 },
  { name: 'Average basket', value: 31.3 },
  { name: 'Meat and dairy heavy', value: 45.2 },
]
