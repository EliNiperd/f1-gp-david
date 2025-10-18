const BASE_URL = 'https://api.openf1.org/v1';

export async function getSession(meetingKey: number) {
  const response = await fetch(`${BASE_URL}/sessions?meeting_key=${meetingKey}&session_name=Race`);
  const data = await response.json();
  return data[0];
}

export async function getLaps(sessionKey: number) {
  const response = await fetch(`${BASE_URL}/laps?session_key=${sessionKey}`);
  const data = await response.json();
  return data;
}
