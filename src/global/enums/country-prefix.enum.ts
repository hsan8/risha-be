import { COUNTRIES } from '../constants';

export type CountryMobileCode = (typeof COUNTRIES)[number]['prefix'];
export const CountryMobileCode = Object.fromEntries(COUNTRIES.map((country) => [country.name, country.prefix])) as {
  [K in (typeof COUNTRIES)[number]['name']]: string;
};
