"use client";
import Toast from "@/components/Toast/Toast";
import { IFetchParams, useFetch } from "@/hooks/useFetch";
import React, { useEffect } from "react";

interface Props {
  selectedNumber: number;
  flightId: string;
  onReservationSuccess: () => void;
}
interface ReservationResponse {
  message: string;
  isSuccess: boolean;
}

export function ReserveSeatForm({
  selectedNumber,
  flightId,
  onReservationSuccess,
}: Props) {
  const { fetcher, fetchingStatus, response, rowResponse } =
    useFetch<ReservationResponse>();

  const reserveSeatHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formaData = new FormData(event.currentTarget);

    const email = formaData.get("email");
    const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
    const header = new Headers();
    const token = window.localStorage.getItem("token");
    header.append("token", token!);

    const fetchParams = {
      url: `${baseUrl}/api/space-express/select-seat/reserveSeat/`,
      body: { flightId, seatNumber: selectedNumber, userEmail: email },
      method: "POST",
      headers: { "Content-Type": "application/json", token: token, email },
      credentials: "include",
    } as IFetchParams;

    fetcher(fetchParams);
    event.currentTarget.reset();
  };

  useEffect(() => {
    if (fetchingStatus === "succeeded") onReservationSuccess();
  }, [fetchingStatus]);

  return (
    <section className="w-1/3">
      <h3>Reserve seat</h3>
      <form onSubmit={reserveSeatHandler} className="flex flex-col gap-4">
        <p>Selected seat: {selectedNumber}</p>
        <label>Reserve the seat with your email</label>
        <input type="email" name="email" placeholder="email@email.com" />
        {fetchingStatus === "loading" ? (
          <span className="loader" />
        ) : (
          <button>Confirm reservation</button>
        )}
      </form>
      {fetchingStatus === "succeeded" && response?.message ? (
        <Toast>{<p>{response?.message}</p>}</Toast>
      ) : null}
    </section>
  );
}
