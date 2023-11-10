"use client";

import { IFetchParams, useFetch } from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { ReserveSeatForm } from "./ReserveSeatForm/ReserveSeatForm";
import Toast from "@/components/Toast/Toast";
import Navigation from "@/components/Navigation/Navigation";
import Link from "next/link";
interface Props {
  flightId: string;
}

export interface Seat {
  flightId: string;
  free: boolean;
  reservationDate: string;
  seatNumber: number;
}

interface SeatsResponse {
  message: string;
  seats: Seat[];
}
export const SelectSeatPage = ({ flightId }: Props) => {
  const [token, setToken] = useState<string>();
  console.log(token);

  const { fetcher, fetchingStatus, response, rowResponse } =
    useFetch<SeatsResponse>();
  const [selectedNumber, setSelectedNumber] = useState<number>();

  const selectNumberHandler = (seatNumber: number) => {
    setSelectedNumber(seatNumber);
  };

  const baseUrl = process.env.NEXT_PUBLIC_AUTH_API_BASE_URL;
  const header = new Headers();
  header.append("token", token!);

  const fetchParams = {
    url: `${baseUrl}/api/space-express/select-seat/getSeats/`,
    method: "GET",
    headers: { "Content-Type": "application/json", token: token, id: flightId },
  } as IFetchParams;

  const fetchSeatsAvailability = () => {
    fetcher(fetchParams);
    setSelectedNumber(undefined);
  };

  useEffect(() => {
    setToken(window.localStorage.getItem("token") ?? "  ");
    if (token) fetchSeatsAvailability();
  }, [token]);

  return (
    <main>
      {response?.message ? <Toast>{response.message}</Toast> : null}
      <span className="absolute top-4 right-4">
        <Navigation />
      </span>
      {rowResponse?.status !== 403 ? (
        <>
          {" "}
          <h2>Select your seat</h2>
          <p>Flight id: {flightId}</p>
          <div className=" flex justify-between p-24">
            <section className="flex gap-3 flex-wrap w-1/3">
              {fetchingStatus === "succeeded" && rowResponse?.ok
                ? response?.seats.map((seat) =>
                    seat.free ? (
                      <span
                        key={seat.seatNumber}
                        onClick={() => selectNumberHandler(seat.seatNumber)}
                        className="p-4 bg-green-400 w-20 text-center clickable text-white rounded-md "
                      >
                        {seat.seatNumber}
                      </span>
                    ) : (
                      <span
                        key={seat.seatNumber}
                        className="p-4 bg-red-400 w-20 text-center text-white rounded-md"
                      >
                        {seat.seatNumber}
                      </span>
                    )
                  )
                : null}
            </section>
            {selectedNumber ? (
              <ReserveSeatForm
                flightId={flightId}
                selectedNumber={selectedNumber}
                onReservationSuccess={fetchSeatsAvailability}
              />
            ) : null}
          </div>
        </>
      ) : (
        <>
          <h2>You need to be logged</h2>
          <Link href="/login"> Login</Link>
        </>
      )}
    </main>
  );
};
