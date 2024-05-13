import { UuidAdapter } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/tickets/ticket";
import { WssService } from "./wss.service";

export class TicketService {
  constructor(private readonly wssService = WssService.instance) {}

  public tickets: Ticket[] = [
    { id: UuidAdapter.v4(), number: 1, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 2, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 3, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 4, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 5, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 6, createdAt: new Date(), done: false },
    { id: UuidAdapter.v4(), number: 7, createdAt: new Date(), done: false },
  ];

  private readonly workingOnTickets: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDesk);
  }

  public get lastTicketNumber(): Number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!?.number : 0;
  }

  public get lastWorkingOnTickets(): Ticket[] {
    return this.workingOnTickets.slice(0, 4);
  }

  public createTicket() {
    const ticket = {
      id: UuidAdapter.v4(),
      number: this.tickets.length + 1,
      createdAt: new Date(),
      done: false,
      handleAt: undefined,
      handleAtDesk: undefined,
    };

    this.tickets.push(ticket);
    this.onTicketNumberChange();
    return ticket;
  }

  public drawTicket(desk: string) {
    const ticket = this.tickets.find((t) => !t.handleAtDesk);
    if (!ticket)
      return { status: "error", message: "No hay tickets pendientes" };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({ ...ticket });

    this.onTicketNumberChange();
    this.onWorkingOnChanged()
    return { status: "ok", ticket };
  }

  public onFinishTicket(id: string) {
    const ticket = this.tickets.find((ticket) => ticket.id === id);
    if (!ticket) return { status: "error", message: "Ticket no ecnontrado" };

    this.tickets = this.tickets.map((ticket) => {
      if (ticket.id === id) {
        ticket.done = true;
      }

      return ticket;
    });

    return { status: "ok" };
  }

  private onTicketNumberChange() {
    this.wssService.sendMesssage(
      "on-ticket-count-changed",
      this.pendingTickets.length
    );
  }

  private onWorkingOnChanged() {
    this.wssService.sendMesssage("on-working-changed", this.lastWorkingOnTickets);
  }
}
