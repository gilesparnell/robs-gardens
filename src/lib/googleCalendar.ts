import { gapi } from 'gapi-script';

// You need to replace these with your actual keys or use environment variables
// VITE_GOOGLE_API_KEY
// VITE_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export const initClient = (callback: (authorized: boolean) => void) => {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(callback);

      // Handle the initial sign-in state.
      callback(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, (error: any) => {
      console.error(JSON.stringify(error, null, 2));
    });
  });
};

export const signIn = () => {
  gapi.auth2.getAuthInstance().signIn();
};

export const signOut = () => {
  gapi.auth2.getAuthInstance().signOut();
};

export const listUpcomingEvents = async (calendarId: string = 'primary', timeMin: Date, timeMax: Date) => {
  try {
    const response = await gapi.client.calendar.events.list({
      'calendarId': calendarId,
      'timeMin': timeMin.toISOString(),
      'timeMax': timeMax.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 100,
      'orderBy': 'startTime'
    });
    return response.result.items;
  } catch (error) {
    console.error("Error fetching events", error);
    return [];
  }
};

export const createEvent = async (calendarId: string = 'primary', event: any) => {
  try {
    const response = await gapi.client.calendar.events.insert({
      'calendarId': calendarId,
      'resource': event,
    });
    return response.result;
  } catch (error) {
    console.error("Error creating event", error);
    throw error;
  }
};

export const updateEvent = async (calendarId: string = 'primary', eventId: string, event: any) => {
    try {
        const response = await gapi.client.calendar.events.update({
            'calendarId': calendarId,
            'eventId': eventId,
            'resource': event
        });
        return response.result;
    } catch (error) {
        console.error("Error updating event", error);
        throw error;
    }
}

export const deleteEvent = async (calendarId: string = 'primary', eventId: string) => {
    try {
        await gapi.client.calendar.events.delete({
            'calendarId': calendarId,
            'eventId': eventId
        });
        return true;
    } catch (error) {
        console.error("Error deleting event", error);
        throw error;
    }
}
