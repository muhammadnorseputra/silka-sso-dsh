type Session = {
  token: string;
};

const sessions = new Map<string, Session>();

export function createSession(session: Session) {
  sessions.set(session.token, session);
}

export function getSessionMemory(token: string) {
  return sessions.get(token);
}

export function removeSession(token: string) {
  sessions.delete(token);
}
