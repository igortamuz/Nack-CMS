import tw from "twin.macro";

export const Ticket = tw.button`
  col-span-1
  flex
  justify-center
  items-center
  h-2 px-2 py-4 mx-2 mt-2
  bg-blue-700
  text-white
  font-semibold
  rounded
`
export const TicketArea = tw.div`grid lg:grid-cols-12 md:gap-2 grid-cols-6 col-span-9 gap-1`