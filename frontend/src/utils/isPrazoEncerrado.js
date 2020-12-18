import config from "@/config";

import { parseISO, format } from "date-fns";

export default function() {
  let { dataAbertura, dataEncerramento } = config;

  dataAbertura = format(parseISO(dataAbertura), "dd/MM");
  dataEncerramento = format(parseISO(dataEncerramento), "dd/MM");

  const dataAtual = format(new Date(), "dd/MM");

  return dataAtual < dataAbertura || dataAtual > dataEncerramento;
}
