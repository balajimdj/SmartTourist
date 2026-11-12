export const detectRisk = ({ restricted = false, unexpectedJump = false, staleLocation = false, recentEmergencies = 0 }) => {
  let score = 0
  const reasons = []
  if (restricted) {
    score += 45
    reasons.push('Your last reported location is inside a restricted zone.')
  }
  if (unexpectedJump) {
    score += 30
    reasons.push('An unusually large change in location was detected.')
  }
  if (staleLocation) {
    score += 15
    reasons.push('Location has not been refreshed recently.')
  }
  if (recentEmergencies > 1) {
    score += Math.min(30, (recentEmergencies - 1) * 15)
    reasons.push('Multiple SOS alerts were reported recently.')
  }
  const boundedScore = Math.min(100, score)
  return {
    score: boundedScore,
    level: boundedScore <= 30 ? 'Low' : boundedScore <= 60 ? 'Medium' : 'High',
    reasons,
    explanation: 'Rule-based demonstration only — this is not a trained AI model.',
  }
}
