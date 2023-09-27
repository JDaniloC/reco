import { Proposta } from "@/models/Acordos";
import HistoryLineItem from "../HistoryLineItem/history-line-item";

interface HistoryLineProps {
  history: Proposta[];
}

export default function HistoryLine({ history }: HistoryLineProps) {
  return (
    <>
      <HistoryLineItem align="right" connect={true} />
      {history.map((proposal, index) => (
        <HistoryLineItem
          key={index}
          proposal={proposal}
          align={proposal.autor === "Bot" ? "right" : "left"}
          connect={index !== history.length - 1}
        />
      ))}
    </>
  );
}
