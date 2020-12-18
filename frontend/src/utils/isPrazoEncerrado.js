import config from "@/config";

import { parseISO, format } from "date-fns";

export default function() {
  let { dataInicio, dataEncerramento } = config;

  dataInicio = format(parseISO(dataInicio), "dd/MM");
  dataEncerramento = format(parseISO(dataEncerramento), "dd/MM");

  const dataAtual = format(new Date(), "dd/MM");

  return dataAtual < dataInicio || dataAtual > dataEncerramento;
}
