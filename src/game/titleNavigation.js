export const canContinueTrace = onboarding => Boolean(onboarding?.profileCreated);

export const getTraceContinuationScreen = onboarding => {
  if (!canContinueTrace(onboarding)) return 'profile';
  return onboarding?.prologueCompleted ? 'hub' : 'prologue';
};
