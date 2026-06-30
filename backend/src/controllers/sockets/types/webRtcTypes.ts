interface OfferPayload {
  to: string;
  offer: RTCSessionDescriptionInit;
}

interface AnswerPayload {
  to: string;
  answer: RTCSessionDescriptionInit;
}

interface IceCandidatePayload {
  to: string;
  candidate: RTCIceCandidateInit;
}

export type {OfferPayload,AnswerPayload,IceCandidatePayload}