import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query {
    events {
      id
      title
      description
      organizer
      dateTime
      location
      participants
      ticketPrice
      ticketLimit
      availableTickets
    }
  }
`;

export const GET_EVENT = gql`
  query ($id: ID!) {
    eventById(id: $id) {
      id
      title
      description
      dateTime
      location
      organizer
      participants
      ticketLimit
      ticketPrice
    }
  }
`;

export const GET_EVENT_DETAILS = gql`
  query ($id: ID!) {
    eventById(id: $id) {
      id
      title
      description
      dateTime
      location
      organizer
      participants
      ticketLimit
      ticketPrice
    }
    availableTickets(eventId: $id)
  }
`;

export const CREATE_RESERVATION = gql`
  mutation ($eventId: ID!, $quantity: Int!) {
    createReservation(eventId: $eventId, quantity: $quantity) {
      id
      quantity
      totalAmount
      status
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation ($input: EventInput!) {
    createEvent(input: $input) {
      id
      title
      dateTime
      location
      ticketLimit
      ticketPrice
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation ($id: ID!, $input: EventInput!) {
    updateEvent(id: $id, input: $input) {
      id
      title
      dateTime
      location
      ticketLimit
      ticketPrice
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation ($id: ID!) {
    deleteEvent(id: $id)
  }
`;

export const PAY_RESERVATION = gql`
  mutation ($reservationId: ID!, $simulateSuccess: Boolean!) {
    payReservation(reservationId: $reservationId, simulateSuccess: $simulateSuccess) {
      id
      status
      amount
    }
  }
`;

export const MY_RESERVATIONS = gql`
  query {
    myReservations {
      id
      quantity
      totalAmount
      status
      event { id title dateTime }
    }
  }
`;

export const ADMIN_STATS = gql`
  query {
    adminStats {
      eventsCount
      ticketsSold
      revenue
    }
  }
`;
