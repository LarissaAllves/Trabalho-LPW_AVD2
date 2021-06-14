import React, { FormEvent, useEffect, useState } from "react";
import { api } from "../../services/api";

import "./styles.css";

interface IClient {
  cliente: string;
  telefone: string;
  email: string;
  id: string;
}

function Home() {
  const [name, setName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [email, setEmail] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

  async function getClients() {
    const { data } = await api.get("/clients");
    setClients(data);
  }

  useEffect(() => {
    getClients();
  }, []);

  async function sendData(event: FormEvent) {
    event.preventDefault();

    if (selectedClientId) {
      await api.put(`/clients/${selectedClientId}`, {
        cliente: name,
        telefone: cellphone,
        email: email,
      });
    } else {
      await api.post("/clients", {
        cliente: name,
        telefone: cellphone,
        email: email,
      });
    }
    setName("");
    setCellphone("");
    setEmail("");
    setSelectedClientId(null);
    getClients();
  }

  async function handleUpdate(id: string) {
    const client = clients.find((client: any) => client.id === id) as any;

    setName(client.cliente);
    setCellphone(client.telefone);
    setEmail(client.email);
    setSelectedClientId(client.id);
  }

  async function handleDelete(id: string) {
    await api.delete(`/clients/${id}`);

    getClients();
  }

  return (
    <div className="page">
      <form className="cadastro" onSubmit={sendData}>
        <label>Nome:</label>
        <input
          name="name"
          placeholder="Digite seu nome"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <label>Telefone:</label>
        <input
          name="cellphone"
          type="text"
          placeholder="Digite seu telefone"
          value={cellphone}
          onChange={(event) => setCellphone(event.target.value)}
        />
        <label>Email:</label>
        <input
          name="email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th colSpan={2}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {clients.map((client: IClient) => (
            <tr key={client.id}>
              <td>{client.cliente}</td>
              <td>{client.telefone}</td>
              <td>{client.email}</td>
              <td>
                <button onClick={() => handleUpdate(client.id)}>Alterar</button>
              </td>
              <td>
                <button
                  className="Excluir"
                  onClick={() => handleDelete(client.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Home };
