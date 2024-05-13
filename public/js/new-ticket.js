const ticketBtn = document.querySelector(".btn");
ticketBtn.addEventListener("click", () => {
  generateTicket();
  getLastTicket();
});

async function getLastTicket() {
  await fetch("http://localhost:3000/api/ticket/last")
    .then((response) => response.json())
    .then((number) => ticketOnScreen(number))
    .catch((err) => console.log(err));
}

function ticketOnScreen(number) {
  const ticket = document.querySelector("#lbl-new-ticket");
  ticket.textContent = number;
}

async function generateTicket() {
  try {
    const response = await fetch('http://localhost:3000/api/ticket', {
        method: 'POST'
    }).then(response => response.json());
    
    ticketOnScreen(response.number);

  } catch (error) {
    console.log(error);
  }
}

getLastTicket();
