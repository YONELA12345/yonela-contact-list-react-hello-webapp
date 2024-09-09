import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Book = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [newAgendaName, setNewAgendaName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        actions.loadAgendas();
    }, []);

    const handleCreateAgenda = async (e) => {
        e.preventDefault();
        if (newAgendaName.trim() !== "") {
            try {
                const newAgenda = await actions.createAgenda(newAgendaName);
                console.log("New agenda created:", newAgenda);
                setNewAgendaName("");
                setError("");
                actions.loadAgendas();  // Recargar las agendas después de crear una nueva
            } catch (error) {
                console.error("Error in handleCreateAgenda:", error);
                setError(`Failed to create agenda: ${error.message}`);
            }
        }
    };

    return (
        <div className="container agenda-container">
            <h2 className="agenda-title">Create New Agenda</h2>
            <form onSubmit={handleCreateAgenda} className="agenda-form">
                <input
                    type="text"
                    className="agenda-input"
                    placeholder="Enter new agenda name"
                    value={newAgendaName}
                    onChange={(e) => setNewAgendaName(e.target.value)}
                />

            </form>
            {error && <div className="error-message">{error}</div>}

            <h3 className="existing-agendas-title" style={{ paddingTop: '20px' }}>Existing Agendas</h3>
            <ul className="agenda-list">
                {Array.isArray(store.agendas.agendas) && store.agendas.agendas.map((agenda) => (
                    <li key={agenda.id} className="agenda-item">
                        {agenda.slug}
                        <Link to={`/contacts/${agenda.slug}`} className="view-details-link">
                            <i className="fas fa-eye"></i> {/* Ícono del ojo */}
                        </Link>
                    </li>
                ))}
            </ul>
            <br />
        </div>
    );
};

export default Book;
