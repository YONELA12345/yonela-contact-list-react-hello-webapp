import React, { useState, useEffect } from "react";

const Modal = ({ show, contact, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        if (contact) {
            // Si estamos editando, rellenar el formulario con los datos del contacto
            setFormData({
                name: contact.name || "",
                address: contact.address || "",
                phone: contact.phone || "",
                email: contact.email || ""
            });
        } else {
            // Si estamos añadiendo un nuevo contacto, limpiamos el formulario
            setFormData({
                name: "",
                address: "",
                phone: "",
                email: ""
            });
        }
    }, [contact]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSubmit(formData); // Enviar los datos al componente padre (Contact)
        onClose(); // Cerrar el modal después de enviar los datos
    };

    if (!show) return null;

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2>{contact ? "Editar Contacto" : "Añadir Contacto"}</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Dirección"
                    value={formData.address}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Teléfono"
                    value={formData.phone}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Correo"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                />
                <div style={styles.buttonContainer}>
                    <button onClick={handleSubmit} style={styles.button}>
                        {contact ? "Guardar Cambios" : "Añadir Contacto"}
                    </button>
                    <button onClick={onClose} style={styles.button}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Estilos en línea
const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "400px",
        maxWidth: "90%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "4px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default Modal;
