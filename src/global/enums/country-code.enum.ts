import { COUNTRIES } from '../constants';

export type CountryCode = (typeof COUNTRIES)[number]['alp3'];
export const CountryCode = Object.fromEntries(COUNTRIES.map((country) => [country.alp3, country.alp3])) as {
  [K in CountryCode]: K;
};
