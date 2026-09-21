export type DecisionScoreInput = {
  votes: number;
  professionalIntent: number;
  betaInterest: number;
  paymentInterest: number;
  meaningfulUseCases: number;
};

export const defaultDecisionWeights = {
  votes: 1,
  professionalIntent: 1.5,
  betaInterest: 2,
  paymentInterest: 3,
  meaningfulUseCases: 0.5
};

export function decisionScore(input: DecisionScoreInput) {
  return (
    input.votes * defaultDecisionWeights.votes +
    input.professionalIntent * defaultDecisionWeights.professionalIntent +
    input.betaInterest * defaultDecisionWeights.betaInterest +
    input.paymentInterest * defaultDecisionWeights.paymentInterest +
    input.meaningfulUseCases * defaultDecisionWeights.meaningfulUseCases
  );
}
