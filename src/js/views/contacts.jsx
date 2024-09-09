import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Pencil, Trash2, User, ArrowLeft } from "lucide-react";
import Modal from "./../component/modal.jsx";
import "../../styles/contact.css";

const Contact = () => {
  const { slug } = useParams();
  const { store, actions } = useContext(Context);

  const [showModal, setShowModal] = useState(false); // Estado para controlar si el modal está visible
  const [editingContact, setEditingContact] = useState(null); // Estado para el contacto en edición

  useEffect(() => {
    actions.loadContacts(slug); // Cargar los contactos cuando el componente se monta
  }, [slug, actions]);

  const contacts = store.contacts[slug]?.contacts || [];

  // Función para manejar el envío de un nuevo contacto o la actualización de un contacto existente
  const handleSaveContact = (contactData) => {
    if (editingContact) {
      // Si estamos editando un contacto existente, realizamos un PUT
      actions.updateContact(slug, editingContact.id, contactData)
        .then(() => {
          console.log("Contacto actualizado correctamente.");
          setShowModal(false); // Cierra el modal después de actualizar el contacto
          setEditingContact(null); // Resetea el contacto en edición
        })
        .catch((error) => {
          console.error("Error actualizando contacto:", error);
        });
    } else {
      // Si no estamos editando, creamos un nuevo contacto
      actions.addContactToAgenda(slug, contactData)
        .then(() => {
          console.log("Contacto añadido correctamente.");
          setShowModal(false); // Cierra el modal después de añadir el contacto
        })
        .catch((error) => {
          console.error("Error añadiendo contacto:", error);
        });
    }
  };

  // Función para manejar la eliminación de un contacto
  const handleDeleteContact = (contactId) => {
    actions.deleteContact(slug, contactId)
      .then(() => {
        console.log(`Contacto ${contactId} eliminado correctamente.`);
      })
      .catch((error) => {
        console.error("Error eliminando contacto:", error);
      });
  };

  // Función para manejar la edición de un contacto (abrir modal con datos existentes)
  const handleEditContact = (contact) => {
    setEditingContact(contact); // Establecer el contacto en edición
    setShowModal(true); // Abrir el modal
  };

  return (
    <div className="contact-list-container">
      <div className="contact-list-header">
        <h2 className="contact-list-title">Contactos de la agenda: {slug}</h2>
        <button className="custom-button" onClick={() => setShowModal(true)}>
          Añadir nuevo contacto
        </button>
      </div>
      <div className="contact-list-scrollable">
        {contacts.length > 0 ? (
          <div className="contact-list">
            {contacts.map((contact) => (
              <div key={contact.id} className="contact-card">
                <User size={40} className="user-icon" /> {/* Ícono de usuario */}
                <div className="contact-info">
                  <h3 className="contact-name">{contact.name}</h3>
                  <p className="contact-detail">
                    <span className="contact-icon">📍</span>
                    {contact.address}
                  </p>
                  <p className="contact-detail">
                    <span className="contact-icon">📞</span>
                    {contact.phone}
                  </p>
                  <p className="contact-detail">
                    <span className="contact-icon">✉️</span>
                    {contact.email}
                  </p>
                </div>
                <div className="contact-actions">
                  <button className="edit-button" onClick={() => handleEditContact(contact)}>
                    <Pencil size={20} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-contacts-message">No se encontraron contactos para esta agenda.</p>
        )}
      </div>
      <Link to="/" className="back-button">
        <ArrowLeft size={20} /> {/* Ícono de flecha hacia atrás */}
      </Link>

      {/* Modal para añadir o editar contacto */}
      {showModal && (
        <Modal
          show={showModal}
          contact={editingContact} // Pasamos el contacto a editar si existe
          onClose={() => {
            setShowModal(false);
            setEditingContact(null); // Limpiar el contacto en edición cuando se cierra el modal
          }}
          onSubmit={handleSaveContact} // Enviar los datos al componente padre
        />
      )}
    </div>
  );
};

export default Contact;
